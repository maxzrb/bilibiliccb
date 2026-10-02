const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const Core = require('../cdn-core.js')

const original = 'https://upos-hz-mirrorakam.bilivideo.com/upgcxcode/7/video.m4s?token=keep&deadline=4102444800'
const preferred = 'upos-sz-mirrorali.bilivideo.com'
const bytes = Buffer.alloc(3 * 1024 * 1024)
for (let i = 0; i < bytes.length; i++) bytes[i] = i % 251

async function fixture(t, options = {}) {
    const requests = [], controllers = new Set()
    const server = http.createServer((req, res) => {
        const u = new URL(req.url, 'http://localhost'), node = u.searchParams.get('node')
        const requested = Core.range(req.headers.range)
        requests.push({ node, range: req.headers.range, token: u.searchParams.get('token'), deadline: u.searchParams.get('deadline') })
        const mode = options.mode?.(node, requested) || 'good'
        if (mode === '403' || mode === '404') { res.writeHead(Number(mode)); res.end('error'); return }
        if (mode === 'ignore') { res.writeHead(200); res.end(bytes); return }
        if (!requested) { res.writeHead(400); res.end(); return }
        const end = Math.min(requested.end, bytes.length - 1)
        const body = Buffer.from(bytes.subarray(requested.start, end + 1))
        if (mode === 'different') body[0] ^= 255
        const start = mode === 'wrong-range' ? requested.start + 1 : requested.start
        const headers = { 'content-range': `bytes ${start}-${end}/${bytes.length}`, 'etag': '"same-resource"' }
        const timer = setTimeout(() => {
            if (res.destroyed) return
            res.writeHead(206, headers)
            res.end(mode === 'truncated' ? body.subarray(0, body.length - 1) : body)
        }, options.delay?.(node, requested) || 0)
        controllers.add(timer); res.on('close', () => { clearTimeout(timer); controllers.delete(timer) })
    })
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    t.after(async () => { for (const c of controllers) clearTimeout(c); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) })
    const base = `http://127.0.0.1:${server.address().port}`
    const transport = async (url, init) => {
        const u = new URL(url), local = new URL(u.pathname + u.search, base)
        local.searchParams.set('node', u.hostname)
        const r = await fetch(local, init)
        Object.defineProperty(r, 'url', { value: url })
        return r
    }
    return { transport, requests }
}
function engine(transport, extra = {}) {
    const events = [], config = { preferred, enabled: true, threads: 4, shenzhen: [], ...extra.config }
    const core = Core.create({ transport, ...extra, config: () => config, onStatus: e => events.push(e) })
    const resource = core.register({ id: 80, base_url: original, backup_url: [] })
    return { core, resource, config, events }
}

test('分类保护特殊路径、M CDN 与签名；不改原始备用地址', () => {
    assert.equal(Core.ordinary(original), true)
    assert.equal(Core.ordinary(original + '&os=mcdn'), false)
    assert.equal(Core.swap('https://foo.mcdn.bilivideo.cn/v1/resource/a', preferred), null)
    assert.equal(Core.swap('https://upos-sz-302.bilivideo.com/upgcxcode/a', preferred), null)
    assert.equal(new URL(Core.swap(original, preferred)).search, new URL(original).search)
    const rep = { base_url: original, backup_url: [original.replace('hz', 'bj')] }
    const before = JSON.stringify(rep)
    engine(async () => {}).core.register(rep)
    assert.equal(JSON.stringify(rep), before)
})

test('403/404、整文件 200、错误范围和截断都不会标为有内容', async t => {
    for (const mode of ['403', '404', 'ignore', 'wrong-range', 'truncated']) {
        await t.test(mode, async t => {
            const f = await fixture(t, { mode: () => mode }), e = engine(f.transport)
            const p = await e.core.probe(e.resource, original)
            assert.equal(p.hasContent, false)
        })
    }
})

test('不可读取响应标为未知', async () => {
    const e = engine(async () => { throw new TypeError('CORS') })
    assert.equal((await e.core.probe(e.resource, original)).hasContent, null)
})

test('乱序分块精确拼接；深圳可用时不使用 hz，偏好保持不变', async t => {
    const f = await fixture(t, { delay: (_, r) => r.start ? 30 - (r.start / Core.CHUNK % 3) * 10 : 1 })
    const e = engine(f.transport)
    const response = await e.core.route(original, { headers: { Range: `bytes=0-${bytes.length - 1}` } })
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes)
    assert.equal(response.headers.get('content-range'), `bytes 0-${bytes.length - 1}/${bytes.length}`)
    assert.ok(f.requests.every(r => r.node.includes('-sz-')))
    assert.ok(f.requests.every(r => r.token === 'keep'))
    assert.equal(e.config.preferred, preferred)
    assert.equal(e.core.inspect().reserved, 0)
})

test('当前资源连续失败冷却，回退不修改首选；新资源重新验证', async t => {
    const f = await fixture(t, { mode: node => node.includes('-sz-') ? '404' : 'good' })
    const e = engine(f.transport)
    await e.core.probe(e.resource, Core.swap(original, preferred), undefined, 1048576)
    await e.core.probe(e.resource, Core.swap(original, preferred), undefined, 1048576)
    assert.ok(e.resource.health.get(Core.swap(original, preferred)).blockedUntil > Date.now())
    const response = await e.core.route(original, { headers: { Range: 'bytes=0-1048575' } })
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(0, 1048576))
    assert.equal(e.config.preferred, preferred)
    const next = e.core.register({ id: 80, base_url: original.replace('/7/', '/8/') })
    assert.equal(next.health.size, 0)
})

test('视频、音频、清晰度及签名缓存互相隔离', async t => {
    const f = await fixture(t), e = engine(f.transport)
    const audio = e.core.register({ base_url: original }, 'audio')
    const quality = e.core.register({ id: 120, base_url: original.replace('video.m4s', '4k.m4s') })
    const signed = e.core.register({ base_url: original.replace('token=keep', 'token=fresh') })
    await e.core.probe(e.resource, original)
    assert.equal(audio.probes.size, 0); assert.equal(quality.probes.size, 0); assert.equal(signed.probes.size, 0)
})

test('相同长度但内容不同的节点不能混入分块', async t => {
    const f = await fixture(t, { mode: node => node.includes('mirrorcos') ? 'different' : 'good' })
    const e = engine(f.transport)
    const r = await e.core.route(original, { headers: { Range: 'bytes=65536-2097151' } })
    assert.deepEqual(Buffer.from(await r.arrayBuffer()), bytes.subarray(65536, 2097152))
    assert.ok(!f.requests.some(x => x.node.includes('mirrorcos') && Core.range(x.range).start > 0))
})

test('取消不记失败，释放预算；非有限 Range 与超预算请求保留原生', async t => {
    const f = await fixture(t, { delay: () => 150 }), e = engine(f.transport), ctrl = new AbortController()
    const p = e.core.route(original, { headers: { Range: 'bytes=0-2097151' }, signal: ctrl.signal })
    setTimeout(() => ctrl.abort(), 20)
    await assert.rejects(p, { name: 'AbortError' })
    assert.equal(e.resource.health.size, 0); assert.equal(e.core.inspect().reserved, 0)
    assert.equal(await e.core.route(original, { headers: { Range: 'bytes=0-' } }), null)
    assert.equal(await e.core.route(original, { headers: { Range: `bytes=0-${Core.BUDGET}` } }), null)
})

test('单连接限速模型中并发下载提升吞吐', async t => {
    const f = await fixture(t, { delay: (_, r) => r.end > 65535 ? 80 : 1 })
    const a = engine(f.transport, { config: { acceleration: false } })
    let start = performance.now()
    await a.core.route(original, { headers: { Range: `bytes=0-${bytes.length - 1}` } })
    const single = performance.now() - start
    const b = engine(f.transport)
    start = performance.now()
    await b.core.route(original, { headers: { Range: `bytes=0-${bytes.length - 1}` } })
    const parallel = performance.now() - start
    assert.ok(parallel < single * .75, `单连接 ${single.toFixed(0)}ms；多连接 ${parallel.toFixed(0)}ms`)
})

test('分块三次失败后原始源只重试一次，并为当前资源禁用并发', async t => {
    const f = await fixture(t, { mode: (node, r) => r.start > 0 && node.includes('-sz-') ? 'wrong-range' : 'good' })
    const e = engine(f.transport)
    const response = await e.core.route(original, { headers: { Range: 'bytes=65536-2097151' } })
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(65536, 2097152))
    assert.equal(e.resource.parallel, false)
    const native = f.requests.filter(x => x.node.includes('-hz-'))
    assert.equal(native.length, 1)
    assert.equal(native[0].range, 'bytes=65536-2097151')
})

test('签名过期仅刷新一次合法播放地址', async t => {
    const f = await fixture(t)
    let refreshes = 0, core
    core = Core.create({ transport: f.transport, config: () => ({ preferred }), refresh: async old => {
        refreshes++
        return core.register({ id: old.id, base_url: original })
    } })
    const expired = original.replace('4102444800', '1')
    core.register({ id: 80, base_url: expired })
    const response = await core.route(expired, { headers: { Range: 'bytes=0-1048575' } })
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(0, 1048576))
    assert.equal(refreshes, 1)
    assert.ok(f.requests.length > 0)
    assert.ok(f.requests.every(x => x.deadline === '4102444800'))
})

test('真实请求超时与用户取消分开处理', async t => {
    const f = await fixture(t, { delay: () => 3100 }), e = engine(f.transport)
    const p = await e.core.probe(e.resource, original)
    assert.equal(p.hasContent, false)
    assert.equal(p.error.message, '请求超时')
    assert.equal(e.resource.health.get(original).failures, 1)
})

test('两个不足码率的有效窗口才扩展回退池；暂停不触发', async t => {
    const f = await fixture(t)
    let clock = 40000, demand = true
    const e = engine(async (u, init) => { const r = await f.transport(u, init); clock += 5100; return r },
        { now: () => clock, playback: () => ({ demand, buffer: 2 }), config: { acceleration: false } })
    e.resource.bandwidth = 100000000
    await e.core.route(original, { headers: { Range: 'bytes=0-1048575' } })
    assert.equal(e.resource.expanded, true)
    demand = false
    const paused = e.core.register({ id: 120, bandwidth: 100000000, base_url: original.replace('/7/', '/8/') })
    await e.core.route(paused.primary, { headers: { Range: 'bytes=0-1048575' } })
    assert.equal(paused.expanded, false)
})

test('并行请求的组装预算不超过 16 MiB，排队取消不会泄漏预算', async t => {
    const f = await fixture(t, { delay: () => 30 }), e = engine(f.transport), ctrl = new AbortController()
    const jobs = Array.from({ length: 12 }, () => e.core.route(original, { headers: { Range: 'bytes=0-2097151' }, signal: ctrl.signal }))
    assert.equal(e.core.inspect().reserved, Core.BUDGET)
    ctrl.abort()
    const result = await Promise.allSettled(jobs)
    assert.ok(result.every(x => x.status === 'rejected' && x.reason.name === 'AbortError'))
    assert.equal(e.core.inspect().reserved, 0)
    assert.equal(e.core.inspect().active, 0)
})
