"""在本地执行 CCB 发布检查；任何检查失败立即停止。"""
import argparse
import pathlib
import shutil
import subprocess
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--go", default=shutil.which("go"), help="Go 可执行文件路径")
    parser.add_argument("--browser", action="store_true", help="运行真实 Chromium/Edge 受控媒体检查")
    args = parser.parse_args()
    root = pathlib.Path(__file__).resolve().parent.parent
    node = shutil.which("node")
    if not node:
        raise SystemExit("未找到 Node.js")
    if not args.go:
        raise SystemExit("未找到 Go，请安装或通过 --go 指定工具链")
    tests = sorted(str(x.relative_to(root)) for x in (root / "script/tests").glob("*.test.cjs"))
    commands = [
        [args.go, "test", "update.go", "update_test.go"],
        [args.go, "test", "./server"],
        [node, "--test", *tests],
        [sys.executable, "-m", "unittest", "discover", "-s", "script/tests", "-p", "test_*.py"],
        [sys.executable, "script/build.py", "--check"],
        [node, "--check", "script/ccb.bundle.user.js"],
    ]
    if args.browser:
        commands.append([node, "script/tests/browser.cjs"])
    commands.append(["git", "diff", "--check"])
    for command in commands:
        print("执行：", " ".join(command), flush=True)
        subprocess.run(command, cwd=root, check=True)
    print("本地发布检查通过", flush=True)


if __name__ == "__main__":
    main()
