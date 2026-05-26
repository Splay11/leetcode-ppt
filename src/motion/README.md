# Motion 知识点课件

Hot 100 算法讲解 PPT 的统一开发目录。每道题一个子文件夹，完整样例见仓库根级 `src/maxDepth/`（LC 104）。

## 目录约定

```
src/motion/
├── README.md           # 本说明
├── registry.js         # 题目注册与 App 入口解析
├── invertBinaryTree/   # LC 226 · 开发中（默认入口）
├── symmetricTree/      # LC 101 · 占位
└── validateBst/        # LC 98 · 占位
```

| 状态 | 含义 |
|------|------|
| `done` | 可演示，结构完整 |
| `wip` | 开发中，可 `npm run dev` 预览 |
| `planned` | 仅 constants / README，待开工 |

## 新建一道题

1. 复制 `invertBinaryTree/` 或对照 `src/maxDepth/` 骨架。
2. 在 `registry.js` 的 `MOTION_TOPICS` 增加一项（`id`、`leetcode`、`component`、`path`）。
3. 必备文件：`animConfig.js`、`animHooks.js`、`tuningBridge.js`、`animTuningRegistry.js`、`animTimeline.js`、`layoutBase.js`、`deckTheme.js`、`*Presentation.jsx`、`*-.css`、`components/`。
4. CSS 类名与 `--ibt-*` 变量前缀勿与别的题混用（本题用 `ibt`，maxDepth 用 `md`）。
5. 调试动画：`npm run tuning-server`，浏览器 `?debug=1`。

## 本地预览切换题目

```powershell
# 默认：invertBinaryTree（本分支开发题）
npm run dev

# 浏览器切换题目
# http://localhost:5173/?topic=maxDepth
# http://localhost:5173/?topic=invertBinaryTree

# 或启动前指定环境变量（PowerShell）
$env:VITE_TOPIC="maxDepth"; npm run dev
```

## 与 `motion-tuning` 的关系

- 库：`src/motion-tuning/`（`@motion-tuning`）
- 课件：`src/motion/<topic>/` 内的 `animConfig` + `animTuningRegistry` + `tuningBridge`
- 设计规范：`docs/agent-motion-tuning-design.md`

## GitHub Pages 公网部署（自建仓库）

Pages 的 `base` 路径**自动跟随仓库名**，无需改代码。  
若新仓库为 [`Splay11/leetcode-ppt`](https://github.com/Splay11/leetcode-ppt)，公网地址为：

```
https://splay11.github.io/leetcode-ppt/
```

构建默认 `VITE_TOPIC=maxDepth`，打开即 maxDepth 正式演示。

### 1. 在 GitHub 新建空仓库

例如：`leetcode-ppt`（不要勾选 README，避免和本地冲突）

### 2. 本地改 remote 并推送

在**本项目根目录**执行（把用户名和仓库名换成你的）：

```powershell
cd d:\hot-100-ppt

# 查看当前 remote（可能还指向 codefun2000/hot-100-ppt）
git remote -v

# 方案 A：完全换到新仓库（推荐）
git remote rename origin old-origin
git remote add origin https://github.com/Splay11/leetcode-ppt.git

# 方案 B：保留旧仓库，额外加一个 remote
# git remote add pages https://github.com/<你的用户名>/<新仓库名>.git

# 推送 main（没有 main 就先建）
git checkout -B main
git push -u origin main
```

### 3. 开启 GitHub Pages（只做一次）

1. 新仓库 **Settings → Pages**
2. **Source** 选 **GitHub Actions**
3. 等 Actions 里 **Deploy GitHub Pages** 跑绿

### 4. 本地验证 Pages 构建

把 `<新仓库名>` 换成实际仓库名：

```powershell
$env:GITHUB_PAGES="true"
$env:VITE_TOPIC="maxDepth"
$env:VITE_BASE="/<新仓库名>/"
npm run build
npm run preview
# 打开 http://localhost:4173/<新仓库名>/
```
