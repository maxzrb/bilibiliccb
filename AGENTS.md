# 项目工作约定

- 所有文件读写使用 UTF-8，保留已有编码；PowerShell 读取中文先设置 UTF-8 输出，使用 `Get-Content -Encoding UTF8`。
- 代码注释使用中文，含中文文件通过 Python 或 Node.js 处理。
- 会话启动先阅读 `docs/codex/STATUS.md`，检查 Git 状态及用户已有修改。
- 项目状态以 `docs/codex/STATUS.md` 为准；阶段完成后更新该文件，并追加 `version/工作进度.md`。
- 功能版本变化时追加 `version/版本迭代记录.md`，保留历史。
- 修改 userscript 模块后执行 `python script/build.py`，通过 `--check` 确认 bundle 与源码、数据一致。
- 验证命令与环境说明见 README；不得将受控浏览器测试描述为真实 CDN 全量播放验证。
