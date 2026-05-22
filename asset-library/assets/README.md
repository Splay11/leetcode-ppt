# asset-library/assets — 独立素材副本

本目录是 **`src/` 下各 deck 的本地化副本**（snapshot），供素材库预览与新 PPT 组装使用。

## 原则

- **素材库只 import 本目录**，不直接引用 `src/maxDepth`、`src/twoSum` 等。
- `src/` 仍是课件主开发目录；改 `src/` 后若需同步素材库，请重新复制对应文件（见下方映射）。
- 样式集中在 `styles/`：`md.css` / `ts.css` / `cd.css` / `dfs.css` / `base.css`。

## 目录

```
assets/
├── styles/          # 从 src 复制的 CSS
├── md/              # 自 src/maxDepth（LC 104）
├── ts/              # 自 src/twoSum（LC 1）
├── cd/              # 自 src/containsDuplicate（LC 217）
└── dfs/             # 自 src/dfs（概念 deck）
```

## 与 src 的映射

| 素材库路径 | 源路径 |
|-----------|--------|
| `assets/md/` | `src/maxDepth/`（components + animConfig + playback） |
| `assets/ts/` | `src/twoSum/` |
| `assets/cd/` | `src/containsDuplicate/` |
| `assets/styles/md.css` | `src/maxDepth/max-depth.css` |
| … | … |

## 同步命令（PowerShell，在 motion-demo 根目录）

```powershell
# maxDepth
Copy-Item -Recurse -Force src/maxDepth/components asset-library/assets/md/components
Copy-Item -Force src/maxDepth/*.js asset-library/assets/md/
Copy-Item -Force src/maxDepth/max-depth.css asset-library/assets/styles/md.css

# twoSum / containsDuplicate / dfs — 同理，见 docs/asset-library.md
```

## motion-tuning

`assets/md` 中部分组件仍保留 `@motion-tuning` 导入（与 src 一致）。素材库预览 **不启用** `?debug=1`，会走 `animHooks` 的 static fallback。
