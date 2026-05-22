# 通用素材库（Asset Library）

> **人类浏览**：开发时运行 `npm run assets`，打开 [`asset-library/index.html`](../asset-library/index.html)  
> **Agent 检索**：读 [`asset-library/catalog.js`](../asset-library/catalog.js) 或用本文表格中的 `id` / `nameEn`  
> **对接 motion-tuning**：新 PPT 从素材库组装后，仍须遵循 [`agent-motion-tuning-design.md`](./agent-motion-tuning-design.md)

---

## 1. 素材库是什么

把 `src/` 下已有 deck 里的 **UI 元素、算法动画模式、整页布局流** 提取为可检索条目，并在 **`asset-library/assets/` 存一份独立副本**（不直接引用 `src/`）。

| 字段 | 用途 |
|------|------|
| `id` | 唯一 ID，如 `elem-array-cell` |
| `nameEn` | Agent 查询用英文名，如 `array-cell-states` |
| `nameZh` | 人类可读中文名 |
| `source` | **副本路径**（`asset-library/assets/...`） |
| `whenToUse` | 何时选用 |
| `tags` | 检索标签 |
| `previewKey` | 预览组件键 |

**目录数据唯一源**：`asset-library/catalog.js`（共 **50** 项）。

**代码副本**：`asset-library/assets/{md,ts,cd,dfs}/` + `assets/styles/*.css`。  
`src/` 仍是课件主开发目录；更新 `src/` 后运行同步（见 `asset-library/assets/README.md`）刷新副本。

---

## 2. 如何打开

```bash
cd motion-demo
npm run assets          # 打开素材库首页
# 或
npm run dev             # 手动访问 http://localhost:5173/asset-library/index.html
```

页面分 **三大分区**：

1. **元素** — 静态 UI + 数据结构 primitives  
2. **算法动画** — 可步进/重播的演示模式  
3. **布局动画流** — 整页编排模板  

点击卡片进入 **预览页**（可交互步进）。

---

## 3. 三大分区与选用指南

### 3.1 元素 · 静态卡片与控件

| id | nameEn | 中文名 | 何时用 |
|----|--------|--------|--------|
| `elem-title-card-md` | title-card-maxdepth | LeetCode 标题卡（md） | 需要 motion-tuning 调字号/布局的 LeetCode 开幕 |
| `elem-title-card-ts` | title-card-twosum | LeetCode 标题卡（ts） | 带副标题、无 tuning 依赖的开幕 |
| `elem-difficulty-badge` | difficulty-badge | 难度标签 | 封面第二拍展开难度 |
| `elem-brief-card` | brief-problem-card | 题意说明卡 | 题意页主卡片 |
| `elem-question-card` | idea-question-card | 问题卡 | 思路页第 1 卡 |
| `elem-idea-card` | idea-insight-card | 思路卡 | 思路页第 2 卡 |
| `elem-code-card` | pseudocode-card | 伪代码卡 | 思路页代码/逐行高亮 |
| `elem-summary-list-card` | summary-list-card | 总结列表卡 | 收尾 checklist |
| `elem-approach-panel` | approach-panel | 做法 Panel | 嵌入树/示意图的对比 panel |
| `elem-progress-dock` | deck-progress-dock | 演示进度 Dock | 所有 deck 底部导航 |
| `elem-glass-card` | glass-card-dfs | 玻璃拟态卡片 | 概念型 deck 信息块 |
| `elem-info-step-card` | info-step-card | 步骤信息卡 | 分步讲解右侧小卡 |

### 3.2 元素 · 数据结构单元

| id | nameEn | 中文名 | 何时用 |
|----|--------|--------|--------|
| `elem-array-cell` | array-cell-states | 数组单元格 | 需要 idle/cur/hit/prefix 等着色 |
| `elem-array-row` | array-row | 数组行 | 水平排列 cell + 下标 |
| `elem-pointer-j` | array-pointer-j | 数组指针 j | 单指针扫描（twoSum） |
| `elem-prefix-bracket` | prefix-range-bracket | 前缀虚线框 | 标前缀区间 |
| `elem-query-box` | complement-query-box | 补数查询框 | 展示 target−nums[j] |
| `elem-hash-set-chip` | hash-set-chip | 哈希集合 Chip | 217 / seen 集合 |
| `elem-tree-node` | tree-node-circle | 树节点 | 二叉树节点圆+编号 |
| `elem-tree-edge` | tree-edge-line | 树边 | 父子连线 |
| `elem-tree-edge-pulse` | tree-edge-pulse | 树边 Pulse | 沿路径依次亮边 |
| `elem-tree-path-badge` | tree-path-depth-badge | 路径深度 Badge | 叶节点 flash 后的结论 |
| `elem-tree-depth-badge` | tree-node-depth-badge | 节点深度小标 | DFS 当前 depth |
| `elem-depth-card` | dfs-depth-float-card | DFS 深度浮动卡 | 右侧 maxDepth 计数 |
| `elem-anno-arrow` | schematic-annotation-arrow | 示意箭头 | 自底向上子树指向 |
| `elem-subtree-triangle` | subtree-triangle-schematic | 子树三角形 | 简化子树占位 |

### 3.3 算法动画

| id | nameEn | 中文名 | 何时用 |
|----|--------|--------|--------|
| `algo-cover-reveal` | cover-title-difficulty-reveal | 开幕：标题+难度 | 任意 LeetCode PPT 第 1 页 |
| `algo-brief-sample-reveal` | brief-sample-expand | 题意+样例展开 | 第 2 页样例动画 |
| `algo-idea-three-step` | idea-three-card-step | 思路三卡步进 | 问题→思路→代码 |
| `algo-code-line-highlight` | code-line-highlight | 伪代码逐行高亮 | 代码讲解后期 |
| `algo-prefix-hash-walk` | prefix-hash-simulation | 前缀哈希模拟 | **LeetCode 1** 核心模拟 |
| `algo-hash-set-walk` | hash-set-simulation | 哈希集合模拟 | **LeetCode 217** 核心模拟 |
| `algo-dfs-tree-walk` | binary-tree-dfs-playback | 二叉树 DFS 步进 | **LeetCode 104** DFS 演示 |
| `algo-summary-edge-pulse` | summary-edge-pulse-sequence | Summary 边 Pulse | 自顶向下做法讲解 |
| `algo-panel-flash` | panel-flash-emphasis | Panel 闪烁 | 切换讲解焦点 |
| `algo-leaf-flash-path` | leaf-path-flash-loop | 叶路径闪烁 | DFS 到叶节点 |
| `algo-badge-pop` | tree-badge-pop-in | Badge 弹入 | 结论 badge 出现 |
| `algo-hero-graph-visit` | hero-graph-auto-visit | Hero 图自动遍历 | 概念 deck 封面 |

### 3.4 布局动画流

| id | nameEn | 中文名 | 何时用 |
|----|--------|--------|--------|
| `layout-cover-leetcode` | layout-flow-cover-leetcode | LeetCode 开幕布局 | 新题 PPT 第 1 页骨架 |
| `layout-brief-problem` | layout-flow-brief-problem | 题意+样例布局 | 第 2 页 |
| `layout-idea-three-cards` | layout-flow-idea-cards | 思路三卡布局 | 第 3 页 |
| `layout-sim-array` | layout-flow-array-simulation | 数组模拟页布局 | 核心算法模拟主舞台 |
| `layout-summary-list` | layout-flow-summary-list | 总结列表页 | 收尾 checklist 页 |
| `layout-summary-dual-panel` | layout-flow-dual-approach-panel | 双 Panel 对比 | 两种做法并排（104） |
| `layout-dfs-tree-stage` | layout-flow-dfs-tree-stage | 全屏树 DFS | 大树 + 深度卡 |
| `layout-dfs-hero-split` | layout-flow-hero-split | Hero 左文右图 | 概念型开幕 |
| `layout-dfs-concept-center` | layout-flow-concept-center | 概念居中大卡 | 单页讲清概念 |
| `layout-dfs-stack-split` | layout-flow-stack-cards-split | 栈+步骤卡分栏 | 递归/调用栈 |
| `layout-glass-summary-table` | layout-flow-glass-summary-table | 玻璃风总结表 | 概念 deck 收尾 |

---

## 4. 新 PPT 组装建议（决策树）

```
要做 LeetCode 题解 PPT？
├─ 第 1 页 → layout-cover-leetcode + algo-cover-reveal
├─ 第 2 页题意 → layout-brief-problem + elem-brief-card
├─ 第 3 页思路 → layout-idea-three-cards + algo-idea-three-step
├─ 核心模拟？
│   ├─ 数组 + 哈希/前缀 → layout-sim-array + elem-array-* + algo-prefix-hash 或 algo-hash-set
│   ├─ 二叉树 DFS → layout-dfs-tree-stage + elem-tree-* + algo-dfs-tree-walk
│   └─ 双做法对比 → layout-summary-dual-panel + elem-approach-panel
└─ 收尾 → layout-summary-list + elem-summary-list-card
```

**概念讲解型**（非单题）：优先 `dfs/` deck 的 glass 布局 + `layout-dfs-*` 系列。

---

## 5. 源码 deck 对照

| 课件 src 目录 | 素材库副本 | 题号/主题 |
|---------------|------------|-----------|
| `src/maxDepth/` | `asset-library/assets/md/` | LC 104 最大深度 |
| `src/twoSum/` | `asset-library/assets/ts/` | LC 1 两数之和 |
| `src/containsDuplicate/` | `asset-library/assets/cd/` | LC 217 重复元素 |
| `src/dfs/` | `asset-library/assets/dfs/` | DFS 概念 |

样式副本：`asset-library/assets/styles/{md,ts,cd,dfs,base}.css`

`src/AnimatedPPTPage.jsx`、`src/components/DfsTree.jsx` 尚未复制入库。

---

## 6. Agent 工作流

1. **选素材**：在 `catalog.js` 按 `tags` / `whenToUse` / `nameEn` 搜索  
2. **看预览**：`npm run assets`  
3. **复制到新 PPT**：从 `asset-library/assets/` **复制文件**到新 deck 目录（不要只写 import src/）  
4. **注册 tuning**（可选）：新题需 `?debug=1` 时，在**新 deck 的 src** 按 `agent-motion-tuning-design.md` 补四链  
5. **更新库**：改 `src/` 后同步副本 + 更新 catalog

---

## 7. 文件结构

```
asset-library/
├── index.html
├── main.jsx                 # 只 import assets/styles + assets/*
├── catalog.js               # source → assets 副本路径
├── assets/                  # ★ 独立副本（见 assets/README.md）
│   ├── styles/
│   ├── md/  ts/  cd/  dfs/
├── previews/                # 仅 import ../assets/...
└── asset-library.css
```

## 8. 维护说明

- 增删素材：改 `catalog.js` + `assets/` 副本 + `previews/` + 本文  
- 从 `src/` 同步：见 `asset-library/assets/README.md`  
- 新 PPT：从 `assets/` **复制文件**，不要只 import `src/`  
- 构建：`npm run build` → `dist/asset-library/index.html`

---

*素材副本提取自 `src/`。AnimatedPPTPage、DfsTree 等待后续入库。*
