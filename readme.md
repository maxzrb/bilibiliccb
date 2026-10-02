# Custom CDN of Bilibili（CCB）

网页端哔哩哔哩选源与点播多连接加速用户脚本。当前版本：**2.3.0**。

本项目是 [Kanda-Akihito-Kun/ccb](https://github.com/Kanda-Akihito-Kun/ccb) 的 Fork。
原作者：鼠鼠今天吃嘉然；Fork 维护者：AreithDream（maxzrb）。

## 安装与使用

- [安装当前版本](https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb.bundle.user.js)
- [回退到 2.2.0](https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb-legacy-2.2.0.user.js)
- 主要验证环境：Edge/Chrome + Tampermonkey。用户脚本管理器需要允许脚本运行和媒体域名请求。

安装后，从 Tampermonkey 菜单打开「📺 CCB 设置与播放诊断」。选择「推荐镜像」中的节点，或按地区、运营商筛选，或保存自定义 bilivideo 域名。新安装默认保留 B站原始源；已有首选与地区会迁移保留。

选择深圳节点后，先使用首选及深圳候选。当前视频没有有效内容或持续过慢时，再临时扩展到原始备用地址。回退不会改写你的首选，下一个视频重新尝试首选池。域名中的 `sz`、`hz` 是标签，不保证节点的物理位置；面板分别显示首选与实际响应节点，服务端重定向也会记录。

「验证与测速当前视频」先读最多 64 KiB 验证分片，再对通过的节点读最多 1 MiB 测试吞吐；每次最多测试六个节点。测速只展示结果，点击「采用推荐」才改变首选。测速会产生少量额外流量。

## 2.3.0 的主要变化

- 根据真实 GET 分片的状态、Content-Range 和字节长度验活。403/404、错误范围和不完整响应不再被误判为“有内容”；权限或网络原因无法读取时显示“未知”。
- 区分普通 UPOS、特殊路径、M CDN 及音频，保留原始签名和备用地址；页面、XHR、Worker 共用同一选源状态。
- 点播 DASH 有限 Range 请求支持多连接分块：自动模式从四连接开始，范围二到八连接；块大小 512 KiB，活动响应组装预算 16 MiB。超过预算的单个请求保留原生通道。
- 同一资源只有在长度、样本及强 ETag 或相同签名路径验证兼容后才混用节点。分块范围和长度逐块检查，按顺序交付原生播放器。
- 连续两个五秒下载窗口低于码率的 1.3 倍，且缓冲不足十秒，才因速度扩展回退池；至少三十秒内不重复进行速度切换。暂停、自动播放受阻及主动取消不会拉黑节点。
- 单块最多换源重试两次，失败后当前请求以原始地址单连接重试一次，并为当前资源降级。地址疑似过期时最多刷新一次合法播放地址。
- 自动失败只产生当前资源的临时冷却。手动黑名单单独保存；旧版黑名单保留在面板中，只有主动恢复后才生效。
- 音频独立选源，可开启「音频使用原始备用地址」。诊断导出包含节点、速度和原因，不包含签名、Cookie 或完整播放地址。

直播保留原生下载。本版只修改可识别直播响应的首个 host，并保留完整原始备用节点；可接管的 fetch 硬错误会尝试原始地址，其他协议仍由原生播放器处理回退。未知直播文本和特殊资源直接交给原生通道。

番剧需允许用户脚本在相关框架运行。受 DRM、授权、签名或播放器协议限制的请求会保留原生通道；本脚本不改变账号权限及播放授权。

## 数据更新与手动发布

节点内嵌在安装脚本中，后台优先从本 Fork 的 jsDelivr、GitHub 原始文件更新，随后尝试上游。有效数据缓存七天；线上失败时继续使用已有快照。

**本仓库已停用 GitHub Actions，并移除全部工作流。** 构建、测试、节点维护和版本发布在本地手动完成，不再定时启动任务或依赖 Pages 部署。

需要更新节点时运行 `go run update.go`，默认合并有效上游快照和维护镜像列表。第三方子域发现仅在手动设置 `CCB_DISCOVER=1` 时运行。来源失败保留原有成功时间；节点无变化时不重写数据。

更新完成后运行 `python script/build.py` 和本地验证命令，再将源码、数据与安装脚本作为同一快照提交。手动发布 GitHub Release，附带安装脚本和 2.2.0 回退脚本。插件安装与更新入口仍使用 GitHub 原始文件及 jsDelivr，不依赖构建服务。

## 本地构建与验证

需要 Python 3、Node.js 24；更新器和服务端检查需要 Go 1.26 或更高。

```powershell
npm ci --ignore-scripts
npm test
python -m unittest discover -s script/tests -p 'test_*.py'
python script/build.py
python script/build.py --check
node --check script/ccb.bundle.user.js
go test update.go update_test.go
go test ./server
npm run test:browser
# 或使用本地完整检查入口（Go 不在 PATH 时可传 --go <路径>）
python script/verify.py --browser
```

Windows 浏览器测试默认使用已安装的 Edge。其他环境执行 `npx playwright install chromium`；也可通过 `CCB_BROWSER` 指定 Chromium 可执行文件。

`python script/build.py --output <路径>` 可指定产物位置。安装脚本由模块和 `data/*.json` 构建，请修改源码模块后重新构建，不要直接修改 bundle。构建时间取数据快照成功时间，保证没有变化时生成字节一致的产物。

## 验证范围

自动测试使用可控媒体响应验证字节一致性、错误处理、并发提升及页面/Worker/XHR 适配。真实 CDN 的内容覆盖、签名兼容及公网速度会随视频和网络变化，无法保证固定速度。冷门视频、高码率视频和直播的实际体验需要安装后结合诊断继续验证。

## 参考与许可

按功能移植上游的 fetch 错误传播、配置缓存、面板并发保护及安全渲染思路，没有整体覆盖上游源码。

- [CCB 上游改进](https://github.com/Kanda-Akihito-Kun/ccb/commit/755373f93aadf97b3da01a327299eefdb57d886b)
- [PiliPlus 地址分类与选源](https://github.com/bggRGjQaUbCoE/PiliPlus/blob/main/lib/utils/video_utils.dart)
- [Bilibili 线程撕裂者](https://github.com/MrTangLuyao/Bilibili-thread-ripper)

本次内核和浏览器适配代码为本 Fork 独立实现。PiliPlus 仅作行为设计参考，未复制其源代码；线程撕裂者仅作调度设计参考。CCB 原项目许可及版权声明见 [LICENSE](LICENSE)。
