#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探索 motion-demo 项目：目录结构、WPS 懒加载空目录、源码引用完整性。"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path

# 默认扫描 motion-demo 根目录（脚本位于 tools/ 下）
ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {
    "node_modules",
    ".git",
    ".vite",
    ".vite-temp",
    "__pycache__",
}
SOURCE_EXTS = {".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".md", ".json", ".svg", ".mjs"}
IMPORT_RE = re.compile(
    r"""(?:import\s+(?:[^'"]+\s+from\s+)?|export\s+(?:\*|\{[^}]+\})\s+from\s+)['"](\.[^'"]+)['"]"""
)
CHINESE_RE = re.compile(r"[\u4e00-\u9fff]{2,24}")


def fmt_size(n: int) -> str:
    if n < 1024:
        return f"{n} B"
    if n < 1024 * 1024:
        return f"{n / 1024:.1f} KB"
    return f"{n / 1024 / 1024:.2f} MB"


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT)).replace("\\", "/")
    except ValueError:
        return str(path)


def walk(root: Path) -> tuple[list[Path], list[Path], dict[str, int]]:
    import os

    files: list[Path] = []
    dirs: list[Path] = []
    ext_counts: dict[str, int] = {}

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        current = Path(dirpath)
        dirs.append(current)
        for name in sorted(filenames):
            path = current / name
            files.append(path)
            ext = path.suffix.lower() or "(no ext)"
            ext_counts[ext] = ext_counts.get(ext, 0) + 1
    return files, dirs, ext_counts


def empty_dirs(dirs: list[Path], files: list[Path]) -> list[Path]:
    file_dirs = {p.parent for p in files}
    result = []
    for d in dirs:
        has_file = any(f.parent == d or d in f.parents for f in files)
        if not has_file:
            result.append(d)
    return sorted(result, key=lambda p: rel(p))


def parse_imports(src_root: Path) -> list[tuple[str, str, bool]]:
    """返回 (源文件, 相对 import 路径, 是否存在)"""
    rows: list[tuple[str, str, bool]] = []
    for file in sorted(src_root.rglob("*")):
        if file.suffix not in {".js", ".jsx", ".ts", ".tsx", ".mjs"}:
            continue
        try:
            text = file.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for match in IMPORT_RE.finditer(text):
            imp = match.group(1)
            if not imp.startswith("."):
                continue
            base = (file.parent / imp).resolve()
            candidates = [
                base,
                Path(str(base) + ".js"),
                Path(str(base) + ".jsx"),
                Path(str(base) + ".ts"),
                Path(str(base) + ".tsx"),
                Path(str(base) + ".mjs"),
                base / "index.js",
                base / "index.jsx",
            ]
            exists = any(c.exists() for c in candidates)
            rows.append((rel(file), imp, exists))
    return rows


def scan_dist_strings(dist_dir: Path, limit: int = 40) -> list[str]:
    if not dist_dir.exists():
        return []
    texts: list[str] = []
    for js in dist_dir.rglob("*.js"):
        try:
            texts.append(js.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError):
            pass
    merged = "\n".join(texts)
    return sorted(set(CHINESE_RE.findall(merged)))[:limit]


def tree_lines(root: Path, files: list[Path], max_depth: int = 4) -> list[str]:
    lines: list[str] = []

    def _walk(dir_path: Path, prefix: str, depth: int) -> None:
        if depth > max_depth:
            return
        try:
            entries = sorted(
                dir_path.iterdir(),
                key=lambda p: (not p.is_dir(), p.name.lower()),
            )
        except OSError:
            return
        entries = [e for e in entries if e.name not in SKIP_DIRS]
        for i, entry in enumerate(entries):
            last = i == len(entries) - 1
            branch = "└── " if last else "├── "
            if entry.is_dir():
                child_files = [
                    f for f in files
                    if f.is_file() and (f == entry or entry in f.parents)
                ]
                flag = " [空/WPS未同步]" if not child_files else f" ({len(child_files)} 文件)"
                lines.append(f"{prefix}{branch}{entry.name}/{flag}")
                extension = "    " if last else "│   "
                _walk(entry, prefix + extension, depth + 1)
            else:
                try:
                    size = entry.stat().st_size
                except OSError:
                    size = 0
                lines.append(f"{prefix}{branch}{entry.name}  ({fmt_size(size)})")

    lines.append(f"{root.name}/")
    _walk(root, "", 1)
    return lines


def load_package() -> dict | None:
    pkg = ROOT / "package.json"
    if not pkg.exists():
        return None
    return json.loads(pkg.read_text(encoding="utf-8"))


def main() -> int:
    global ROOT
    if len(sys.argv) > 1:
        ROOT = Path(sys.argv[1]).resolve()

    if not ROOT.exists():
        print(f"路径不存在: {ROOT}", file=sys.stderr)
        return 1

    print("扫描中...", flush=True)
    files, dirs, ext_counts = walk(ROOT)
    print(f"已扫描 {len(files)} 个文件", flush=True)
    empties = empty_dirs(dirs, files)
    imports = parse_imports(ROOT / "src") if (ROOT / "src").exists() else []
    broken = [(src, imp) for src, imp, ok in imports if not ok]
    pkg = load_package()
    dist_dir = ROOT / "dist"
    dist_strings = scan_dist_strings(dist_dir)

    total_size = sum(f.stat().st_size for f in files if f.exists())

    print("=" * 60)
    print("motion-demo 项目探索报告")
    print("=" * 60)
    print(f"扫描路径 : {ROOT}")
    print(f"扫描时间 : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"文件总数 : {len(files)}")
    print(f"目录总数 : {len(dirs)}")
    print(f"总大小   : {fmt_size(total_size)}（不含 node_modules）")
    print()

    if pkg:
        print("[ package.json ]")
        print(f"  name    : {pkg.get('name')}")
        print(f"  scripts : {', '.join(pkg.get('scripts', {}).keys())}")
        deps = pkg.get("dependencies", {})
        print(f"  deps    : {', '.join(deps.keys())}")
        print()

    print("[ 文件类型统计 ]")
    for ext, count in sorted(ext_counts.items(), key=lambda x: (-x[1], x[0])):
        print(f"  {ext:12} {count}")
    print()

    print("[ 目录树（深度 ≤ 4）]")
    for line in tree_lines(ROOT, files):
        print(line)
    print()

    if empties:
        print(f"[ ⚠ 空目录 / WPS 懒加载占位 ] 共 {len(empties)} 个")
        for d in empties:
            print(f"  - {rel(d)}/")
        print("  提示: 在 WPS 云盘中对这些文件夹执行「始终保留在此设备上」")
        print()
    else:
        print("[ ✓ 未发现空目录 ]")
        print()

    if imports:
        print("[ src 相对 import 检查 ]")
        ok_count = sum(1 for _, _, ok in imports if ok)
        print(f"  共 {len(imports)} 处本地 import，{ok_count} 处可解析，{len(broken)} 处缺失")
        for src, imp, ok in imports:
            mark = "✓" if ok else "✗"
            print(f"  {mark} {src}  ->  {imp}")
        print()

    if broken:
        print("[ ✗ 缺失模块 — npm run dev 可能失败 ]")
        for src, imp in broken:
            print(f"  {src} 缺少  {imp}")
        print()

    src_css = ROOT / "src" / "App.css"
    dist_css = list((ROOT / "dist" / "assets").glob("*.css")) if (ROOT / "dist" / "assets").exists() else []
    if src_css.exists() and dist_css:
        css_text = dist_css[0].read_text(encoding="utf-8", errors="ignore")
        markers = ["flow-scene", "tree-scene", "dfs-tree-panel", "main-card", "mini-card"]
        print("[ src/App.css vs dist 构建 ]")
        for m in markers:
            in_src = m in src_css.read_text(encoding="utf-8", errors="ignore")
            in_dist = m in css_text
            status = "一致" if in_src == in_dist else ("仅在 src" if in_src else "仅在 dist")
            print(f"  {m:18} src={in_src}  dist={in_dist}  ({status})")
        print("  若大量「仅在 src」，说明 dist 可能是旧构建或未包含 App.css")
        print()

    if dist_strings:
        print("[ dist 包内中文关键词（前 40 条）]")
        for s in dist_strings:
            print(f"  · {s}")
        print()

    index_html = ROOT / "index.html"
    if index_html.exists():
        title = re.search(r"<title>([^<]+)</title>", index_html.read_text(encoding="utf-8", errors="ignore"))
        if title:
            print(f"[ index.html 标题 ] {title.group(1).strip()}")
            if dist_strings and "两数之和" in dist_strings and "217" in title.group(1):
                print("  ⚠ 标题提到 217，但 dist 内容更像「两数之和」，可能不一致")
            print()

    print("[ 建议下一步 ]")
    if broken:
        print("  1. 同步 WPS 云盘后重新运行: python tools/explore-project.py")
        print("  2. 或临时改 App.jsx 指向已存在的 AnimatedPPTPage.jsx")
    elif not (ROOT / "dist" / "index.html").exists():
        print("  1. 运行 npm run build 生成 dist")
    else:
        print("  1. npm run dev   — 开发预览")
        print("  2. npm run build — 重新构建")
        print("  3. 直接打开 dist/index.html — 查看上次构建结果")
    print()
    return 1 if broken else 0


if __name__ == "__main__":
    raise SystemExit(main())
