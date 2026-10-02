// 使用 DOM 文本接口构建面板，节点名与在线数据不会作为 HTML 执行。
let panelOpening = false
const openPanel = async () => {
    const existing = document.querySelector('#ccb-settings-panel')
    if (existing) { existing.remove(); return }
    if (panelOpening) return
    panelOpening = true
    try {
        const el = (tag, text, parent) => {
            const node = document.createElement(tag)
            if (text !== undefined) node.textContent = text
            parent?.appendChild(node)
            return node
        }
        const root = el('div')
        root.id = 'ccb-settings-panel'
        root.style.cssText = 'position:fixed;z-index:2147483647;right:18px;top:18px;width:480px;max-width:calc(100vw - 36px);max-height:calc(100vh - 36px);overflow:auto;background:#151515;color:#eee;padding:16px;border:1px solid #555;border-radius:12px;font:13px/1.6 system-ui'
        const button = (text, parent, handler) => {
            const b = el('button', text, parent)
            b.style.cssText = 'background:#303b50;color:white;border:1px solid #596579;border-radius:5px;padding:5px 10px;margin:4px;cursor:pointer'
            b.addEventListener('click', handler); return b
        }
        const select = (parent, values, current, change) => {
            const s = el('select', undefined, parent)
            s.style.cssText = 'background:#222;color:white;padding:7px;width:100%;margin:4px 0'
            if (!values.includes(current)) values = [...values, current]
            values.forEach(v => { const o = el('option', v, s); o.value = v })
            s.value = current; s.addEventListener('change', () => change(s.value)); return s
        }
        el('strong', 'CCB 2.3 · 设置与播放诊断', root)
        button('关闭', root, () => root.remove())
        el('p', '深圳优先；当前视频失败或持续过慢才回退。回退不会修改你的首选。地区来自域名标签，不保证服务器物理位置。', root)
        const status = el('pre', undefined, root)
        status.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;background:#202020;padding:10px;border-radius:6px'
        const updateStatus = () => {
            const lines = [`首选：${getTargetCdnNode()}`]
            for (const kind of ['video', 'audio']) {
                const d = diagnostics[kind]
                lines.push(`${kind === 'video' ? '视频' : '音频'}：${d ? `${d.node} · ${d.bps ? (d.bps / 1048576).toFixed(2) + ' MiB/s' : d.state}\n${d.reason || ''}` : '等待媒体请求'}`)
            }
            const last = diagnostics.events.at(-1)
            if (last) lines.push(`最近状态：${last.state} ${last.node || ''} ${last.reason || ''}`)
            status.textContent = lines.join('\n')
        }
        updateStatus()
        document.addEventListener('ccb-status', updateStatus)
        const observer = new MutationObserver(() => {
            if (!root.isConnected) { document.removeEventListener('ccb-status', updateStatus); observer.disconnect() }
        })
        let adopted = null
        for (const [ctx, title] of [['main', '视频 / 课堂 / 番剧'], ['live', '直播（原生下载）'], ['diagnostics', 'B站测速页']]) {
            const section = el('fieldset', undefined, root)
            section.style.cssText = 'border:1px solid #444;margin:12px 0;padding:10px'
            el('legend', title, section)
            const listBox = el('div', undefined, section)
            const carrier = select(section, ['全部', '电信', '联通', '移动', '其他'], getIspFilter(), v => { setIspFilter(v); renderNodes(region.value) })
            const region = select(section, ['推荐镜像', ...regionList], getRegion(ctx), v => { setRegion(ctx, v); renderNodes(v) })
            const results = el('pre', undefined, section)
            results.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;max-height:160px;overflow:auto;font-size:11px'
            let nodes = []
            const renderNodes = regionValue => {
                listBox.replaceChildren()
                const saved = getTargetCdnNode(ctx)
                if (regionValue === manualRegionName) {
                    const input = el('input', undefined, listBox)
                    input.style.cssText = 'width:95%;background:#222;color:white;padding:7px'
                    input.value = saved === defaultCdnNode ? '' : saved
                    input.placeholder = '输入 bilivideo CDN 域名'
                    button('保存自定义', listBox, () => {
                        const value = input.value.trim()
                        if (!value) setTargetCdnNode(ctx, defaultCdnNode)
                        else {
                            try {
                                const u = new URL(value.includes('://') ? value : `https://${value}`)
                                if (u.protocol !== 'https:' || !/(?:^|\.)bilivideo\.(?:com|cn|net)$/.test(u.hostname) || u.port || u.username || u.password || u.search || u.hash || u.pathname !== '/') throw new Error()
                                setTargetCdnNode(ctx, u.hostname)
                            } catch (_) { results.textContent = '请输入有效的 HTTPS bilivideo CDN 域名'; return }
                        }
                        results.textContent = '已保存首选'; updateStatus()
                    })
                    nodes = []; return
                }
                nodes = regionValue === '推荐镜像' ? [...Core.MIRRORS] : [...((cdnDataCache || {})[regionValue] || [])]
                if (carrier.value !== '全部') nodes = nodes.filter(n => detectIsp(n) === carrier.value)
                nodes = nodes.filter(n => !getNodeFailCount(n))
                const s = select(listBox, [defaultCdnNode, ...nodes], saved, v => { setTargetCdnNode(ctx, v); updateStatus() })
                for (const o of s.options) {
                    if (o.value === defaultCdnNode) continue
                    const service = /mirrorali/.test(o.value) ? '阿里云' : /mirrorcos/.test(o.value) ? '腾讯云' : /mirrorhw|mirror08/.test(o.value) ? '华为云' : detectIsp(o.value)
                    o.textContent = `${service} · ${o.value}${nodes.includes(o.value) ? '' : '（已保存，当前列表未收录）'}`
                }
            }
            renderNodes(region.value)
            if (ctx !== 'live') {
                const test = button('验证与测速当前视频', section, async () => {
                    const r = engine.first()
                    if (!r) { results.textContent = '尚未取得当前视频地址，请先打开视频。无视频时不会把连接延迟标成内容可用。'; return }
                    test.disabled = true; adopted = null
                    const ctrl = new AbortController(), measurements = []
                    results.textContent = '验证中：每节点最多 64 KiB；通过后每节点测速最多 1 MiB。'
                    try {
                        // 手动测试也限制候选数，避免扫描数百节点消耗大量流量。
                        const chosen = nodes.slice(0, 6)
                        for (let i = 0; i < chosen.length; i += 3) await Promise.all(chosen.slice(i, i + 3).map(async node => {
                            const url = Core.swap(r.originals.find(Core.ordinary) || '', node)
                            if (!url) { measurements.push({ node, hasContent: null }); return }
                            const verified = await engine.probe(r, url, ctrl.signal)
                            const speed = verified.hasContent === true ? await engine.probe(r, url, ctrl.signal, 1048576) : verified
                            measurements.push({ node, ...speed })
                            results.textContent = measurements.map(x => `${x.hasContent === true ? '✅ 有效分片' : x.hasContent === false ? '🚫 不可用' : '❔ 未知'} ${x.node} ${x.bps ? (x.bps / 1048576).toFixed(2) + ' MiB/s' : ''}`).join('\n')
                        }))
                        const best = measurements.filter(x => x.hasContent === true).sort((a, b) => b.bps - a.bps)[0]
                        if (best) { adopted = { ctx, node: best.node }; results.textContent += `\n推荐：${best.node}，点击「采用推荐」保存。` }
                    } catch (e) { results.textContent = `测速结束：${e.message}` }
                    finally { test.disabled = false }
                })
                button('采用推荐', section, () => {
                    if (adopted?.ctx !== ctx) { results.textContent = '请先验证当前视频，取得此栏的推荐结果。'; return }
                    setTargetCdnNode(ctx, adopted.node); renderNodes(region.value); updateStatus()
                })
            }
            button('手动拉黑首选', section, () => {
                const node = getTargetCdnNode(ctx)
                if (node === defaultCdnNode) return
                addFailCount(node); renderNodes(region.value); results.textContent = '已加入手动黑名单；自动回退不会写入此名单。'
            })
        }
        el('label', '点播多连接：', root)
        const threadValue = settings.acceleration ? String(settings.threads) : '关闭'
        select(root, ['关闭', 'auto', '2', '4', '6', '8'], threadValue, value => {
            settings.acceleration = value !== '关闭'; settings.threads = value === '关闭' ? 'auto' : value; persistSettings()
        })
        el('small', 'auto 从 4 连接开始，在 2–8 间调整；仅加速已验证的有限 DASH Range 请求。', root)
        const audioLabel = el('label', undefined, root)
        audioLabel.style.display = 'block'
        const audio = el('input', undefined, audioLabel); audio.type = 'checkbox'; audio.checked = settings.audioOriginal
        el('span', ' 音频使用原始备用地址', audioLabel)
        audio.addEventListener('change', () => { settings.audioOriginal = audio.checked; persistSettings() })
        button(getLiveMode() ? '直播换源：开启' : '直播换源：关闭', root, e => {
            const next = !getLiveMode(); GM_setValue(liveModeStored, next); e.currentTarget.textContent = next ? '直播换源：开启' : '直播换源：关闭'
        })
        button('应用并刷新', root, () => location.reload())
        const blacklist = el('pre', undefined, root)
        blacklist.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px'
        const showBans = () => { blacklist.textContent = `手动黑名单：${Object.keys(getFailCount()).join(', ') || '空'}\n旧版记录（未自动启用）：${GM_getValue('CCB_legacyBlacklist', '{}')}` }
        showBans()
        button('清空手动黑名单', root, () => { GM_setValue('CCB_manualBlacklist', '{}'); invalidateConfig(); showBans() })
        button('恢复旧版黑名单', root, () => { GM_setValue('CCB_manualBlacklist', GM_getValue('CCB_legacyBlacklist', '{}')); invalidateConfig(); showBans() })
        button('下载诊断记录', root, () => {
            // 诊断只导出节点与状态，不导出签名、Cookie 或播放地址。
            const blob = new Blob([JSON.stringify({ version: '2.3.0', preferred: getTargetCdnNode(), ...diagnostics }, null, 2)], { type: 'application/json' })
            const a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'ccb-diagnostics.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
        })
        document.documentElement.appendChild(root)
        observer.observe(document.documentElement, { childList: true, subtree: true })
    } finally { panelOpening = false }
}
