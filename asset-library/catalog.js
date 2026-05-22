/**
 * 通用素材库目录 — Agent 查询用 id / nameEn；人类阅读用 nameZh
 * previewKey 对应 previews/registry.jsx 中的预览组件
 *
 * source：指向 asset-library/assets/ 下的**独立副本**（非 src/ 引用）。
 * 同步方式见 asset-library/assets/README.md
 */

export const SECTIONS = [
  {
    id: "elements",
    nameEn: "elements",
    nameZh: "元素",
    description: "可单独复用的 UI 单元与数据结构可视化 primitives",
    subsections: [
      {
        id: "static-ui",
        nameEn: "static-ui",
        nameZh: "静态卡片与控件",
        description: "标题卡、题意卡、Panel、进度条等静态或轻动画容器",
      },
      {
        id: "ds-primitives",
        nameEn: "ds-primitives",
        nameZh: "数据结构单元",
        description: "数组格、指针、哈希 chip、树节点/边、badge 等",
      },
    ],
  },
  {
    id: "algorithm-animations",
    nameEn: "algorithm-animations",
    nameZh: "算法动画",
    description: "具体算法的步进演示：双指针、哈希、DFS 等",
  },
  {
    id: "layout-flows",
    nameEn: "layout-flows",
    nameZh: "布局动画流",
    description: "与算法无关的整页排版与过场：开幕、分栏、总结页等",
  },
];

/** @type {import('./catalog.types').Asset[]} */
export const ASSETS = [

  // ── 静态 UI ──

  {
    id: "elem-title-card-md",
    nameEn: "title-card-maxdepth",
    nameZh: "LeetCode 标题卡（maxDepth 风格）",
    section: "elements",
    subsection: "static-ui",
    previewKey: "title-card-md",
    source: "asset-library/assets/md/components/CoverSlide.jsx",
    cssPrefix: "md-",
    tags: ["cover", "title", "leetcode", "card"],
    whenToUse: "LeetCode 题解开幕；需要 LeetCode 编号 + 中文题名 + motion-tuning 可调字号",
  },

  {
    id: "elem-title-card-ts",
    nameEn: "title-card-twosum",
    nameZh: "LeetCode 标题卡（twoSum 风格）",
    section: "elements",
    subsection: "static-ui",
    previewKey: "title-card-ts",
    source: "asset-library/assets/ts/components/CoverSlide.jsx",
    cssPrefix: "ts-",
    tags: ["cover", "title", "leetcode", "subtitle"],
    whenToUse: "开幕页带英文副标题/算法标签；无 motion-tuning 依赖",
  },

  {
    id: "elem-difficulty-badge",
    nameEn: "difficulty-badge",
    nameZh: "难度标签",
    section: "elements",
    subsection: "static-ui",
    previewKey: "difficulty-badge",
    source: "src/*/components/CoverSlide.jsx",
    tags: ["cover", "badge", "easy", "medium"],
    whenToUse: "封面第二拍展开难度（简单/中等/困难）",
  },

  {
    id: "elem-brief-card",
    nameEn: "brief-problem-card",
    nameZh: "题意说明卡",
    section: "elements",
    subsection: "static-ui",
    previewKey: "brief-card",
    source: "asset-library/assets/ts/components/BriefSlide.jsx",
    cssPrefix: "ts-",
    tags: ["brief", "problem", "card"],
    whenToUse: "第二页题意陈述；纯文本 + 卡片容器",
  },

  {
    id: "elem-question-card",
    nameEn: "idea-question-card",
    nameZh: "问题卡（思路页）",
    section: "elements",
    subsection: "static-ui",
    previewKey: "question-card",
    source: "asset-library/assets/ts/components/IdeaSlide.jsx",
    tags: ["idea", "question"],
    whenToUse: "思路页第一卡：把题目转成「要解决什么问题」",
  },

  {
    id: "elem-idea-card",
    nameEn: "idea-insight-card",
    nameZh: "思路卡 + 要点徽章",
    section: "elements",
    subsection: "static-ui",
    previewKey: "idea-card",
    source: "asset-library/assets/ts/components/IdeaSlide.jsx",
    tags: ["idea", "insight", "badge"],
    whenToUse: "思路页第二卡：核心算法思想一句话 + 徽章",
  },

  {
    id: "elem-code-card",
    nameEn: "pseudocode-card",
    nameZh: "伪代码卡",
    section: "elements",
    subsection: "static-ui",
    previewKey: "code-card",
    source: "asset-library/assets/ts/components/IdeaSlide.jsx",
    tags: ["code", "pseudocode", "highlight"],
    whenToUse: "思路页第三卡；支持逐行高亮步进",
  },

  {
    id: "elem-summary-list-card",
    nameEn: "summary-list-card",
    nameZh: "总结列表卡",
    section: "elements",
    subsection: "static-ui",
    previewKey: "summary-list-card",
    source: "asset-library/assets/ts/components/SummarySlide.jsx",
    tags: ["summary", "list", "checklist"],
    whenToUse: "收尾页逐条 reveal 要点列表",
  },

  {
    id: "elem-approach-panel",
    nameEn: "approach-panel",
    nameZh: "做法 Panel（树/示意容器）",
    section: "elements",
    subsection: "static-ui",
    previewKey: "approach-panel",
    source: "asset-library/assets/md/components/SummarySlide.jsx",
    cssPrefix: "md-",
    tags: ["panel", "approach", "diagram-frame"],
    whenToUse: "对比两种做法（如自顶向下/自底向上）；内嵌 TreeSvg 或 SubtreeSchematic",
  },

  {
    id: "elem-progress-dock",
    nameEn: "deck-progress-dock",
    nameZh: "演示进度 Dock",
    section: "elements",
    subsection: "static-ui",
    previewKey: "progress-dock",
    source: "asset-library/assets/md/MaxDepthPresentation.jsx",
    tags: ["chrome", "navigation", "progress"],
    whenToUse: "所有 deck 底部：上一页/下一页/页码/状态文案",
  },

  {
    id: "elem-glass-card",
    nameEn: "glass-card-dfs",
    nameZh: "玻璃拟态卡片",
    section: "elements",
    subsection: "static-ui",
    previewKey: "glass-card",
    source: "asset-library/assets/dfs/dfs.css",
    cssPrefix: "dfs-",
    tags: ["glass", "card", "tailwind-adjacent"],
    whenToUse: "概念讲解 deck（dfs/AnimatedPPT）的信息容器",
  },

  {
    id: "elem-info-step-card",
    nameEn: "info-step-card",
    nameZh: "步骤信息卡",
    section: "elements",
    subsection: "static-ui",
    previewKey: "info-step-card",
    source: "asset-library/assets/dfs/components/StackSlide.jsx",
    tags: ["step", "card", "tag"],
    whenToUse: "分步讲解右侧 2×2 小卡网格",
  },

  // ── 数据结构单元 ──

  {
    id: "elem-array-cell",
    nameEn: "array-cell-states",
    nameZh: "数组单元格（多状态）",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "array-cell",
    source: "asset-library/assets/ts/two-sum.css · asset-library/assets/cd/contains-duplicate.css",
    tags: ["array", "cell", "idle", "cur", "hit", "prefix"],
    whenToUse: "数组模拟；通过 modifier class 表达当前下标/命中/前缀区间",
  },

  {
    id: "elem-array-row",
    nameEn: "array-row",
    nameZh: "数组行",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "array-row",
    source: "asset-library/assets/ts/components/SimSlide.jsx",
    tags: ["array", "row", "horizontal"],
    whenToUse: "水平排列 cell + 下标；模拟页主视图",
  },

  {
    id: "elem-pointer-j",
    nameEn: "array-pointer-j",
    nameZh: "数组指针 j",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "pointer-j",
    source: "asset-library/assets/ts/components/SimSlide.jsx",
    tags: ["pointer", "array", "two-pointer"],
    whenToUse: "twoSum 前缀哈希；标注当前 j 位置箭头+标签",
  },

  {
    id: "elem-prefix-bracket",
    nameEn: "prefix-range-bracket",
    nameZh: "前缀区间虚线框",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "prefix-bracket",
    source: "asset-library/assets/ts/components/SimSlide.jsx",
    tags: ["prefix", "bracket", "range"],
    whenToUse: "包围 nums[0..j-1]；需 layout 测量 cell DOM",
  },

  {
    id: "elem-query-box",
    nameEn: "complement-query-box",
    nameZh: "补数查询框",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "query-box",
    source: "asset-library/assets/ts/components/SimSlide.jsx",
    tags: ["query", "target", "two-sum"],
    whenToUse: "展示 target - nums[j] 查询过程与 hit/miss",
  },

  {
    id: "elem-hash-set-chip",
    nameEn: "hash-set-chip",
    nameZh: "哈希集合 Chip",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "hash-set-chip",
    source: "asset-library/assets/cd/components/SimSlide.jsx",
    tags: ["hash", "set", "chip"],
    whenToUse: "217 存在重复元素；seen 集合可视化",
  },

  {
    id: "elem-tree-node",
    nameEn: "tree-node-circle",
    nameZh: "树节点（圆 + 编号）",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "tree-node",
    source: "asset-library/assets/md/components/TreeSvg.jsx",
    cssPrefix: "md-",
    tags: ["tree", "node", "binary-tree"],
    whenToUse: "二叉树节点；summary 金色节点 / dfs 默认节点",
  },

  {
    id: "elem-tree-edge",
    nameEn: "tree-edge-line",
    nameZh: "树边（线段）",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "tree-edge",
    source: "asset-library/assets/md/components/TreeSvg.jsx",
    tags: ["tree", "edge"],
    whenToUse: "连接父子节点；可叠加 pulse 动画",
  },

  {
    id: "elem-tree-edge-pulse",
    nameEn: "tree-edge-pulse",
    nameZh: "树边 Pulse 高亮",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "tree-edge-pulse",
    source: "asset-library/assets/md/components/SummarySlide.jsx",
    tags: ["tree", "edge", "pulse", "animation"],
    whenToUse: "自顶向下做法：依次 pulse 边 1→2→3",
  },

  {
    id: "elem-tree-path-badge",
    nameEn: "tree-path-depth-badge",
    nameZh: "路径深度 Badge（树上）",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "tree-path-badge",
    source: "asset-library/assets/md/components/TreeSvg.jsx",
    tags: ["tree", "badge", "depth", "path"],
    whenToUse: "叶节点 flash 后显示路径最大深度",
  },

  {
    id: "elem-tree-depth-badge",
    nameEn: "tree-node-depth-badge",
    nameZh: "节点深度小标",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "tree-depth-badge",
    source: "asset-library/assets/md/components/TreeSvg.jsx",
    tags: ["tree", "badge", "dfs"],
    whenToUse: "DFS 进入节点时在节点旁显示当前 depth",
  },

  {
    id: "elem-depth-card",
    nameEn: "dfs-depth-float-card",
    nameZh: "DFS 深度浮动卡",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "depth-card",
    source: "asset-library/assets/md/components/DfsSlide.jsx",
    tags: ["dfs", "card", "max-depth"],
    whenToUse: "DFS 演示页右侧浮动：当前记录的最大深度",
  },

  {
    id: "elem-anno-arrow",
    nameEn: "schematic-annotation-arrow",
    nameZh: "示意箭头（蓝/金）",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "anno-arrow",
    source: "asset-library/assets/md/components/SubtreeSchematic.jsx",
    tags: ["arrow", "annotation", "schematic"],
    whenToUse: "自底向上做法：指向左/右子树的 SVG 箭头",
  },

  {
    id: "elem-subtree-triangle",
    nameEn: "subtree-triangle-schematic",
    nameZh: "子树三角形示意",
    section: "elements",
    subsection: "ds-primitives",
    previewKey: "subtree-triangle",
    source: "asset-library/assets/md/components/SubtreeSchematic.jsx",
    tags: ["subtree", "schematic", "triangle"],
    whenToUse: "用简化三角形代替整棵子树（自底向上讲解）",
  },

  // ── 算法动画 ──

  {
    id: "algo-prefix-hash-walk",
    nameEn: "prefix-hash-simulation",
    nameZh: "前缀哈希扫描（双指针）",
    section: "algorithm-animations",
    previewKey: "algo-prefix-hash",
    source: "asset-library/assets/ts/components/SimSlide.jsx · prefixHashSteps.js",
    tags: ["array", "hash", "two-pointer", "simulation"],
    whenToUse: "一次遍历 + 哈希查补数",
  },

  {
    id: "algo-hash-set-walk",
    nameEn: "hash-set-simulation",
    nameZh: "哈希集合判重",
    section: "algorithm-animations",
    previewKey: "algo-hash-set",
    source: "asset-library/assets/cd/components/SimSlide.jsx · hashSteps.js",
    tags: ["hash", "set", "duplicate", "simulation"],
    whenToUse: "遍历数组并维护 seen 集合",
  },

  {
    id: "algo-dfs-tree-walk",
    nameEn: "binary-tree-dfs-playback",
    nameZh: "二叉树 DFS 遍历",
    section: "algorithm-animations",
    previewKey: "algo-dfs-tree",
    source: "asset-library/assets/md/useDfsPlayback.js · buildDfsSteps.js",
    tags: ["tree", "dfs", "playback", "enter", "leave"],
    whenToUse: "前序 DFS：进节点、走边、到叶、回溯",
  },

  {
    id: "algo-leaf-flash-path",
    nameEn: "leaf-path-flash-loop",
    nameZh: "DFS 叶路径高亮",
    section: "algorithm-animations",
    previewKey: "algo-leaf-flash",
    source: "asset-library/assets/md/useDfsPlayback.js",
    tags: ["dfs", "leaf", "path", "flash"],
    whenToUse: "到达叶节点时高亮根到叶路径",
  },

  // ── 布局动画流 ──

  {
    id: "layout-cover-leetcode",
    nameEn: "layout-flow-cover-leetcode",
    nameZh: "开幕页",
    section: "layout-flows",
    previewKey: "layout-cover",
    source: "asset-library/assets/md/components/CoverSlide.jsx",
    tags: ["layout", "cover", "opening"],
    whenToUse: "LeetCode 题解第一页：标题 + 难度展开",
  },

  {
    id: "layout-brief-problem",
    nameEn: "layout-flow-brief-problem",
    nameZh: "题意页",
    section: "layout-flows",
    previewKey: "layout-brief",
    source: "asset-library/assets/ts/components/BriefSlide.jsx",
    tags: ["layout", "brief", "problem"],
    whenToUse: "题目描述 + 样例展开",
  },

  {
    id: "layout-idea-three-cards",
    nameEn: "layout-flow-idea-cards",
    nameZh: "思路三卡页",
    section: "layout-flows",
    previewKey: "layout-idea",
    source: "asset-library/assets/ts/components/IdeaSlide.jsx",
    tags: ["layout", "idea", "cards"],
    whenToUse: "问题 → 思路 → 代码三卡切换",
  },

  {
    id: "layout-sim-array",
    nameEn: "layout-flow-array-simulation",
    nameZh: "模拟页（数组区）",
    section: "layout-flows",
    previewKey: "layout-sim-array",
    source: "asset-library/assets/ts/components/SimSlide.jsx",
    tags: ["layout", "sim", "array"],
    whenToUse: "数组主舞台 + 辅助区 + 底部提示",
  },

  {
    id: "layout-summary-list",
    nameEn: "layout-flow-summary-list",
    nameZh: "总结列表页",
    section: "layout-flows",
    previewKey: "layout-summary-list",
    source: "asset-library/assets/ts/components/SummarySlide.jsx",
    tags: ["layout", "summary", "list"],
    whenToUse: "单卡 checklist 逐条出现",
  },

  {
    id: "layout-summary-dual-panel",
    nameEn: "layout-flow-dual-approach-panel",
    nameZh: "双栏对比页",
    section: "layout-flows",
    previewKey: "layout-dual-panel",
    source: "asset-library/assets/md/components/SummarySlide.jsx",
    tags: ["layout", "summary", "dual", "tree"],
    whenToUse: "左右 Panel 并排对比两种做法",
  },

  {
    id: "layout-dfs-tree-stage",
    nameEn: "layout-flow-dfs-tree-stage",
    nameZh: "全屏树舞台",
    section: "layout-flows",
    previewKey: "layout-dfs-tree",
    source: "asset-library/assets/md/components/DfsSlide.jsx",
    tags: ["layout", "dfs", "tree", "fullscreen"],
    whenToUse: "大树居中 + 浮动信息卡",
  },

  {
    id: "layout-dfs-hero-split",
    nameEn: "layout-flow-hero-split",
    nameZh: "Hero 左文右图",
    section: "layout-flows",
    previewKey: "layout-hero-split",
    source: "asset-library/assets/dfs/components/HeroSlide.jsx",
    tags: ["layout", "hero", "split"],
    whenToUse: "左侧文案 + 右侧插图",
  },

  {
    id: "layout-dfs-concept-center",
    nameEn: "layout-flow-concept-center",
    nameZh: "概念居中页",
    section: "layout-flows",
    previewKey: "layout-concept-center",
    source: "asset-library/assets/dfs/components/ConceptSlide.jsx",
    tags: ["layout", "concept", "center"],
    whenToUse: "居中大卡讲单一概念",
  },

  {
    id: "layout-dfs-stack-split",
    nameEn: "layout-flow-stack-cards-split",
    nameZh: "栈 + 步骤卡分栏",
    section: "layout-flows",
    previewKey: "layout-stack-split",
    source: "asset-library/assets/dfs/components/StackSlide.jsx",
    tags: ["layout", "stack", "split"],
    whenToUse: "调用栈动画 + 右侧步骤说明",
  },

  {
    id: "layout-glass-summary-table",
    nameEn: "layout-flow-glass-summary-table",
    nameZh: "玻璃风总结表",
    section: "layout-flows",
    previewKey: "layout-glass-table",
    source: "asset-library/assets/dfs/components/SummarySlide.jsx",
    tags: ["layout", "glass", "table", "metrics"],
    whenToUse: "指标卡 + 对比表格收尾",
  },


];

export const ASSET_BY_ID = Object.fromEntries(ASSETS.map((a) => [a.id, a]));

export function getSectionAssets(sectionId) {
  return ASSETS.filter((a) => a.section === sectionId);
}

export function getSubsectionAssets(sectionId, subsectionId) {
  return ASSETS.filter((a) => a.section === sectionId && a.subsection === subsectionId);
}

export function searchAssets(query) {
  const q = query.trim().toLowerCase();
  if (!q) return ASSETS;
  return ASSETS.filter(
    (a) =>
      a.id.includes(q) ||
      a.nameEn.includes(q) ||
      a.nameZh.includes(q) ||
      a.tags.some((t) => t.includes(q)) ||
      a.whenToUse.includes(q),
  );
}
