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


def build():
    # 加载数据
    regions = load_json("region.json")
    cdn = load_json("cdn.json")

    try:
        info = load_json("info.json")
    except (FileNotFoundError, json.JSONDecodeError):
        info = {}

    build_time = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
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

    # 写入输出
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(result)

    # 统计
    region_count = len(regions)
    cdn_count = sum(len(nodes) for nodes in cdn.values())
    file_size_kb = len(result.encode("utf-8")) / 1024

    print(f"✅ 构建完成 → {OUTPUT_FILE}")
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
        build()
