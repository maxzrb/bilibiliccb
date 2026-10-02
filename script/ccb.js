// ==UserScript==
// @name         Custom CDN of Bilibili (CCB) - 修改哔哩哔哩的网页视频、直播、番剧的播放源
// @description  Custom CDN of Bilibili (CCB)
// @namespace    CCB
// @license      MIT
// @version      2.3.0
// @author       鼠鼠今天吃嘉然, AreithDream
// @run-at       document-start
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/list/*
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/blackboard/video-diagnostics.html*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://player.bilibili.com/*
// @connect      kanda-akihito-kun.github.io
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @connect      api.bilibili.com
// @connect      bilivideo.com
// @connect      akamaized.net
// @updateURL    https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb.bundle.user.js
// @downloadURL  https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb.bundle.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

;(() => {
    // ===EMBEDDED_START===
    // 此区块由 build.py 自动生成 — 请编辑 data/*.json，不要手动修改此处。
    const EMBEDDED = {
        regions: ["北京","上海","广东","深圳","福建","河北","黑省","河南","湖北","湖南","江苏","江西","辽宁","内蒙","山东","山西","陕西","四川","重庆","天津","新疆","浙江","外建","香港","海外"],
        cdn: {},
        buildTime: ""
    };
    // ===EMBEDDED_END===

    // ===CORE_START===
    // 构建时嵌入选源内核与浏览器适配器。
    // ===CORE_END===
    const Core = globalThis.CcbCore
    let regionList = ['手动输入']
    let cdnDataCache = EMBEDDED.cdn
    const nativeFetch = unsafeWindow.fetch.bind(unsafeWindow)
    const diagnostics = { events: [], video: null, audio: null }
    let lastPlayRequest = null
    let playFingerprint = ''
    const liveRoutes = new Map()

    // API 源列表，按优先级排列 — jsDelivr 国内可访问，GitHub Pages 作为备用
    const API_SOURCES = [
        'https://cdn.jsdelivr.net/gh/maxzrb/bilibiliccb@main/data',
        'https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/data',
        'https://cdn.jsdelivr.net/gh/Kanda-Akihito-Kun/ccb@main/data',
        'https://raw.githubusercontent.com/Kanda-Akihito-Kun/ccb/main/data',
        'https://kanda-akihito-kun.github.io/ccb/api',
    ];

    const defaultCdnNode = '使用默认源'
    const manualRegionName = '手动输入'
    const mainHost = 'www.bilibili.com'
    const liveHost = 'live.bilibili.com'

    const oldCdnNodeStored = 'CCB'
    const oldRegionStored = 'region'
    const mainCdnNodeStored = 'CCB_main'
    const mainRegionStored = 'region_main'
    const diagnosticsCdnNodeStored = 'CCB_diagnostics'
    const diagnosticsRegionStored = 'region_diagnostics'
    const liveCdnNodeStored = 'CCB_live'
    const liveRegionStored = 'region_live'
    const powerModeStored = 'powerMode'
    const liveModeStored = 'liveMode'
    const ispFilterStored = 'CCB_ispFilter'
    const STUCK_TIMEOUT_KEY = 'CCB_stuckTimeout'

    // ====== ISP 识别工具 ======
    // CDN 节点名中的运营商标记: ct=电信, cu=联通, cm/cmcc=移动
    const ISP_MAP = { ct: '电信', cu: '联通', cm: '移动', cmcc: '移动' }
    const ISP_ORDER = ['电信', '联通', '移动', '其他']
    const detectIsp = (nodeName) => {
        const m = String(nodeName).match(/(?:^|-)(ct|cu|cm|cmcc)(?:-|\b)/i)
        return m ? (ISP_MAP[m[1].toLowerCase()] || '其他') : '其他'
    }
    const getIspFilter = () => GM_getValue(ispFilterStored, '全部')
    const setIspFilter = (v) => GM_setValue(ispFilterStored, v)
    // 按 ISP 排序：优先同运营商，再按名称排序
    const sortByIsp = (nodes, preferredIsp) => {
        const order = preferredIsp && preferredIsp !== '全部'
            ? [preferredIsp, ...ISP_ORDER.filter(i => i !== preferredIsp)]
            : ISP_ORDER
        const rank = (isp) => { const i = order.indexOf(isp); return i === -1 ? 99 : i }
        return [...nodes].sort((a, b) => {
            const ra = rank(detectIsp(a)), rb = rank(detectIsp(b))
            if (ra !== rb) return ra - rb
            return a.localeCompare(b)
        })
    }

    const logger = ((...args) => {
        console.warn(`[CCB] ${args}`, args)
    })

    const UNSET = '__CCB_UNSET__'
    const normalizeRegion = (v) => {
        if (!v) return manualRegionName
        if (v === '编辑') return manualRegionName
        return v
    }
    const migrateStoredValues = () => {
        const oldNode = GM_getValue(oldCdnNodeStored, UNSET)
        const oldRegion = GM_getValue(oldRegionStored, UNSET)
        if (oldNode !== UNSET) {
            if (GM_getValue(mainCdnNodeStored, UNSET) === UNSET) GM_setValue(mainCdnNodeStored, oldNode)
            if (GM_getValue(diagnosticsCdnNodeStored, UNSET) === UNSET) GM_setValue(diagnosticsCdnNodeStored, oldNode)
            if (GM_getValue(liveCdnNodeStored, UNSET) === UNSET) GM_setValue(liveCdnNodeStored, oldNode)
        }
        if (oldRegion !== UNSET) {
            const normalized = normalizeRegion(oldRegion)
            if (GM_getValue(mainRegionStored, UNSET) === UNSET) GM_setValue(mainRegionStored, normalized)
            if (GM_getValue(diagnosticsRegionStored, UNSET) === UNSET) GM_setValue(diagnosticsRegionStored, normalized)
            if (GM_getValue(liveRegionStored, UNSET) === UNSET) GM_setValue(liveRegionStored, normalized)
        }
    }
    migrateStoredValues()

    const isLiveContext = () => location.host === liveHost
    const isDiagnosticsContext = () => location.host === mainHost && (location.pathname || '').startsWith('/blackboard/video-diagnostics.html')
    const getContextKey = () => {
        if (isLiveContext()) return 'live'
        if (isDiagnosticsContext()) return 'diagnostics'
        return 'main'
    }

    const getTargetCdnNode = (ctx = getContextKey()) => GM_getValue(
        ctx === 'live' ? liveCdnNodeStored : (ctx === 'diagnostics' ? diagnosticsCdnNodeStored : mainCdnNodeStored),
        GM_getValue(oldCdnNodeStored, defaultCdnNode),
    )
    const getRegion = (ctx = getContextKey()) => normalizeRegion(GM_getValue(
        ctx === 'live' ? liveRegionStored : (ctx === 'diagnostics' ? diagnosticsRegionStored : mainRegionStored),
        normalizeRegion(GM_getValue(oldRegionStored, manualRegionName)),
    ))
    const setTargetCdnNode = (ctx, value) => {
        GM_setValue(ctx === 'live' ? liveCdnNodeStored : (ctx === 'diagnostics' ? diagnosticsCdnNodeStored : mainCdnNodeStored), value)
        settings.contexts = settings.contexts || {}
        settings.contexts[ctx] = { node: value, region: getRegion(ctx) }
        GM_setValue(SETTINGS_KEY, settings)
        invalidateConfig(); engine.cancel()
    }
    const setRegion = (ctx, value) => {
        GM_setValue(ctx === 'live' ? liveRegionStored : (ctx === 'diagnostics' ? diagnosticsRegionStored : mainRegionStored), value)
        settings.contexts = settings.contexts || {}
        settings.contexts[ctx] = { node: getTargetCdnNode(ctx), region: value }
        GM_setValue(SETTINGS_KEY, settings)
    }
    const getPowerMode = () => GM_getValue(powerModeStored, true)
    const getLiveMode = () => GM_getValue(liveModeStored, false)
    const isCcbEnabled = () => getTargetCdnNode() !== defaultCdnNode
    const hasMediaDomain = (s) => typeof s === 'string' && (
        s.indexOf('bilivideo.') !== -1
        || s.indexOf('acgvideo.') !== -1
        || s.indexOf('edge.mountaintoys.cn') !== -1
        || s.indexOf('akamaized.net') !== -1
    )

    const isLiveRoomPage = () => {
        if (location.host !== liveHost) return false
        const p = location.pathname || '/'
        return /^\/\d+\/?$/.test(p) || /^\/blanc\/\d+\/?$/.test(p)
    }

    const shouldApplyReplacement = () => {
        if (!isCcbEnabled()) return false
        if (location.host === liveHost) {
            if (!isLiveRoomPage()) return false
            if (!getLiveMode()) return false
        }
        return true
    }

    const shouldInstallWorkerHooks = () => {
        if (!shouldApplyReplacement()) return false
        const host = location.host
        const pathname = location.pathname || '/'
        if (host === mainHost) {
            return pathname.startsWith('/bangumi/play/')
                || pathname.startsWith('/video/')
                || pathname.startsWith('/cheese/play/')
        }
        if (host === liveHost) return isLiveRoomPage()
        return false
    }

    const getReplacement = () => {
        let target = getTargetCdnNode()
        if (target.indexOf('://') === -1) target = 'https://' + target
        if (!target.endsWith('/')) target = target + '/'
        return target
    }

    const getReplacementNoSlash = () => {
        const r = getReplacement()
        return r.endsWith('/') ? r.slice(0, -1) : r
    }

    const getReplacementHost = () => {
        try {
            return new URL(getReplacement()).host
        } catch (_) {
            return ''
        }
    }

    // 获取当前地区的所有 CDN 节点列表，用于 backup_url 多样化容灾
    const getRegionCdnNodes = (region) => {
        try {
            const data = cdnDataCache || EMBEDDED.cdn || {}
            return (data && data[region]) || []
        } catch (_) { return [] }
    }

    const IGNORE_HOST_RE = /^(?:bvc|data|pbp|api|api\w+)\./

    // 点播请求由内核处理，保留原始备用节点及签名。
    const replaceMediaUrl = s => s

    const replaceMediaHostValue = (s) => {
        if (typeof s !== 'string') return s
        if (!shouldApplyReplacement()) return s
        if (!hasMediaDomain(s)) return s

        try {
            const u = new URL(s.startsWith('//') ? `https:${s}` : s)
            if (IGNORE_HOST_RE.test(u.hostname)) return s
        } catch (_) {
            const m = s.match(/^https?:\/\/([\w.-]+)/) || s.match(/^\/\/([\w.-]+)/)
            if (m && IGNORE_HOST_RE.test(m[1])) return s
        }

        if (s.startsWith('http://') || s.startsWith('https://')) return getReplacementNoSlash()
        if (s.startsWith('//')) return getReplacementNoSlash().replace(/^https?:/, '')
        if (/^[^/]+$/.test(s)) return getReplacementHost()
        return s
    }

    // ===INTEGRATION_START===
    // 构建时嵌入配置、媒体登记和请求通道。
    // ===INTEGRATION_END===

    const transformLiveNeptune = (obj) => {
        if (!obj || typeof obj !== 'object') return
        if (!getReplacementHost()) return

        const playurl =
            (obj && obj.roomInitRes && obj.roomInitRes.data && obj.roomInitRes.data.playurl_info && obj.roomInitRes.data.playurl_info.playurl) ||
            (obj && obj.data && obj.data.playurl_info && obj.data.playurl_info.playurl) ||
            (obj && obj.result && obj.result.playurl_info && obj.result.playurl_info.playurl) ||
            (obj && obj.playurl_info && obj.playurl_info.playurl)
        if (!playurl || typeof playurl !== 'object') return

        const streams = playurl.stream
        if (!Array.isArray(streams)) return
        for (let si = 0; si < streams.length; si++) {
            const s = streams[si]
            const formats = s && s.format
            if (!Array.isArray(formats)) continue
            for (let fi = 0; fi < formats.length; fi++) {
                const f = formats[fi]
                const codecs = f && f.codec
                if (!Array.isArray(codecs)) continue
                for (let ci = 0; ci < codecs.length; ci++) {
                    const c = codecs[ci]
                    const infos = c && c.url_info
                    if (!Array.isArray(infos)) continue
                    for (let ii = 0; ii < infos.length; ii++) {
                        const info = infos[ii]
                        if (ii === 0 && info && typeof info.host === 'string') {
                            const originalHost = info.host
                            const replacementHost = replaceMediaHostValue(originalHost)
                            if (replacementHost !== originalHost) {
                                if (!infos.some(x => x !== info && x.host === originalHost)) infos.splice(1, 0, { ...info })
                                if (c.base_url) liveRoutes.set(replacementHost + c.base_url + (info.extra || ''), originalHost + c.base_url + (info.extra || ''))
                                info.host = replacementHost
                            }
                        }
                    }
                }
            }
        }
    }

    const replaceBilivideoInText = (text) => {
        // 无法识别的直播文本不整体替换，保留原生签名及故障转移信息。
        return text
    }

    const interceptNetResponse = (theWindow => {
        const interceptors = []
        const register = (handler) => interceptors.push(handler)

        const handle = (response, url, meta) => interceptors.reduce((modified, h) => {
            const ret = h(modified, url, meta)
            return ret ? ret : modified
        }, response)

        const hookWindow = (w) => {
            try {
                if (!w || !w.XMLHttpRequest || !w.fetch) return false
                const hooked = w.__CCB_NET_HOOKED__
                if (hooked && hooked.xhr === w.XMLHttpRequest && hooked.fetch === w.fetch) return true

                const OX = Core.xhrAdapter(w.XMLHttpRequest, (url, init) => engine.route(url, init))
                class XHR extends OX {
                    open(...args) {
                        this._ccbMemo = null
                        const requestUrl = String(args[1])
                        this.addEventListener('load', () => { if (!this._ccb) noteNative(requestUrl, this.responseURL) }, { once: true })
                        try {
                            if (typeof args[1] === 'string') args[1] = replaceMediaUrl(args[1])
                        } catch (_) {}
                        return super.open(...args)
                    }
                    get responseText() {
                        if (this.readyState !== this.DONE) return super.responseText
                        const original = super.responseText
                        if (this._ccbMemo && this._ccbMemo.original === original) return this._ccbMemo.value
                        const value = handle(original, this.responseURL, { type: 'xhr', xhr: this })
                        this._ccbMemo = { original, value }
                        return value
                    }
                    get response() {
                        if (this.readyState !== this.DONE) return super.response
                        if (this.responseType === '' || this.responseType === 'text') return this.responseText
                        return handle(super.response, this.responseURL, { type: 'xhr', xhr: this })
                    }
                }
                w.XMLHttpRequest = XHR

                const Ofetch = w.fetch.bind(w)
                w.fetch = async (input, init) => {
                    const request = new (w.Request || Request)(input, init)
                    const media = await engine.route(request.url, { method: request.method, headers: request.headers, signal: request.signal })
                    if (media) return media
                    const url = request.url
                    const shouldIntercept = handle(null, url, { type: 'fetch', input, init })
                    let resp, liveRetried = false
                    try { resp = await Ofetch(request) }
                    catch (error) {
                        if (!liveRoutes.has(url) || request.signal.aborted) throw error
                        liveRetried = true
                        resp = await Ofetch(new (w.Request || Request)(liveRoutes.get(url), request))
                    }
                    noteNative(url, resp.url)
                    if (liveRoutes.has(url)) {
                        if (!resp.ok && !liveRetried) {
                            resp.body?.cancel().catch(() => {})
                            resp = await Ofetch(new (w.Request || Request)(liveRoutes.get(url), request))
                        }
                        diagnostics.events.push({ time: Date.now(), kind: 'live', node: new URL(resp.url || url).hostname,
                            state: '直播原生下载', reason: resp.url !== url ? '原始备用源或重定向' : '所选直播源' })
                        if (diagnostics.events.length > 50) diagnostics.events.shift()
                        document.dispatchEvent(new Event('ccb-status'))
                    }
                    if (!shouldIntercept) return resp
                    if (!resp.body || [204, 205, 304].includes(resp.status)) return resp
                    const text = await resp.text()
                    const out = handle(text, url, { type: 'fetch', input, init, response: resp })
                    const headers = new Headers(resp.headers)
                    headers.delete('content-length'); headers.delete('content-encoding')
                    const response = new (w.Response || Response)(out, { status: resp.status, statusText: resp.statusText, headers })
                    Object.defineProperty(response, 'url', { value: resp.url })
                    return response
                }

                try {
                    const bHooked = w.__CCB_BLOB_HOOKED__
                    if (w.Blob && (!bHooked || bHooked !== w.Blob)) {
                        const OBlob = w.Blob
                        w.Blob = function (parts, options) {
                            const type = options && options.type ? String(options.type) : ''
                            const looksJs = /javascript/i.test(type)
                                || (Array.isArray(parts) && parts.some(p => typeof p === 'string' && /importScripts|WorkerGlobalScope|bili/i.test(p)))
                            if (looksJs && shouldInstallWorkerHooks()) {
                                const injected = [buildWorkerPrelude(), ...(Array.isArray(parts) ? parts : [parts])]
                                return new OBlob(injected, options)
                            }

                            return new OBlob(parts, options)
                        }
                        w.Blob.prototype = OBlob.prototype
                        Object.setPrototypeOf(w.Blob, OBlob)
                        w.__CCB_BLOB_HOOKED__ = w.Blob
                    }
                } catch (_) {}

                try {
                    const wHooked = w.__CCB_WORKER_WRAPPED__
                    if (w.Worker && (!wHooked || wHooked !== w.Worker)) {
                        const OWorker = w.Worker
                        w.Worker = function (scriptURL, options) {
                            try {
                                if (!shouldInstallWorkerHooks()) return new OWorker(scriptURL, options)
                                const raw = (typeof scriptURL === 'string') ? scriptURL : String(scriptURL)
                                if (raw.startsWith('blob:') || raw.startsWith('data:')) return ccbAttachWorker(new OWorker(scriptURL, options), workerChannel, engine, noteNative)
                                const isModule = options && options.type === 'module'
                                const wrapperCode = isModule
                                    ? `${buildWorkerPrelude()}\nimport ${JSON.stringify(raw)};\n`
                                    : `${buildWorkerPrelude()}\nimportScripts(${JSON.stringify(raw)});\n`
                                const blob = new w.Blob([wrapperCode], { type: 'application/javascript' })
                                const url = w.URL.createObjectURL(blob)
                                const worker = ccbAttachWorker(new OWorker(url, options), workerChannel, engine, noteNative)
                                setTimeout(() => w.URL.revokeObjectURL(url), 60000)
                                return worker
                            } catch (_) {
                                return new OWorker(scriptURL, options)
                            }
                        }
                        w.Worker.prototype = OWorker.prototype
                        Object.setPrototypeOf(w.Worker, OWorker)
                        w.__CCB_WORKER_WRAPPED__ = w.Worker
                    }
                } catch (_) {}

                w.__CCB_NET_HOOKED__ = { xhr: w.XMLHttpRequest, fetch: w.fetch }
                return true
            } catch (_) {
                return false
            }
        }

        hookWindow(theWindow)
        register._hookWindow = hookWindow
        return register
    })(unsafeWindow)

    const PLAYURL_PATHS = [
        '/x/player/wbi/playurl',
        '/x/player/playurl',
        '/pgc/player/web/playurl',
        '/pgc/player/web/v2/playurl',
        '/pgc/player/api/playurl',
        '/pugv/player/web/playurl',
        '/ogv/player/playview',
    ]

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        const u = typeof url === 'string' ? url : (url && url.url) || String(url)
        if (!PLAYURL_PATHS.some(p => u.includes(p))) return
        if (response === null) return true
        lastPlayRequest = u

        try {
            if (typeof response === 'string') {
                const obj = JSON.parse(response)
                transformPlayUrlResponse(obj)
                return JSON.stringify(obj)
            }
            if (response && typeof response === 'object') {
                transformPlayUrlResponse(response)
                return response
            }
        } catch (e) {
            logger('处理 playurl 失败:', e)
        }
    })

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        if (!getLiveMode()) return
        const raw = typeof url === 'string' ? url : (url && url.url) || ''
        let u
        try { u = new URL(raw || String(url), location.href) } catch (_) { return }
        const p = u.pathname || ''
        if (!(/\/xlive\/web-room\/v\d+\/index\/getRoomPlayInfo\/?$/.test(p) || /\/room\/v1\/Room\/playUrl\/?$/.test(p))) return
        if (response === null) return true
        if (!isLiveRoomPage()) return
        try {
            const obj = typeof response === 'string' ? JSON.parse(response) : response
            transformLiveNeptune(obj)
            return (typeof response === 'string') ? JSON.stringify(obj) : obj
        } catch (e) {
            logger('处理直播 playurl 失败:', e)
        }
    })

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        if (!getLiveMode()) return
        const u = typeof url === 'string' ? url : (url && url.url) || String(url)
        if (!u.includes('/xlive/play-gateway/master/url')) return
        if (response === null) return true
        return replaceBilivideoInText(response)
    })

    const installLiveBootstrapHooks = () => {
        if (!getLiveMode() || !isLiveRoomPage() || !isCcbEnabled()) return
        const seen = new WeakSet()
        const tryRewrite = (obj) => {
            if (!obj || typeof obj !== 'object') return
            if (seen.has(obj)) return
            seen.add(obj)
            transformLiveNeptune(obj)
        }
        try {
            const propName = '__NEPTUNE_IS_MY_WAIFU__'
            let internal = unsafeWindow[propName]
            if (internal && typeof internal === 'object') tryRewrite(internal)
            Object.defineProperty(unsafeWindow, propName, {
                configurable: true,
                get: () => internal,
                set: (v) => {
                    internal = v
                    if (v && typeof v === 'object') tryRewrite(v)
                }
            })
        } catch (e) {
            logger('直播首播 Hook 安装失败:', String(e))
        }
    }

    installLiveBootstrapHooks()

    const watchGlobal = (name, handler) => {
        try {
            if (unsafeWindow[name] && typeof unsafeWindow[name] === 'object') handler(unsafeWindow[name])
            let internal = unsafeWindow[name]
            Object.defineProperty(unsafeWindow, name, {
                configurable: true,
                get: () => internal,
                set: (v) => {
                    internal = v
                    if (v && typeof v === 'object') handler(v)
                }
            })
        } catch (_) {}
    }

    watchGlobal('__playinfo__', (obj) => {
        if (!isCcbEnabled()) return
        try { transformPlayUrlResponse(obj) } catch (_) {}
    })
    watchGlobal('__INITIAL_STATE__', (obj) => {
        if (!isCcbEnabled()) return
        try { transformPlayUrlResponse(obj) } catch (_) {}
    })

    const createButton = (text, primary, second) => {
        const btn = document.createElement('button')
        btn.textContent = text
        btn.style.cssText = [
            'border:0',
            'border-radius:8px',
            'padding:8px 10px',
            'cursor:pointer',
            'color:#fff',
            `background:${primary ? '#2b74ff' : (second ? '#1bc543ff' : '#444')}`,
        ].join(';')
        return btn
    }


    const requestText = (url) => new Promise((resolve, reject) => {
        const fetchFallback = () => fetch(url).then(r => r.text()).then(resolve, reject)
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: (res) => {
                        const ok = res && typeof res.status === 'number' ? (res.status >= 200 && res.status < 300) : true
                        if (!ok) fetchFallback()
                        else resolve(res.responseText || '')
                    },
                    onerror: fetchFallback,
                    ontimeout: fetchFallback,
                })
                return
            }
        } catch (_) {}
        fetchFallback()
    })

    const requestJson = async (url) => JSON.parse(await requestText(url))

    // 初始化：立即使用内嵌数据，无需等待网络
    if (EMBEDDED.regions && EMBEDDED.regions.length > 0) {
        regionList = [manualRegionName, ...EMBEDDED.regions.filter(v => v && v !== manualRegionName && v !== '编辑')]
    }
    if (EMBEDDED.cdn && Object.keys(EMBEDDED.cdn).length > 0) {
        cdnDataCache = EMBEDDED.cdn
    }

    const tryOnlineUpdate = async () => {
        // 逐个尝试 API 源，成功就停止
        for (const src of API_SOURCES) {
            try {
                const [regions, cdn] = await Promise.all([
                    requestJson(`${src}/region.json`),
                    requestJson(`${src}/cdn.json`),
                ])
                if (!Array.isArray(regions) || !regions.every(v => typeof v === 'string')
                    || !cdn || typeof cdn !== 'object' || Array.isArray(cdn)
                    || !Object.values(cdn).every(v => Array.isArray(v) && v.every(n => typeof n === 'string' && /^[\w.-]+$/.test(n)))) throw new Error('节点数据结构错误')
                if (Array.isArray(regions) && regions.length > 0) {
                    regionList = [manualRegionName, ...regions.filter(v => v && v !== manualRegionName && v !== '编辑')]
                }
                if (cdn && typeof cdn === 'object' && Object.keys(cdn).length > 0) {
                    cdnDataCache = cdn
                    GM_setValue('CCB_data_v1', { regions, cdn, time: Date.now() }); invalidateConfig()
                }
                logger('在线更新数据成功，来源:', src)
                return true
            } catch (_) { /* 继续尝试下一个源 */ }
        }
        logger('所有在线源不可用，使用内嵌数据')
        return false
    }

    setTimeout(tryOnlineUpdate, 5000)
    try {
        const cached = GM_getValue('CCB_data_v1', null)
        if (cached && Date.now() - cached.time >= 0 && Date.now() - cached.time < 7 * 86400000
            && Array.isArray(cached.regions) && cached.regions.every(x => typeof x === 'string')
            && cached.cdn && Object.values(cached.cdn).every(v => Array.isArray(v)
                && v.every(n => typeof n === 'string' && /^[\w.-]+$/.test(n)))) {
            regionList = [manualRegionName, ...cached.regions]; cdnDataCache = cached.cdn; invalidateConfig()
        }
    } catch (_) {}

    const getRegionList = async () => {
        // 已有数据直接返回，后台静默更新
        if (regionList.length > 1) return
        await tryOnlineUpdate()
    }

    const getCdnData = async () => {
        if (cdnDataCache && Object.keys(cdnDataCache).length > 0) return cdnDataCache
        await tryOnlineUpdate()
        return cdnDataCache || {}
    }

    const getCdnListByRegion = async (region) => {
        if (region === manualRegionName || region === '编辑') return [defaultCdnNode]
        const data = await getCdnData()
        const regionData = (data && data[region]) || []
        const isp = getIspFilter()
        let filtered = isp !== '全部'
            ? regionData.filter(n => detectIsp(n) === isp)
            : regionData
        // 过滤拉黑节点（失败 ≥1 次即跳过）
        filtered = filtered.filter(n => getNodeFailCount(n) < 1)
        // 排序：优先同运营商
        return [defaultCdnNode, ...sortByIsp(filtered, isp !== '全部' ? isp : null)]
    }

    // ===PANEL_START===
    // 构建时嵌入设置与诊断面板。
    // ===PANEL_END===

    if (window.top === window) {
        GM_registerMenuCommand('📺 CCB 设置与播放诊断', openPanel)
        GM_registerMenuCommand('CCB 使用说明与反馈', () => window.open('https://github.com/maxzrb/bilibiliccb'))
    }
    document.addEventListener('seeking', () => engine.cancel(), true)
    try {
        const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                if (!hasMediaDomain(entry.name) || !['video', 'xmlhttprequest', 'fetch'].includes(entry.initiatorType)) continue
                // 原生请求的跨域计时可能不可读；只报告实际请求域名，不推算速度。
                if (entry.initiatorType === 'video' || !mediaConfig().enabled) {
                    diagnostics.events.push({ time: Date.now(), state: '原生播放器请求', node: new URL(entry.name).hostname, reason: '原生通道，速度未知' })
                    if (diagnostics.events.length > 50) diagnostics.events.shift()
                    document.dispatchEvent(new Event('ccb-status'))
                }
            }
        })
        observer.observe({ type: 'resource', buffered: true })
    } catch (_) {}
    const converge = () => {
        settings = GM_getValue(SETTINGS_KEY, settings); invalidateConfig()
    }
    document.addEventListener('visibilitychange', converge)
    window.addEventListener('pageshow', converge)
    window.addEventListener('pagehide', () => engine.cancel())
    logger('CCB 2.3.0 加载完成', { host: location.host, path: location.pathname })
})()
