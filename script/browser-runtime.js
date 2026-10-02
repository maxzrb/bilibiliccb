/* Worker 使用专用消息通道调用页面内核，避免两套选源状态发生分歧。 */
function ccbWorkerRuntime(channel) {
    if (self.__CCB_RANGE_WORKER__) return
    self.__CCB_RANGE_WORKER__ = true
    const pending = new Map()
    let serial = 0
    self.addEventListener('message', event => {
        const m = event.data
        if (!m || m.channel !== channel || m.type !== 'result') return
        event.stopImmediatePropagation()
        const p = pending.get(m.id)
        if (!p) return
        pending.delete(m.id); p.cleanup()
        if (m.error) p.reject(Object.assign(new Error(m.error), { name: m.name || 'Error' }))
        else if (m.skip) p.resolve(null)
        else {
            const response = new Response(m.body, { status: m.status, headers: m.headers })
            Object.defineProperty(response, 'url', { value: m.url })
            p.resolve(response)
        }
    })
    const route = (url, init = {}) => {
        if (!self.CcbCore.range(new Headers(init.headers).get('range')) || !String(url).includes('/upgcxcode/')) return Promise.resolve(null)
        return new Promise((resolve, reject) => {
            const id = ++serial, signal = init.signal
            const abort = () => {
                self.postMessage({ channel, type: 'cancel', id }); pending.delete(id); cleanup()
                reject(new DOMException('请求已取消', 'AbortError'))
            }
            const timer = setTimeout(() => {
                self.postMessage({ channel, type: 'cancel', id }); pending.delete(id); cleanup()
                reject(new Error('Worker 分片请求超时'))
            }, 60000)
            const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort) }
            if (signal?.aborted) { abort(); return }
            pending.set(id, { resolve, reject, cleanup })
            signal?.addEventListener('abort', abort, { once: true })
            self.postMessage({ channel, type: 'request', id, url: String(url), headers: [...new Headers(init.headers)], method: init.method || 'GET' })
        })
    }
    const nativeFetch = self.fetch.bind(self)
    self.fetch = async (input, init = {}) => {
        const request = new Request(input, init)
        const response = await route(request.url, { method: request.method, headers: request.headers, signal: request.signal })
        if (response) return response
        const native = await nativeFetch(request)
        self.postMessage({ channel, type: 'native', requested: request.url, actual: native.url })
        return native
    }
    if (self.XMLHttpRequest) self.XMLHttpRequest = self.CcbCore.xhrAdapter(self.XMLHttpRequest, route)
}

function ccbAttachWorker(worker, channel, engine, noteNative) {
    const jobs = new Map()
    worker.addEventListener('message', event => {
        const m = event.data
        if (!m || m.channel !== channel) return
        event.stopImmediatePropagation()
        if (m.type === 'native') { noteNative?.(m.requested, m.actual); return }
        if (m.type === 'cancel') { jobs.get(m.id)?.abort(); return }
        if (m.type !== 'request' || !Number.isSafeInteger(m.id) || jobs.has(m.id)) return
        const ctrl = new AbortController(); jobs.set(m.id, ctrl)
        engine.route(m.url, { headers: m.headers, method: m.method, signal: ctrl.signal }).then(async response => {
            if (!response) worker.postMessage({ channel, type: 'result', id: m.id, skip: true })
            else {
                const body = await response.arrayBuffer()
                worker.postMessage({ channel, type: 'result', id: m.id, body, headers: [...response.headers], status: response.status, url: response.url }, [body])
            }
        }).catch(e => worker.postMessage({ channel, type: 'result', id: m.id, error: e.message, name: e.name }))
            .finally(() => jobs.delete(m.id))
    })
    const terminate = worker.terminate.bind(worker)
    worker.terminate = () => { for (const c of jobs.values()) c.abort(); jobs.clear(); terminate() }
    return worker
}
