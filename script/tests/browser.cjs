/* 真实 Chromium 中验证页面、XHR、Worker 与面板；网络使用可控媒体响应。 */
const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const Core = require('../cdn-core.js')
const original = 'https://upos-hz-mirrorakam.bilivideo.com/upgcxcode/7/video.m4s?token=keep&deadline=4102444800'
const preferred = 'upos-sz-mirrorali.bilivideo.com'
const data = Buffer.alloc(2097152)
for (let i = 0; i < data.length; i++) data[i] = i % 251

async function main() {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CCB_BROWSER || (process.platform === 'win32' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : undefined) })
    try {
        const context = await browser.newContext(), page = await context.newPage(), errors = [], media = []
        page.on('pageerror', e => errors.push(e.message))
        await context.route('**/*', async route => {
            const request = route.request(), u = new URL(request.url())
            if (u.hostname.endsWith('bilivideo.com')) {
                if (u.pathname === '/live-test.m3u8') {
                    await route.fulfill({ status: u.hostname === preferred ? 404 : 200, headers: { 'access-control-allow-origin': '*' }, body: '#EXTM3U\n' })
                    return
                }
                const r = Core.range(request.headers().range)
                media.push({ url: request.url(), range: r })
                if (!r) { await route.fulfill({ status: 400, body: 'requires range' }); return }
                const end = Math.min(r.end, data.length - 1)
                await route.fulfill({ status: 206, headers: {
                    'access-control-allow-origin': '*', 'access-control-expose-headers': '*',
                    'content-range': `bytes ${r.start}-${end}/${data.length}`, 'etag': '"fixture"',
                }, body: data.subarray(r.start, end + 1) })
            } else if (u.pathname.startsWith('/video/') || (u.hostname === 'live.bilibili.com' && u.pathname === '/123')) {
                await route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><title>CCB 测试</title><video></video>' })
            } else if (u.pathname === '/ccb-worker.js') {
                await route.fulfill({ contentType: 'application/javascript', body: `self.onmessage=async()=>{const r=await fetch(${JSON.stringify(original)},{headers:{Range:'bytes=0-262143'}});const b=new Uint8Array(await r.arrayBuffer());self.postMessage({length:b.length,correct:b.every((v,i)=>v===i%251),url:r.url})}` })
            } else if (u.pathname.includes('playurl')) {
                await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ code: 0, data: { dash: { video: [{ id: 80, baseUrl: original, backupUrl: [], bandwidth: 10000000 }] } } }) })
            } else { await route.abort() }
        })
        const bootstrap = `(${function (original, preferred) {
            const rawFetch = window.fetch.bind(window)
            const storage = { CCB_main: preferred, region_main: '深圳', CCB_live: preferred, region_live: '深圳', liveMode: true }
            window.__ccbStore = storage; window.__ccbMenus = []
            window.unsafeWindow = window
            window.GM_getValue = (key, fallback) => key in storage ? storage[key] : fallback
            window.GM_setValue = (key, value) => { storage[key] = value }
            window.GM_registerMenuCommand = (name, fn) => window.__ccbMenus.push(fn)
            window.GM_xmlhttpRequest = opts => {
                const ctrl = new AbortController()
                rawFetch(opts.url, { headers: opts.headers, signal: ctrl.signal }).then(async r => {
                    const body = await r.arrayBuffer()
                    opts.onprogress?.({ loaded: body.byteLength })
                    opts.onload?.({ response: body, status: r.status, finalUrl: r.url,
                        responseHeaders: [...r.headers].map(([k, v]) => k + ': ' + v).join('\r\n') })
                }).catch(e => e.name === 'AbortError' ? opts.onabort?.() : opts.onerror?.(e))
                return { abort: () => ctrl.abort() }
            }
            window.__playinfo__ = { code: 0, data: { dash: { video: [{ id: 80, baseUrl: original, backupUrl: [], bandwidth: 10000000 }], audio: [] } } }
            window.__NEPTUNE_IS_MY_WAIFU__ = { data: { playurl_info: { playurl: { stream: [{ format: [{ codec: [{ base_url: '/live-test.m3u8', url_info: [
                { host: 'https://upos-hz-mirrorakam.bilivideo.com', extra: '?token=keep' },
                { host: 'https://upos-bj-mirrorali.bilivideo.com', extra: '?token=keep' }
            ] }] }] }] } } } }
        }.toString()})(${JSON.stringify(original)},${JSON.stringify(preferred)});`
        const source = fs.readFileSync(path.join(__dirname, '../ccb.bundle.user.js'), 'utf8')
        await page.addInitScript({ content: bootstrap + '\n' + source })
        await page.goto('https://www.bilibili.com/video/BVfixture')
        const fetched = await page.evaluate(async url => {
            const r = await fetch(url, { headers: { Range: 'bytes=0-2097151' } }), b = new Uint8Array(await r.arrayBuffer())
            return { length: b.length, correct: b.every((v, i) => v === i % 251), url: r.url, cr: r.headers.get('content-range') }
        }, original)
        assert.equal(fetched.correct, true); assert.equal(fetched.length, data.length)
        assert.ok(fetched.url.includes('-sz-')); assert.equal(fetched.cr, 'bytes 0-2097151/2097152')
        console.log('PASS 页面 fetch 分块拼接、签名和实际节点')
        const xhr = await page.evaluate(url => new Promise((resolve, reject) => {
            const x = new XMLHttpRequest(), states = []
            x.open('GET', url); x.responseType = 'arraybuffer'; x.setRequestHeader('Range', 'bytes=65536-1048575')
            x.onreadystatechange = () => states.push(x.readyState)
            x.onerror = () => reject(new Error('XHR error'))
            x.onload = () => resolve({ bytes: [...new Uint8Array(x.response).subarray(0, 10)], length: x.response.byteLength, status: x.status, url: x.responseURL, cr: x.getResponseHeader('content-range'), states })
            x.send()
        }), original)
        assert.equal(xhr.status, 206); assert.equal(xhr.length, 1048576 - 65536)
        assert.deepEqual(xhr.bytes, [...data.subarray(65536, 65546)])
        assert.deepEqual(xhr.states, [2, 3, 4]); assert.ok(xhr.url.includes('-sz-'))
        console.log('PASS XHR 状态、响应头、响应字节和 responseURL')
        const worker = await page.evaluate(url => new Promise((resolve, reject) => {
            const code = `self.onmessage=async()=>{try{const r=await fetch(${JSON.stringify(url)},{headers:{Range:'bytes=0-1048575'}});const b=new Uint8Array(await r.arrayBuffer());self.postMessage({length:b.length,correct:b.every((v,i)=>v===i%251),url:r.url})}catch(e){self.postMessage({error:e.message})}}`
            const blob = URL.createObjectURL(new Blob([code], { type: 'application/javascript' })), w = new Worker(blob)
            const timer = setTimeout(() => { w.terminate(); reject(new Error('Worker timeout')) }, 15000)
            w.onmessage = e => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(blob); resolve(e.data) }
            w.onerror = e => { clearTimeout(timer); reject(new Error(e.message)) }
            w.postMessage('go')
        }), original)
        assert.equal(worker.error, undefined); assert.equal(worker.correct, true); assert.ok(worker.url.includes('-sz-'))
        console.log('PASS Blob Worker 与页面共用选源和分块调度')
        for (const mode of ['blob-module', 'external', 'external-module']) {
            const result = await page.evaluate(mode => new Promise((resolve, reject) => {
                const source = window.__playinfo__.data.dash.video[0].baseUrl
                const blob = URL.createObjectURL(new Blob([`self.onmessage=async()=>{const r=await fetch(${JSON.stringify(source)},{headers:{Range:'bytes=0-262143'}});const b=new Uint8Array(await r.arrayBuffer());self.postMessage({length:b.length,correct:b.every((v,i)=>v===i%251),url:r.url})}`], { type: 'application/javascript' }))
                const w = new Worker(mode === 'blob-module' ? blob : 'https://www.bilibili.com/ccb-worker.js', mode.endsWith('module') ? { type: 'module' } : {})
                const timer = setTimeout(() => { w.terminate(); reject(new Error('Worker timeout: ' + mode)) }, 15000)
                w.onmessage = e => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(blob); resolve({ ...e.data, instance: w instanceof Worker }) }
                w.onerror = e => { clearTimeout(timer); w.terminate(); reject(new Error(e.message)) }; w.postMessage('go')
            }), mode)
            assert.equal(result.correct, true); assert.equal(result.length, 262144); assert.equal(result.instance, true)
            assert.ok(result.url.includes('-sz-'))
        }
        console.log('PASS 模块和外部 Worker，保留原生构造器继承关系')
        await page.evaluate(() => window.__ccbMenus[0]())
        assert.equal(await page.locator('#ccb-settings-panel').count(), 1)
        assert.ok((await page.locator('#ccb-settings-panel').innerText()).includes(preferred))
        await page.getByRole('button', { name: '验证与测速当前视频', exact: true }).first().click()
        await page.waitForFunction(() => [...document.querySelectorAll('pre')].some(x => x.textContent.includes('推荐：')))
        assert.equal(await page.evaluate(() => window.__ccbStore.CCB_main), preferred)
        await page.getByRole('button', { name: '关闭', exact: true }).click()
        assert.ok(media.every(x => new URL(x.url).hostname.includes('-sz-')))
        assert.deepEqual(errors, [])
        console.log('PASS 面板渲染、测速不改变首选、无页面异常')
        await page.goto('https://live.bilibili.com/123')
        const live = await page.evaluate(async () => {
            const codec = window.__NEPTUNE_IS_MY_WAIFU__.data.playurl_info.playurl.stream[0].format[0].codec[0]
            const r = await fetch(codec.url_info[0].host + codec.base_url + codec.url_info[0].extra)
            return { hosts: codec.url_info.map(x => x.host), body: await r.text(), url: r.url, preferred: window.__ccbStore.CCB_live, blacklist: window.__ccbStore.CCB_manualBlacklist }
        })
        assert.equal(live.hosts.length, 3)
        assert.ok(live.hosts[0].includes('-sz-')); assert.ok(live.hosts[1].includes('-hz-')); assert.ok(live.hosts[2].includes('-bj-'))
        assert.equal(live.body, '#EXTM3U\n'); assert.ok(live.url.includes('-hz-')); assert.equal(live.preferred, preferred)
        assert.equal(live.blacklist, undefined); assert.deepEqual(errors, [])
        console.log('PASS 直播保留原始备用地址，首选硬错误后原生回退，不自动拉黑')
    } finally { await browser.close() }
}
main().catch(e => { console.error(e); process.exitCode = 1 })
