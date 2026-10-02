# CCB 项目状态

## 当前快照

- 项目：maxzrb/bilibiliccb，分支 main；功能版本 2.3.0。
- 本次从 e607ca6 快进同步到 b93220c；原有百度云临时文件未通过任务命令改动。
- 已实现首选与实际播放节点分离、真实 Range 验证、点播并发调度、页面/XHR/Worker 适配、设置与诊断面板。
- 自动回退不修改偏好、不写永久黑名单；当前资源临时冷却 60 秒。旧版黑名单仅归档，可主动恢复。
- 直播保留原生下载及完整备用地址；受控浏览器验证了 fetch 硬错误回退。
- 按用户最新决定，仓库 Actions 已禁用（enabled=false），全部工作流移除；本次临时创建的未部署 Pages 站点已删除。
- 更新、构建和验证改为本地手动执行；安装和后台节点更新使用内嵌数据、GitHub 原始文件及 jsDelivr。
- 2.2.0 安装脚本保存在 script/ccb-legacy-2.2.0.user.js。
- 本地验证：Node 19 项测试、Python 3 项构建测试、Go 4 项更新器测试全部通过；服务端编译通过（没有现存测试）。
- 真实 Edge 受控媒体检查通过：fetch、XHR、Blob/模块/外部 Worker、面板及直播回退；actionlint 静态检查通过。
- 发布状态：功能提交 0e494dc 已推送；随后移除 Actions 并修复并发时间模拟测试，正在准备最终手动发布。

## 用户决定及边界

- 采用深圳优先，失败或持续过慢再回退；主要环境 Edge/Chrome + Tampermonkey。
- 点播加入多连接；直播本次仅选源与回退。
- 用户明确暂缓偶发“深圳首选实际 hz”视频个案调查，待再次复现后处理；保留诊断能力。
- 自动测试使用受控媒体字节与浏览器 GM 模拟通道，不等同于真实 CDN 冷门/热门视频、番剧或所有 Tampermonkey 权限组合的播放验收。
- 未替换原生播放器/MSE，不保证固定公网速度；不支持的请求降级至原生通道。

## 技术决策

- 原始 playurl 保持签名及备用数组，登记媒体后在具体请求处选源。
- 普通 UPOS 地址可派生候选；M CDN 和特殊路径仅使用已提供的地址或原生通道。
- 验证读取 64 KiB，最多六候选、并发三；手动测速每节点最多 1 MiB。
- Range 块 512 KiB，自动并发从四开始、范围二到八；活动响应组装预算 16 MiB。
- 两个五秒有效下载窗口低于码率 1.3 倍且缓冲不足十秒时扩展池；按实际下载采样优先排序。
- 同一资源的跨节点分块要求相同总长、样本及强 ETag 或相同完整签名路径；逐块检查范围、长度及 ETag。
- Worker 通过专用消息通道调用页面内核；取消和终止传递至活动任务。
- 分块失败最多两次换源重试，整体失败原始地址重试一次；疑似签名过期合法刷新最多一次。
- 设置版本 CCB_settings_v1，保留旧键兼容；手动及旧版黑名单分开保存。
- 构建时间使用数据快照成功时间，产物可重复生成；--check 检查同一快照。
- 上游按行为移植缓存、错误传播及面板保护，未整体合并；PiliPlus/BTR 仅为独立实现的设计参考。

## 环境与验证命令

- 工作区 D:\pyprogram\bilibiliccb；PowerShell UTF-8；Node 24.18.0、Python 3.14.6。
- 系统 PATH 缺 Go：临时安装官方 Go 1.27.1 于 %TEMP%/ccb-go-toolchain/go/bin。
- Go 默认代理 IPv6 连接失败，本地验证使用 GOPROXY=https://goproxy.cn,direct；不修改永久环境。
- npm 本机 TLS/缓存异常：通过 Python HTTPS 获取官方 npm 元数据与归档，校验 SHA-512 后入 npm 缓存；npm ci --offline 安装成功。锁文件指向官方 registry.npmjs.org。
- 浏览器测试使用已安装 Edge；CI 使用 Playwright Chromium 1.62.1。
- actionlint 1.7.12 官方归档经 GitHub 发布 SHA-256 校验，临时目录安装。
- 命令：npm test；npm run test:browser；python -m unittest discover -s script/tests -p 'test_*.py'；python script/build.py --check；go test update.go update_test.go；go test ./server；actionlint -shellcheck=''；git diff --check。

## 后续事项

- 确认 Actions 保持禁用、最终发布标签和 Release 资产可访问；不得重新启用工作流。
- 用户下一次复现 hz 个案时索取脱敏诊断及清晰度，定位重定向、回退或遗漏请求。
- 实际网络的冷门、高码率、音视频切换及番剧需安装后继续验收，不将受控数据测试当作真实资源验证。

## 会话日志

### 2026-10-02 16:58

- 依据用户完整实施计划执行，新增可独立测试内核及浏览器适配模块；修复旧 HEAD/no-cors 误判与永久拉黑刷新行为。
- 完成受控 HTTP 与 Edge 自动验证、Go 更新器错误路径验证、构建一致性及工作流检查。
- 修复 Pages 仓库配置；整理 2.3.0 中文说明和 2.2.0 回退入口。
- 所有阶段均保留 UTF-8 编码；代码注释使用中文。发布后继续追加结果，不覆盖此日志。

### 2026-10-02 17:07

- 用户收到失败通知后明确建议不再使用 GitHub Actions。已设置仓库 Actions enabled=false，删除三个 workflow 和未部署的临时 Pages 站点，改为本地验证和手动发布。
- 远端失败日志显示一项低速窗口测试使用并发请求推进模拟时间，在 Linux 调度下只形成一个窗口；修正为串行可控时间模拟，并排除初始验活时间。本地完整检查再次通过。
- 补充备用地址变动的资源缓存失效及 UTF-8 验证入口 script/verify.py。无需再等待远端 Actions。
- 偶发 hz 案例继续按用户要求暂缓，诊断功能保留。
