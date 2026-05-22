# -*- coding: utf-8 -*-
"""Generate asset-library/catalog.js with valid UTF-8."""
from pathlib import Path

HEADER = '''/**
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
'''

FOOTER = '''
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
'''

ASSETS = [
  ("elem-title-card-md", "title-card-maxdepth", "LeetCode 标题卡（maxDepth 风格）", "elements", "static-ui", "title-card-md", "asset-library/assets/md/components/CoverSlide.jsx", "md-", ["cover", "title", "leetcode", "card"], "LeetCode 题解开幕；需要 LeetCode 编号 + 中文题名 + motion-tuning 可调字号"),
  ("elem-title-card-ts", "title-card-twosum", "LeetCode 标题卡（twoSum 风格）", "elements", "static-ui", "title-card-ts", "asset-library/assets/ts/components/CoverSlide.jsx", "ts-", ["cover", "title", "leetcode", "subtitle"], "开幕页带英文副标题/算法标签；无 motion-tuning 依赖"),
  ("elem-difficulty-badge", "difficulty-badge", "难度标签", "elements", "static-ui", "difficulty-badge", "src/*/components/CoverSlide.jsx", None, ["cover", "badge", "easy", "medium"], "封面第二拍展开难度（简单/中等/困难）"),
  ("elem-brief-card", "brief-problem-card", "题意说明卡", "elements", "static-ui", "brief-card", "asset-library/assets/ts/components/BriefSlide.jsx", "ts-", ["brief", "problem", "card"], "第二页题意陈述；纯文本 + 卡片容器"),
  ("elem-question-card", "idea-question-card", "问题卡（思路页）", "elements", "static-ui", "question-card", "asset-library/assets/ts/components/IdeaSlide.jsx", None, ["idea", "question"], "思路页第一卡：把题目转成「要解决什么问题」"),
  ("elem-idea-card", "idea-insight-card", "思路卡 + 要点徽章", "elements", "static-ui", "idea-card", "asset-library/assets/ts/components/IdeaSlide.jsx", None, ["idea", "insight", "badge"], "思路页第二卡：核心算法思想一句话 + 徽章"),
  ("elem-code-card", "pseudocode-card", "伪代码卡", "elements", "static-ui", "code-card", "asset-library/assets/ts/components/IdeaSlide.jsx", None, ["code", "pseudocode", "highlight"], "思路页第三卡；支持逐行高亮步进"),
  ("elem-summary-list-card", "summary-list-card", "总结列表卡", "elements", "static-ui", "summary-list-card", "asset-library/assets/ts/components/SummarySlide.jsx", None, ["summary", "list", "checklist"], "收尾页逐条 reveal 要点列表"),
  ("elem-approach-panel", "approach-panel", "做法 Panel（树/示意容器）", "elements", "static-ui", "approach-panel", "asset-library/assets/md/components/SummarySlide.jsx", "md-", ["panel", "approach", "diagram-frame"], "对比两种做法（如自顶向下/自底向上）；内嵌 TreeSvg 或 SubtreeSchematic"),
  ("elem-progress-dock", "deck-progress-dock", "演示进度 Dock", "elements", "static-ui", "progress-dock", "asset-library/assets/md/MaxDepthPresentation.jsx", None, ["chrome", "navigation", "progress"], "所有 deck 底部：上一页/下一页/页码/状态文案"),
  ("elem-glass-card", "glass-card-dfs", "玻璃拟态卡片", "elements", "static-ui", "glass-card", "asset-library/assets/dfs/dfs.css", "dfs-", ["glass", "card", "tailwind-adjacent"], "概念讲解 deck（dfs/AnimatedPPT）的信息容器"),
  ("elem-info-step-card", "info-step-card", "步骤信息卡", "elements", "static-ui", "info-step-card", "asset-library/assets/dfs/components/StackSlide.jsx", None, ["step", "card", "tag"], "分步讲解右侧 2×2 小卡网格"),
  ("elem-array-cell", "array-cell-states", "数组单元格（多状态）", "elements", "ds-primitives", "array-cell", "asset-library/assets/ts/two-sum.css · asset-library/assets/cd/contains-duplicate.css", None, ["array", "cell", "idle", "cur", "hit", "prefix"], "数组模拟；通过 modifier class 表达当前下标/命中/前缀区间"),
  ("elem-array-row", "array-row", "数组行", "elements", "ds-primitives", "array-row", "asset-library/assets/ts/components/SimSlide.jsx", None, ["array", "row", "horizontal"], "水平排列 cell + 下标；模拟页主视图"),
  ("elem-pointer-j", "array-pointer-j", "数组指针 j", "elements", "ds-primitives", "pointer-j", "asset-library/assets/ts/components/SimSlide.jsx", None, ["pointer", "array", "two-pointer"], "twoSum 前缀哈希；标注当前 j 位置箭头+标签"),
  ("elem-prefix-bracket", "prefix-range-bracket", "前缀区间虚线框", "elements", "ds-primitives", "prefix-bracket", "asset-library/assets/ts/components/SimSlide.jsx", None, ["prefix", "bracket", "range"], "包围 nums[0..j-1]；需 layout 测量 cell DOM"),
  ("elem-query-box", "complement-query-box", "补数查询框", "elements", "ds-primitives", "query-box", "asset-library/assets/ts/components/SimSlide.jsx", None, ["query", "target", "two-sum"], "展示 target - nums[j] 查询过程与 hit/miss"),
  ("elem-hash-set-chip", "hash-set-chip", "哈希集合 Chip", "elements", "ds-primitives", "hash-set-chip", "asset-library/assets/cd/components/SimSlide.jsx", None, ["hash", "set", "chip"], "217 存在重复元素；seen 集合可视化"),
  ("elem-tree-node", "tree-node-circle", "树节点（圆 + 编号）", "elements", "ds-primitives", "tree-node", "asset-library/assets/md/components/TreeSvg.jsx", "md-", ["tree", "node", "binary-tree"], "二叉树节点；summary 金色节点 / dfs 默认节点"),
  ("elem-tree-edge", "tree-edge-line", "树边（线段）", "elements", "ds-primitives", "tree-edge", "asset-library/assets/md/components/TreeSvg.jsx", None, ["tree", "edge"], "连接父子节点；可叠加 pulse 动画"),
  ("elem-tree-edge-pulse", "tree-edge-pulse", "树边 Pulse 高亮", "elements", "ds-primitives", "tree-edge-pulse", "asset-library/assets/md/components/SummarySlide.jsx", None, ["tree", "edge", "pulse", "animation"], "自顶向下做法：依次 pulse 边 1→2→3"),
  ("elem-tree-path-badge", "tree-path-depth-badge", "路径深度 Badge（树上）", "elements", "ds-primitives", "tree-path-badge", "asset-library/assets/md/components/TreeSvg.jsx", None, ["tree", "badge", "depth", "path"], "叶节点 flash 后显示路径最大深度"),
  ("elem-tree-depth-badge", "tree-node-depth-badge", "节点深度小标", "elements", "ds-primitives", "tree-depth-badge", "asset-library/assets/md/components/TreeSvg.jsx", None, ["tree", "badge", "dfs"], "DFS 进入节点时在节点旁显示当前 depth"),
  ("elem-depth-card", "dfs-depth-float-card", "DFS 深度浮动卡", "elements", "ds-primitives", "depth-card", "asset-library/assets/md/components/DfsSlide.jsx", None, ["dfs", "card", "max-depth"], "DFS 演示页右侧浮动：当前记录的最大深度"),
  ("elem-anno-arrow", "schematic-annotation-arrow", "示意箭头（蓝/金）", "elements", "ds-primitives", "anno-arrow", "asset-library/assets/md/components/SubtreeSchematic.jsx", None, ["arrow", "annotation", "schematic"], "自底向上做法：指向左/右子树的 SVG 箭头"),
  ("elem-subtree-triangle", "subtree-triangle-schematic", "子树三角形示意", "elements", "ds-primitives", "subtree-triangle", "asset-library/assets/md/components/SubtreeSchematic.jsx", None, ["subtree", "schematic", "triangle"], "用简化三角形代替整棵子树（自底向上讲解）"),
  ("algo-prefix-hash-walk", "prefix-hash-simulation", "前缀哈希扫描（双指针）", "algorithm-animations", None, "algo-prefix-hash", "asset-library/assets/ts/components/SimSlide.jsx · prefixHashSteps.js", None, ["array", "hash", "two-pointer", "simulation"], "一次遍历 + 哈希查补数"),
  ("algo-hash-set-walk", "hash-set-simulation", "哈希集合判重", "algorithm-animations", None, "algo-hash-set", "asset-library/assets/cd/components/SimSlide.jsx · hashSteps.js", None, ["hash", "set", "duplicate", "simulation"], "遍历数组并维护 seen 集合"),
  ("algo-dfs-tree-walk", "binary-tree-dfs-playback", "二叉树 DFS 遍历", "algorithm-animations", None, "algo-dfs-tree", "asset-library/assets/md/useDfsPlayback.js · buildDfsSteps.js", None, ["tree", "dfs", "playback", "enter", "leave"], "前序 DFS：进节点、走边、到叶、回溯"),
  ("algo-leaf-flash-path", "leaf-path-flash-loop", "DFS 叶路径高亮", "algorithm-animations", None, "algo-leaf-flash", "asset-library/assets/md/useDfsPlayback.js", None, ["dfs", "leaf", "path", "flash"], "到达叶节点时高亮根到叶路径"),
  ("layout-cover-leetcode", "layout-flow-cover-leetcode", "开幕页", "layout-flows", None, "layout-cover", "asset-library/assets/md/components/CoverSlide.jsx", None, ["layout", "cover", "opening"], "LeetCode 题解第一页：标题 + 难度展开"),
  ("layout-brief-problem", "layout-flow-brief-problem", "题意页", "layout-flows", None, "layout-brief", "asset-library/assets/ts/components/BriefSlide.jsx", None, ["layout", "brief", "problem"], "题目描述 + 样例展开"),
  ("layout-idea-three-cards", "layout-flow-idea-cards", "思路三卡页", "layout-flows", None, "layout-idea", "asset-library/assets/ts/components/IdeaSlide.jsx", None, ["layout", "idea", "cards"], "问题 → 思路 → 代码三卡切换"),
  ("layout-sim-array", "layout-flow-array-simulation", "模拟页（数组区）", "layout-flows", None, "layout-sim-array", "asset-library/assets/ts/components/SimSlide.jsx", None, ["layout", "sim", "array"], "数组主舞台 + 辅助区 + 底部提示"),
  ("layout-summary-list", "layout-flow-summary-list", "总结列表页", "layout-flows", None, "layout-summary-list", "asset-library/assets/ts/components/SummarySlide.jsx", None, ["layout", "summary", "list"], "单卡 checklist 逐条出现"),
  ("layout-summary-dual-panel", "layout-flow-dual-approach-panel", "双栏对比页", "layout-flows", None, "layout-dual-panel", "asset-library/assets/md/components/SummarySlide.jsx", None, ["layout", "summary", "dual", "tree"], "左右 Panel 并排对比两种做法"),
  ("layout-dfs-tree-stage", "layout-flow-dfs-tree-stage", "全屏树舞台", "layout-flows", None, "layout-dfs-tree", "asset-library/assets/md/components/DfsSlide.jsx", None, ["layout", "dfs", "tree", "fullscreen"], "大树居中 + 浮动信息卡"),
  ("layout-dfs-hero-split", "layout-flow-hero-split", "Hero 左文右图", "layout-flows", None, "layout-hero-split", "asset-library/assets/dfs/components/HeroSlide.jsx", None, ["layout", "hero", "split"], "左侧文案 + 右侧插图"),
  ("layout-dfs-concept-center", "layout-flow-concept-center", "概念居中页", "layout-flows", None, "layout-concept-center", "asset-library/assets/dfs/components/ConceptSlide.jsx", None, ["layout", "concept", "center"], "居中大卡讲单一概念"),
  ("layout-dfs-stack-split", "layout-flow-stack-cards-split", "栈 + 步骤卡分栏", "layout-flows", None, "layout-stack-split", "asset-library/assets/dfs/components/StackSlide.jsx", None, ["layout", "stack", "split"], "调用栈动画 + 右侧步骤说明"),
  ("layout-glass-summary-table", "layout-flow-glass-summary-table", "玻璃风总结表", "layout-flows", None, "layout-glass-table", "asset-library/assets/dfs/components/SummarySlide.jsx", None, ["layout", "glass", "table", "metrics"], "指标卡 + 对比表格收尾"),
]


def js_str(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def render_asset(a):
    id_, name_en, name_zh, section, subsection, preview_key, source, css_prefix, tags, when = a
    lines = [
        "  {",
        f'    id: "{id_}",',
        f'    nameEn: "{name_en}",',
        f'    nameZh: "{js_str(name_zh)}",',
        f'    section: "{section}",',
    ]
    if subsection:
        lines.append(f'    subsection: "{subsection}",')
    lines.append(f'    previewKey: "{preview_key}",')
    lines.append(f'    source: "{js_str(source)}",')
    if css_prefix:
        lines.append(f'    cssPrefix: "{css_prefix}",')
    tag_list = ", ".join(f'"{t}"' for t in tags)
    lines.append(f"    tags: [{tag_list}],")
    lines.append(f'    whenToUse: "{js_str(when)}",')
    lines.append("  },")
    return "\n".join(lines)


def main():
    root = Path(__file__).resolve().parents[1]
    out = root / "asset-library" / "catalog.js"
    parts = [HEADER]
    parts.append("  // ── 静态 UI ──\n")
    for i, asset in enumerate(ASSETS):
        if asset[0] == "elem-array-cell":
            parts.append("  // ── 数据结构单元 ──\n")
        if asset[0] == "algo-prefix-hash-walk":
            parts.append("  // ── 算法动画 ──\n")
        if asset[0] == "layout-cover-leetcode":
            parts.append("  // ── 布局动画流 ──\n")
        parts.append(render_asset(asset))
        parts.append("")
    parts.append(FOOTER)
    out.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {out} ({len(ASSETS)} assets)")


if __name__ == "__main__":
    main()
