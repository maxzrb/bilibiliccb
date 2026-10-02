#!/usr/bin/env python3
import sys
import io
# 强制 UTF-8 输出，解决 Windows GBK 编码问题
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
CCB 构建脚本
读取 data/*.json，将数据内嵌到 ccb.js 中，生成独立可用的 userscript。
解决 GitHub Pages 被阻断时脚本无法拉取服务器列表的问题。

用法:
    python script/build.py              # 构建到 script/ccb.bundle.user.js
    python script/build.py --watch      # 监听 data/ 变化自动构建 (需要 watchdog)
"""

import json
import os
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, "data")
TEMPLATE_FILE = os.path.join(SCRIPT_DIR, "ccb.js")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "ccb.bundle.user.js")

MARKER_START = "// ===EMBEDDED_START==="
MARKER_END = "// ===EMBEDDED_END==="


def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def replace_block(content, name, body):
    start = f"// ==={name}_START==="
    end = f"// ==={name}_END==="
    if content.count(start) != 1 or content.count(end) != 1:
        raise ValueError(f"构建标记缺失或重复：{name}")
    a = content.index(start)
    b = content.index(end, a) + len(end)
    return content[:a] + start + "\n" + body + "\n" + end + content[b:]


def validate_data(regions, cdn):
    if not isinstance(regions, list) or not regions or not all(isinstance(x, str) for x in regions):
        raise ValueError("地区数据格式错误")
    if not isinstance(cdn, dict) or not cdn:
        raise ValueError("CDN 数据不能为空")
    import re
    for region, nodes in cdn.items():
        if region not in regions or not isinstance(nodes, list) or not all(
            isinstance(x, str) and re.fullmatch(r"[\w.-]+", x, re.ASCII) for x in nodes
        ):
            raise ValueError(f"CDN 数据格式错误：{region}")


def build(output_file=OUTPUT_FILE):
    # 加载数据
    regions = load_json("region.json")
    cdn = load_json("cdn.json")
    validate_data(regions, cdn)

    try:
        info = load_json("info.json")
    except (FileNotFoundError, json.JSONDecodeError):
        info = {}

    # 使用数据成功更新时间，避免没有变化时反复生成不同的安装产物。
    build_time = info.get("lastSuccessTime") or "1970-01-01T00:00:00Z"
    info["buildTime"] = build_time

    # 读取模板
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # 检查标记是否存在
    if MARKER_START not in content:
        print(f"错误: 模板中未找到 {MARKER_START} 标记，请确认 ccb.js 包含嵌入标记。")
        sys.exit(1)
    if MARKER_END not in content:
        print(f"错误: 模板中未找到 {MARKER_END} 标记，请确认 ccb.js 包含嵌入标记。")
        sys.exit(1)

    # 生成嵌入数据块
    embedded_block = f"""{MARKER_START}
// 此区块由 build.py 自动生成 — 请编辑 data/*.json，不要手动修改此处。
const EMBEDDED = {{
    regions: {json.dumps(regions, ensure_ascii=False, indent="    ")},
    cdn: {json.dumps(cdn, ensure_ascii=False, indent="    ")},
    buildTime: "{build_time}"
}};
{MARKER_END}"""

    # 替换标记区域
    start_idx = content.index(MARKER_START)
    end_idx = content.index(MARKER_END) + len(MARKER_END)

    # 确保 end_idx 后换行
    while end_idx < len(content) and content[end_idx] == "\n":
        end_idx += 1

    result = content[:start_idx] + embedded_block + "\n" + content[end_idx:]

    def source(name):
        with open(os.path.join(SCRIPT_DIR, name), encoding="utf-8") as f:
            return f.read()

    core = source("cdn-core.js")
    result = replace_block(result, "CORE", core + "\n" + source("browser-runtime.js"))
    integration = replace_block(source("browser-integration.js"), "WORKER_CORE",
                                "const workerCore = " + json.dumps(core, ensure_ascii=False) + ";")
    result = replace_block(result, "INTEGRATION", integration)
    result = replace_block(result, "PANEL", source("settings-panel.js"))

    # 写入输出
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    with open(output_file, "w", encoding="utf-8", newline="\n") as f:
        f.write(result)

    # 统计
    region_count = len(regions)
    cdn_count = sum(len(nodes) for nodes in cdn.values())
    file_size_kb = len(result.encode("utf-8")) / 1024

    print(f"✅ 构建完成 → {output_file}")
    print(f"   地区数: {region_count}  节点总数: {cdn_count}  文件大小: {file_size_kb:.1f} KB")
    print(f"   构建时间: {build_time}")


def watch():
    """监听 data/ 目录变化，自动重新构建"""
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        print("需要安装 watchdog: pip install watchdog")
        sys.exit(1)

    class Handler(FileSystemEventHandler):
        def on_modified(self, event):
            if event.src_path.endswith(".json"):
                print(f"\n📁 检测到变化: {os.path.basename(event.src_path)}")
                build()

    observer = Observer()
    observer.schedule(Handler(), DATA_DIR, recursive=False)
    observer.start()
    print(f"👀 监听 {DATA_DIR} 目录变化... (Ctrl+C 停止)")
    try:
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n👋 停止监听")
    observer.join()


if __name__ == "__main__":
    if "--watch" in sys.argv or "-w" in sys.argv:
        build()  # 先构建一次
        watch()
    else:
        import argparse
        parser = argparse.ArgumentParser()
        parser.add_argument("--output", default=OUTPUT_FILE)
        parser.add_argument("--check", action="store_true")
        args = parser.parse_args()
        if args.check:
            import tempfile
            with tempfile.TemporaryDirectory() as tmp:
                artifact = os.path.join(tmp, "ccb.user.js")
                build(artifact)
                with open(artifact, encoding="utf-8") as f:
                    expected = f.read()
                with open(args.output, encoding="utf-8") as f:
                    if f.read() != expected:
                        raise SystemExit("安装脚本与当前源码或数据不同步，请重新构建")
        else:
            build(args.output)
