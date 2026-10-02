/* CCB 媒体选源与 Range 调度内核。可在浏览器和 Node 测试中独立使用。 */
;(function (root, factory) {
    const api = factory()
    if (typeof module === 'object' && module.exports) module.exports = api
    else root.CcbCore = api
})(typeof globalThis === 'object' ? globalThis : this, function () {
    'use strict'
    const MIRRORS = ['upos-sz-mirrorali.bilivideo.com', 'upos-sz-mirrorcos.bilivideo.com',
        'upos-sz-mirrorhw.bilivideo.com', 'upos-sz-mirror08c.bilivideo.com']
    const BUDGET = 16 * 1024 * 1024
    const CHUNK = 512 * 1024
    const abortError = () => new DOMException('请求已取消', 'AbortError')
    const ordinary = value => {
        try {
            const u = new URL(value)
            return u.protocol === 'https:' && /^upos-(?!tf-)[\w-]+\.bilivideo\.com$/.test(u.hostname)
                && !/-302(?:\.|-)/.test(u.hostname) && u.pathname.startsWith('/upgcxcode/')
                && u.searchParams.get('os') !== 'mcdn'
        } catch (_) { return false }
    }
    const host = value => { try { return new URL(value).hostname } catch (_) { return '' } }
    const swap = (value, node) => {
        if (!ordinary(value)) return null
        try {
            const u = new URL(value), n = new URL(node.includes('://') ? node : `https://${node}`)
            if (n.protocol !== 'https:' || !/^(?:upos-[\w-]+|cn-[\w-]+)\.bilivideo\.com$/.test(n.hostname)) return null
            u.hostname = n.hostname; u.port = ''
            return u.href
        } catch (_) { return null }
    }
    const range = value => {
        const m = /^bytes=(\d+)-(\d+)$/.exec(value || '')
        if (!m) return null
        const start = Number(m[1]), end = Number(m[2])
        return Number.isSafeInteger(end) && end >= start ? { start, end, size: end - start + 1 } : null
    }
    const contentRange = value => {
        const m = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(value || '')
        if (!m) return null
        const [start, end, total] = m.slice(1).map(Number)
        return [start, end, total].every(Number.isSafeInteger) && start <= end && end < total ? { start, end, total } : null
    }
    const sameBytes = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
    const expiry = value => {
        try {
            const p = new URL(value).searchParams
            const e = p.get('deadline') || p.get('expires')
            return e && /^\d+$/.test(e) ? Number(e) * 1000 : Infinity
        } catch (_) { return 0 }
    }
    const makeResponse = (bytes, headers, url, status = 206) => {
        const h = new Headers(headers)
        h.delete('content-encoding'); h.delete('transfer-encoding'); h.set('content-length', String(bytes.byteLength))
        const r = new Response(bytes, { status, headers: h })
        Object.defineProperty(r, 'url', { value: url })
        return r
    }

    function create(options = {}) {
        const transport = options.transport || ((url, init) => fetch(url, init))
        const config = options.config || (() => ({}))
        const now = options.now || Date.now
        const resources = new Set(), urls = new Map(), active = new Set()
        let lastVideo = null
        let reserved = 0
        const waiters = new Set()
        const notify = event => options.onStatus?.({ time: now(), ...event })
        const wake = () => { for (const f of [...waiters]) f() }
        async function reserve(size, signal) {
            if (signal.aborted) throw abortError()
            if (reserved + size > BUDGET) await new Promise((resolve, reject) => {
                const cancel = () => { waiters.delete(check); reject(abortError()) }
                const check = () => {
                    if (reserved + size <= BUDGET) { waiters.delete(check); signal.removeEventListener('abort', cancel); reserved += size; resolve() }
                }
                waiters.add(check); signal.addEventListener('abort', cancel, { once: true })
            })
            else reserved += size
        }
        function register(rep, kind = 'video') {
            const primary = rep.baseUrl || rep.base_url
            const backup = rep.backupUrl || rep.backup_url || rep.backup_url_list || []
            if (typeof primary !== 'string') return null
            const originals = [...new Set([primary, ...(Array.isArray(backup) ? backup : [])].filter(v => {
                try { const u = new URL(v); return u.protocol === 'https:' && /(?:^|\.)(?:bilivideo\.(?:com|cn|net)|akamaized\.net)$/.test(u.hostname) } catch (_) { return false }
            }))]
            if (!originals.length) return null
            const key = `${kind}:${rep.id || ''}:${primary}`
            let r = [...resources].find(x => x.key === key)
            if (!r) {
                r = { key, kind, id: rep.id, primary, originals, bandwidth: Number(rep.bandwidth) || 0,
                    probes: new Map(), health: new Map(), parallel: true, expanded: false,
                    switchedAt: 0, windows: [], windowAt: now(), windowBytes: 0, threads: 4 }
                resources.add(r)
            }
            for (const u of originals) urls.set(u, r)
            for (const u of candidates(r)) urls.set(u, r)
            return r
        }
        function candidates(r) {
            const c = config(), preferred = c.preferred
            if (c.enabled === false) return r.originals
            if (r.kind === 'audio' && c.audioOriginal) return [...r.originals.slice(1), r.primary]
            const nodes = [preferred, ...MIRRORS, ...(c.shenzhen || []).slice(0, 2)].filter(v => typeof v === 'string' && v)
            const chosen = swap(r.originals.find(ordinary) || '', preferred || '')
            const local = [...new Set([chosen, ...nodes.filter(n => host(`https://${n}`)?.includes('-sz-')).map(n => swap(r.originals.find(ordinary) || '', n))].filter(Boolean))]
            const others = [...r.originals.slice(1), ...MIRRORS.map(n => swap(r.originals.find(ordinary) || '', n)), r.primary]
            const banned = new Set(c.blacklist || [])
            return [...new Set([...local, ...others].filter(Boolean))].filter(u => !banned.has(host(u)))
        }
        const isLocal = (r, u) => u === swap(r.originals.find(ordinary) || '', config().preferred || '') || host(u).includes('-sz-')
        function failure(r, u, error) {
            if (error?.name === 'AbortError') return
            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }
            h.failures++
            if (h.failures >= 2) h.blockedUntil = now() + 60000
            r.health.set(u, h)
            notify({ kind: r.kind, node: host(u), reason: error.message || '请求失败', state: '冷却', blockedUntil: h.blockedUntil })
        }
        function sample(r, u, bytes, ms, finalUrl) {
            const bps = bytes * 1000 / Math.max(ms, 1)
            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }
            h.bps = h.bps ? h.bps * .7 + bps * .3 : bps; h.failures = 0; h.blockedUntil = 0
            r.health.set(u, h)
            notify({ kind: r.kind, node: host(finalUrl || u), requestedNode: host(u), bps,
                state: '播放下载', reason: finalUrl && host(finalUrl) !== host(u) ? '服务端重定向' : r.expanded ? '首选池不可用或持续过慢，已回退' : '首选池' })
            const playback = options.playback?.() || {}
            if (!playback.demand) { r.windows = []; r.windowBytes = 0; r.windowAt = now(); return }
            r.windowBytes += bytes
            const elapsed = now() - r.windowAt
            if (elapsed >= 5000) {
                r.windows.push(r.windowBytes * 8000 / elapsed); r.windows = r.windows.slice(-2)
                r.windowBytes = 0; r.windowAt = now()
                if (playback.demand && playback.buffer < 10 && r.bandwidth > 0 && r.windows.length === 2
                    && r.windows.every(v => v < r.bandwidth * 1.3) && now() - r.switchedAt >= 30000) {
                    r.expanded = true; r.switchedAt = now()
                }
                if (config().threads === 'auto' || !config().threads) {
                    r.threads = Math.max(2, Math.min(8, r.threads + (playback.demand && playback.buffer < 10 ? 1 : -1)))
                }
            }
        }
        async function readRange(u, start, end, signal, timeout = 8000) {
            if (signal?.aborted) throw abortError()
            const ctrl = new AbortController()
            const cancel = () => ctrl.abort()
            signal?.addEventListener('abort', cancel, { once: true })
            const timer = setTimeout(cancel, timeout)
            try {
                const response = await transport(u, { method: 'GET', headers: { Range: `bytes=${start}-${end}` },
                    signal: ctrl.signal, timeout, maxBytes: end - start + 1 })
                if (!response.status || response.type === 'opaque') throw new TypeError('响应不可读取，内容未知')
                if (response.status !== 206) throw Object.assign(new Error(`HTTP ${response.status}，未返回有效分片`), { status: response.status })
                const cr = contentRange(response.headers.get('content-range'))
                if (!cr || cr.start !== start || cr.end !== Math.min(end, cr.total - 1)) throw new Error('Content-Range 不匹配')
                const bytes = new Uint8Array(await response.arrayBuffer())
                if (bytes.length !== cr.end - cr.start + 1) throw new Error('分片长度不匹配')
                return { bytes, cr, headers: response.headers, url: response.url || u }
            } catch (e) {
                if (ctrl.signal.aborted && !signal?.aborted) throw new Error('请求超时')
                throw e
            } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel) }
        }
        async function probe(r, u, signal, size = 65536) {
            const old = r.probes.get(u)
            if (old && old.until > now() && size === 65536) return old
            if (expiry(u) <= now() + 1000) return { state: 'expired', hasContent: false, url: u }
            const started = now()
            try {
                const data = await readRange(u, 0, size - 1, signal, 3000)
                const result = { ...data, state: 'valid', hasContent: true, bps: data.bytes.length * 1000 / Math.max(now() - started, 1),
                    until: Math.min(now() + 90000, expiry(u)), source: u }
                if (size === 65536) r.probes.set(u, result)
                notify({ kind: r.kind, node: host(data.url), state: '已验证', bps: result.bps })
                return result
            } catch (e) {
                if (signal?.aborted) throw e
                const result = { state: e instanceof TypeError ? 'unknown' : 'invalid', hasContent: e instanceof TypeError ? null : false, error: e, until: now() + 15000 }
                if (size === 65536) r.probes.set(u, result)
                failure(r, u, e)
                return result
            }
        }
        function compatible(a, b) {
            if (a.cr.total !== b.cr.total || !sameBytes(a.bytes, b.bytes)) return false
            const ae = a.headers.get('etag'), be = b.headers.get('etag')
            const strong = ae && be && !ae.startsWith('W/') && ae === be
            const au = new URL(a.source), bu = new URL(b.source)
            return !!strong || au.pathname + au.search === bu.pathname + bu.search
        }
        async function eligible(r, signal) {
            let pool = candidates(r).filter(u => (r.health.get(u)?.blockedUntil || 0) <= now())
            const local = pool.filter(u => isLocal(r, u))
            if (!r.expanded && local.length) pool = local
            else if (r.expanded) pool = [...local.slice(0, 3), ...pool.filter(u => !isLocal(r, u)).slice(0, 3)]
            pool = pool.slice(0, 6)
            let out = []
            // 分批验活，首批最多六个；无可用节点再检查余下节点。
            for (let i = 0; i < pool.length && !out.length; i += 6) {
                const batch = pool.slice(i, i + 6)
                for (let j = 0; j < batch.length; j += 3) {
                    const results = await Promise.all(batch.slice(j, j + 3).map(async u => ({ u, p: await probe(r, u, signal) })))
                    out.push(...results.filter(x => x.p.state === 'valid'))
                }
            }
            if (!out.length && !r.expanded) { r.expanded = true; r.switchedAt = now(); return eligible(r, signal) }
            const preferred = swap(r.originals.find(ordinary) || '', config().preferred || '')
            const speed = x => r.health.get(x.u)?.bps || x.p.bps
            out.sort((a, b) => (!r.expanded && a.u === preferred ? -1 : !r.expanded && b.u === preferred ? 1 : speed(b) - speed(a)))
            if (out.length) out = out.filter(x => compatible(out[0].p, x.p))
            return out
        }
        async function route(input, init = {}) {
            const u = typeof input === 'string' ? input : input.url
            const r = urls.get(u), c = config()
            if (!r || c.enabled === false) return null
            if (r.kind === 'video') lastVideo = r
            const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined))
            const wanted = range(headers.get('range'))
            if ((init.method || input.method || 'GET').toUpperCase() !== 'GET' || !wanted || wanted.size > BUDGET) {
                notify({ kind: r.kind, state: '原生下载', reason: '非有限 Range 请求或超过 16 MiB' }); return null
            }
            if (!r.originals.some(ordinary)) {
                notify({ kind: r.kind, state: '原生下载', node: host(u), reason: '特殊路径或 M CDN，保留原始地址' }); return null
            }
            const ctrl = new AbortController(), signal = init.signal || input.signal
            const cancel = () => ctrl.abort()
            if (signal?.aborted) throw abortError()
            signal?.addEventListener('abort', cancel, { once: true }); active.add(ctrl)
            let allocated = false
            try {
                await reserve(wanted.size, ctrl.signal); allocated = true
                const available = await eligible(r, ctrl.signal)
                if (!available.length) {
                    const signatureFailure = r.originals.every(x => expiry(x) <= now() + 1000)
                        || r.originals.some(x => r.probes.get(x)?.error?.status === 403)
                    if (signatureFailure && !r.refreshTried && options.refresh) {
                        r.refreshTried = true
                        // 刷新地址会清空旧资源；先释放旧请求占用，避免递归等待预算。
                        reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)
                        try {
                            const fresh = await options.refresh(r)
                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }
                        } catch (e) { if (signal?.aborted) throw e }
                    }
                    notify({ kind: r.kind, state: '原生下载', reason: '没有已验证的兼容节点' })
                    return null
                }
                const total = available[0].p.cr.total
                if (wanted.end >= total) return null
                const threads = c.acceleration === false || !r.parallel || !r.originals.some(ordinary) ? 1
                    : c.threads && c.threads !== 'auto' ? Math.max(2, Math.min(8, Number(c.threads) || 4)) : r.threads
                const output = new Uint8Array(wanted.size)
                // 初始验活时间不计入实际下载的低速窗口。
                if (!r.windows.length && !r.windowBytes) r.windowAt = now()
                let cursor = wanted.start, lastUrl = available[0].u
                const group = new AbortController()
                const groupCancel = () => group.abort()
                ctrl.signal.addEventListener('abort', groupCancel, { once: true })
                const task = async index => {
                    while (cursor <= wanted.end) {
                        const start = cursor, end = Math.min(start + CHUNK - 1, wanted.end); cursor = end + 1
                        let good = false, error
                        for (let attempt = 0; attempt < 3; attempt++) {
                            if (group.signal.aborted) throw abortError()
                            const target = available[(index + attempt) % available.length]
                            try {
                                const started = now(), part = await readRange(target.u, start, end, group.signal)
                                const etag = part.headers.get('etag'), initial = target.p.headers.get('etag')
                                if (part.cr.total !== total || (etag && initial && etag !== initial)) throw new Error('资源在下载期间发生变化')
                                output.set(part.bytes, start - wanted.start); lastUrl = part.url
                                sample(r, target.u, part.bytes.length, now() - started, part.url); good = true; break
                            } catch (e) { error = e; if (group.signal.aborted) throw e; failure(r, target.u, e) }
                        }
                        if (!good) throw error
                    }
                }
                const tasks = Array.from({ length: Math.min(threads, Math.ceil(wanted.size / CHUNK)) }, (_, i) => task(i))
                try { await Promise.all(tasks) }
                catch (e) {
                    group.abort(); await Promise.allSettled(tasks)
                    if (ctrl.signal.aborted) throw abortError()
                    r.parallel = false; notify({ kind: r.kind, state: '单连接降级', reason: e.message })
                    try {
                        const part = await readRange(r.primary, wanted.start, wanted.end, ctrl.signal)
                        return makeResponse(part.bytes, part.headers, part.url)
                    } catch (fallbackError) {
                        if (fallbackError.status === 403 && !r.refreshTried && options.refresh) {
                            r.refreshTried = true; reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)
                            const fresh = await options.refresh(r)
                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }
                        }
                        throw fallbackError
                    }
                } finally { ctrl.signal.removeEventListener('abort', groupCancel) }
                const outHeaders = new Headers(available[0].p.headers)
                outHeaders.set('content-range', `bytes ${wanted.start}-${wanted.end}/${total}`)
                return makeResponse(output, outHeaders, lastUrl)
            } finally {
                if (allocated) { reserved -= wanted.size; wake() }
                active.delete(ctrl); signal?.removeEventListener('abort', cancel)
            }
        }
        const cancel = () => { for (const c of active) c.abort() }
        const reset = () => { cancel(); resources.clear(); urls.clear(); lastVideo = null }
        return { register, route, probe, candidates, resources, reset, cancel,
            resourceFor: url => urls.get(url),
            first: () => lastVideo || [...resources].find(r => r.kind === 'video'),
            inspect: () => ({ resources: resources.size, reserved, active: active.size }) }
    }

    // XHR 只接管异步 GET arraybuffer 分片，其余请求保留浏览器原生行为。
    function xhrAdapter(Native, route) {
        return class extends Native {
            open(method, url, async = true, ...rest) {
                this._ccb = null; this._ccbReq = { method, url: String(url), async, headers: {} }
                return super.open(method, url, async, ...rest)
            }
            setRequestHeader(k, v) { if (this._ccbReq) this._ccbReq.headers[k] = v; return super.setRequestHeader(k, v) }
            get readyState() { return this._ccb ? this._ccb.readyState : super.readyState }
            get status() { return this._ccb ? this._ccb.status : super.status }
            get statusText() { return this._ccb ? this._ccb.statusText : super.statusText }
            get responseURL() { return this._ccb ? this._ccb.url : super.responseURL }
            get response() { return this._ccb ? this._ccb.body : super.response }
            get responseText() { if (this._ccb) throw new DOMException('响应类型为 arraybuffer', 'InvalidStateError'); return super.responseText }
            getAllResponseHeaders() { return this._ccb ? [...this._ccb.headers].map(([k, v]) => `${k}: ${v}\r\n`).join('') : super.getAllResponseHeaders() }
            getResponseHeader(k) { return this._ccb ? this._ccb.headers.get(k) : super.getResponseHeader(k) }
            send(body) {
                const req = this._ccbReq
                if (!req || !req.async || req.method.toUpperCase() !== 'GET' || this.responseType !== 'arraybuffer'
                    || this.withCredentials || body != null || !range(new Headers(req.headers).get('range'))) return super.send(body)
                if (this._ccbCtrl) throw new DOMException('请求已经发送', 'InvalidStateError')
                const ctrl = new AbortController(); this._ccbCtrl = ctrl
                let timedOut = false
                const timer = this.timeout ? setTimeout(() => { timedOut = true; ctrl.abort() }, this.timeout) : null
                const emit = type => this.dispatchEvent(new Event(type))
                Promise.resolve().then(() => route(req.url, { method: req.method, headers: req.headers, signal: ctrl.signal }))
                    .then(async response => {
                        if (ctrl.signal.aborted) throw abortError()
                        if (!response) { clearTimeout(timer); this._ccbCtrl = null; return super.send(body) }
                        this._ccb = { readyState: 2, status: response.status, statusText: response.statusText, url: response.url, headers: response.headers, body: null }
                        emit('loadstart'); emit('readystatechange')
                        this._ccb.readyState = 3; emit('readystatechange')
                        this._ccb.body = await response.arrayBuffer()
                        if (ctrl.signal.aborted) throw abortError()
                        this._ccb.readyState = 4; emit('readystatechange')
                        this.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded: this._ccb.body.byteLength, total: this._ccb.body.byteLength }))
                        emit('load'); emit('loadend')
                    }).catch(e => {
                        this._ccb = { readyState: ctrl.signal.aborted && !timedOut ? 0 : 4, status: 0, statusText: '', url: '', headers: new Headers(), body: null }
                        emit('readystatechange'); emit(timedOut ? 'timeout' : e.name === 'AbortError' ? 'abort' : 'error'); emit('loadend')
                    }).finally(() => { clearTimeout(timer); if (this._ccbCtrl === ctrl) this._ccbCtrl = null })
            }
            abort() { if (this._ccbCtrl) this._ccbCtrl.abort(); else super.abort() }
        }
    }
    return { create, xhrAdapter, ordinary, swap, range, contentRange, MIRRORS, BUDGET, CHUNK }
})
