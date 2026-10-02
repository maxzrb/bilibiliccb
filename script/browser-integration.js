// 此文件在构建时嵌入主脚本，沿用主脚本已有的 GM 配置。
const SETTINGS_KEY = 'CCB_settings_v1'
let settings = GM_getValue(SETTINGS_KEY, null)
if (!settings || settings.version !== 1) {
    settings = { version: 1, acceleration: true, threads: 'auto', audioOriginal: false,
        contexts: Object.fromEntries(['main', 'live', 'diagnostics'].map(ctx => [ctx, { node: getTargetCdnNode(ctx), region: getRegion(ctx) }])) }
    GM_setValue(SETTINGS_KEY, settings)
    GM_setValue('CCB_legacyBlacklist', GM_getValue('CCB_failCount', '{}'))
}
let configCache = null
const invalidateConfig = () => { configCache = null }
const getFailCount = () => { try { return JSON.parse(GM_getValue('CCB_manualBlacklist', '{}')) } catch (_) { return {} } }
const addFailCount = node => {
    const list = getFailCount(); list[node] = 1
    GM_setValue('CCB_manualBlacklist', JSON.stringify(list)); invalidateConfig()
}
const getNodeFailCount = node => getFailCount()[node] || 0
const noteNative = (requested, actual) => {
    const r = engine.resourceFor(requested)
    if (!r) return
    let node, requestedNode
    try { node = new URL(actual || requested).hostname; requestedNode = new URL(requested).hostname } catch (_) { return }
    const event = { time: Date.now(), kind: r.kind, node,
        state: '原生下载', reason: node !== requestedNode ? '服务端重定向（原生通道）' : '原生通道，速度未知' }
    diagnostics[r.kind] = event; diagnostics.events.push(event)
    if (diagnostics.events.length > 50) diagnostics.events.shift()
    document.dispatchEvent(new Event('ccb-status'))
}
const mediaConfig = () => {
    if (!configCache) {
        const preferred = getTargetCdnNode()
        configCache = { ...settings, enabled: !isLiveContext() && preferred !== defaultCdnNode,
            preferred: preferred === defaultCdnNode ? '' : preferred,
            shenzhen: (cdnDataCache && cdnDataCache['深圳']) || Core.MIRRORS,
            blacklist: Object.keys(getFailCount()) }
    }
    return configCache
}
const persistSettings = () => { GM_setValue(SETTINGS_KEY, settings); invalidateConfig(); engine.cancel() }
const mediaTransport = (url, init) => new Promise((resolve, reject) => {
    let finished = false, request
    const finish = (error, value) => {
        if (finished) return
        finished = true; init.signal?.removeEventListener('abort', abort)
        error ? reject(error) : resolve(value)
    }
    const abort = () => { finish(new DOMException('请求已取消', 'AbortError')); request?.abort() }
    if (init.signal?.aborted) { abort(); return }
    init.signal?.addEventListener('abort', abort, { once: true })
    request = GM_xmlhttpRequest({ method: 'GET', url, responseType: 'arraybuffer', anonymous: true,
        headers: { ...init.headers, Referer: 'https://www.bilibili.com/' }, timeout: init.timeout,
        onprogress: e => {
            if (e.loaded > init.maxBytes) { finish(new Error('服务器忽略 Range 或返回过量数据')); request?.abort() }
        },
        onload: r => {
            const headers = new Headers()
            for (const line of (r.responseHeaders || '').split(/\r?\n/)) {
                const i = line.indexOf(':')
                if (i > 0) { try { headers.append(line.slice(0, i), line.slice(i + 1).trim()) } catch (_) {} }
            }
            try {
                if (!r.status) throw new TypeError('响应状态不可读取，内容未知')
                const body = r.response || new ArrayBuffer(0)
                if (body.byteLength > init.maxBytes) throw new Error('响应超过 Range 限额')
                const response = new Response(body, { status: r.status, headers })
                Object.defineProperty(response, 'url', { value: r.finalUrl || url }); finish(null, response)
            } catch (e) { finish(e) }
        },
        onerror: () => finish(new TypeError('网络不可达或跨域权限未授予，内容未知')),
        ontimeout: () => finish(new Error('请求超时')),
        onabort: () => finish(new DOMException('请求已取消', 'AbortError')),
    })
})
const playback = () => {
    const v = document.querySelector('video')
    let buffer = 0
    if (v) for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) buffer = v.buffered.end(i) - v.currentTime
    }
    return { demand: !!v && !v.paused && !v.seeking && !v.ended, buffer }
}
const engine = Core.create({ transport: mediaTransport, config: mediaConfig, playback,
    onStatus: event => {
        if (event.state === '播放下载') diagnostics[event.kind] = event
        diagnostics.events.push(event)
        if (diagnostics.events.length > 50) diagnostics.events.shift()
        document.dispatchEvent(new Event('ccb-status'))
    },
    refresh: async r => {
        if (!lastPlayRequest) return null
        const endpoint = new URL(lastPlayRequest)
        // 媒体过期时旧 WBI 时间戳也可能过期，使用同参数的合法网页播放接口。
        if (endpoint.pathname === '/x/player/wbi/playurl') {
            endpoint.pathname = '/x/player/playurl'
            endpoint.searchParams.delete('w_rid'); endpoint.searchParams.delete('wts')
        }
        const response = await nativeFetch(endpoint.href, { credentials: 'include', cache: 'no-store' })
        const data = await response.json()
        if (data.code !== undefined && data.code !== 0) return null
        registerPlayInfo(data)
        return [...engine.resources].find(x => x.kind === r.kind && x.id === r.id) || null
    }
})
const registerPlayInfo = obj => {
    const found = []
    const visit = (value, kind = 'video', depth = 0) => {
        if (!value || typeof value !== 'object' || depth > 12) return
        if (Array.isArray(value)) { value.forEach(x => visit(x, kind, depth + 1)); return }
        if (typeof (value.baseUrl || value.base_url) === 'string') found.push({ value, kind })
        for (const [key, v] of Object.entries(value)) if (v && typeof v === 'object') visit(v, key === 'audio' ? 'audio' : key === 'video' ? 'video' : kind, depth + 1)
    }
    visit(obj)
    if (!found.length) return
    const fingerprint = found.map(x => JSON.stringify({ kind: x.kind, id: x.value.id,
        primary: x.value.baseUrl || x.value.base_url,
        backups: x.value.backupUrl || x.value.backup_url || x.value.backup_url_list || [] })).join('\n')
    if (fingerprint !== playFingerprint) { engine.reset(); playFingerprint = fingerprint; diagnostics.video = diagnostics.audio = null }
    found.forEach(x => engine.register(x.value, x.kind))
}
const transformPlayUrlResponse = obj => {
    if (!obj || typeof obj !== 'object' || (obj.code !== undefined && obj.code !== 0)) return
    registerPlayInfo(obj)
}
const workerChannel = `ccb-${crypto.randomUUID()}`
const buildWorkerPrelude = () => {
    // ===WORKER_CORE_START===
    const workerCore = ''
    // ===WORKER_CORE_END===
    return `${workerCore}\n;(${ccbWorkerRuntime.toString()})(${JSON.stringify(workerChannel)});\n`
}
