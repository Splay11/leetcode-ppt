/**
 * 最大深度演示 — 动画参数唯一数据源（Motion 块 + DECK_CSS_VARS + 布局数组）
 * 调试面板保存时 patch 本文件
 */

export const DECK_TRANSITION = {
  duration: 0.55,
  initialY: 24,
  exitY: -16,
  scale: 0.985,
};

export const COVER_MOTION = {
  difficultySlotDuration: 0.45,
  difficultySlotPadding: 10,
  difficultySlotMaxHeight: 96,
  difficultyDuration: 0.55,
  difficultyInitialY: 18,
  difficultyInitialScale: 0.8,
  difficultyHiddenY: 14,
  difficultyHiddenScale: 0.88,
  titleDuration: 0.55,
  titleInitialY: 18,
  titleShrinkScale: 0.92,
  titleShrinkY: -8,
  titleShrinkDuration: 0.4,
};

export const COVER_TEASER_MOTION = {
  panelEnterY: 28,
  panelDuration: 0.55,
  panelStagger: 0.12,
  loopInterval: 1200,
  flashInterval: 1600,
};

export const SUMMARY_TIMING = {
  panelFlash: 520,
  edgePulseFirst: 520,
  edgePulseSecond: 800,
  badgePopDelay: 100,
  flashLeft: 1000,
  annoBlue: 900,
  flashRight: 1000,
  badgeFinalDelay: 470,
};

export const SUMMARY_TREE_MOTION = {
  edgePulseDuration: 0.34,
};

export const SUMMARY_SCHEMATIC_MOTION = {
  annoBlueDuration: 0.32,
  annoGoldDuration: 0.32,
};

export const SUMMARY_BADGE_MOTION = {
  badgeInitialScale: 0.88,
};

export const DFS_TIMING = {
  enterNode: 480,
  enterEdge: 440,
  leafFlashLoop: 360,
  leaveEdge: 260,
};

export const DFS_MOTION = {
  depthCardDuration: 0.38,
  depthCardEnterY: 16,
  depthCardExitY: 8,
  depthCardScale: 0.94,
  depthValueDuration: 0.6,
  depthValueScale: 1.12,
  nodePulseDuration: 0.48,
  nodeFlashDuration: 0.36,
  nodePulseScale: 1.14,
  edgePulseDuration: 0.44,
  pathBadgeInitialScale: 0.88,
  pathBadgePopDuration: 0.32,
  pathBadgePopScaleMid: 1.03,
};

/** DFS 节点上方深度小标 — 按节点微调位置（调试面板数组编辑） */
export const DFS_BADGE_LAYOUT = [
  { id: "1", label: "节点 1", layoutLeft: 50, size: 1, shiftX: 0, shiftY: -20 },
  { id: "2", label: "节点 2", layoutLeft: 50, size: 1, shiftX: 0, shiftY: 0 },
  { id: "4", label: "节点 4", layoutLeft: 50, size: 1, shiftX: 0, shiftY: 0 },
  { id: "3", label: "节点 3", layoutLeft: 50, size: 1, shiftX: 0, shiftY: 0 },
  { id: "5", label: "节点 5", layoutLeft: 50, size: 1, shiftX: 0, shiftY: 0 },
  { id: "6", label: "节点 6", layoutLeft: 50, size: 1, shiftX: 29, shiftY: 5 },
];

export const PLAYBACK_UTILS = {
  popBadgeDuration: 0.32,
  popBadgeScaleMid: 1.03,
  panelFlash: 520,
};

/** 布局/字号 CSS 变量 — 唯一数据源；启动时注入 .md-deck，保存时只写本文件 */
export const DECK_TEXT = {
  coverLeetcode: "LeetCode 104",
  coverTitle: "二叉树的最大深度",
  coverDifficulty: "中等",
  summaryTopPanelTitle: "自顶向下的 DFS",
  summaryBottomPanelTitle: "自底向上的 DFS",
  summaryTopBadge: "最大深度 = 3",
  summaryBottomBadge: "最大深度 = max(左, 右) + 1",
  schematicLeftCaption: "左子树",
  schematicRightCaption: "右子树",
  dfsDepthLabel: "当前最大深度",
};

export const DECK_CSS_VARS = {
  "--md-cover-title-left": "50%",
  "--md-cover-title-layout-size": "1",
  "--md-cover-difficulty-left": "50%",
  "--md-cover-difficulty-layout-size": "1",
  "--md-cover-title-size": "46px",
  "--md-cover-leetcode-size": "22px",
  "--md-cover-difficulty-size": "28px",
  "--md-cover-difficulty-gap": "34px",
  "--md-summary-top-enter-y": "24px",
  "--md-summary-top-enter-scale": "0.96",
  "--md-summary-top-step1-x": "148px",
  "--md-summary-bottom-enter-x": "44px",
  "--md-summary-bottom-enter-y": "24px",
  "--md-summary-top-step1-y": "0px",
  "--md-summary-top-final-x": "0px",
  "--md-summary-top-final-y": "0px",
  "--md-summary-bottom-final-x": "0px",
  "--md-summary-bottom-final-y": "0px",
  "--md-panel-title-size": "28px",
  "--md-tree-badge-left": "36%",
  "--md-tree-badge-top": "-53px",
  "--md-tree-badge-shift-x": "71px",
  "--md-tree-badge-shift-y": "3px",
  "--md-tree-badge-font-size": "18px",
  "--md-tree-badge-gold-left": "24%",
  "--md-tree-badge-gold-top": "-54px",
  "--md-tree-badge-gold-shift-x": "123px",
  "--md-tree-badge-gold-shift-y": "-5px",
  "--md-tree-badge-gold-font-size": "18px",
  "--md-cover-stage-offset-y": "144px",
  "--md-cover-teaser-bottom": "4%",
  "--md-cover-teaser-height": "38vh",
  "--md-cover-teaser-gap": "20px",
  "--md-cover-teaser-title-size": "20px",
  "--md-cover-teaser-left-shift-x": "0px",
  "--md-cover-teaser-left-shift-y": "0px",
  "--md-cover-teaser-left-layout-size": "1",
  "--md-cover-teaser-right-shift-x": "47px",
  "--md-cover-teaser-right-shift-y": "-92px",
  "--md-cover-teaser-right-layout-size": "1",
  "--md-summary-panel-top-left": "0%",
  "--md-summary-panel-top-layout-size": "1",
  "--md-summary-panel-bottom-left": "50%",
  "--md-summary-panel-bottom-layout-size": "1",
  "--md-summary-badge-green-left": "36%",
  "--md-summary-badge-green-layout-size": "1",
  "--md-summary-badge-gold-left": "24%",
  "--md-summary-badge-gold-layout-size": "1",
  "--md-summary-tree-left": "50%",
  "--md-summary-tree-layout-size": "1",
  "--md-summary-schematic-left": "50%",
  "--md-summary-schematic-layout-size": "1",
  "--md-dfs-depth-card-top": "72%",
  "--md-dfs-depth-card-left": "50%",
  "--md-dfs-depth-card-shift-x": "0px",
  "--md-dfs-depth-card-shift-y": "0px",
  "--md-dfs-depth-card-layout-size": "1",
  "--md-dfs-depth-value-size": "42px",
  "--md-dfs-tree-scale": "1.2354",
  "--md-dfs-tree-left": "50%",
  "--md-dfs-tree-layout-size": "1",
  "--md-dfs-tree-shift-x": "0px",
  "--md-dfs-tree-shift-y": "-27px",
};

export function cloneAnimConfig() {
  return {
    DECK_TRANSITION: { ...DECK_TRANSITION },
    COVER_MOTION: { ...COVER_MOTION },
    COVER_TEASER_MOTION: { ...COVER_TEASER_MOTION },
    SUMMARY_TIMING: { ...SUMMARY_TIMING },
    SUMMARY_TREE_MOTION: { ...SUMMARY_TREE_MOTION },
    SUMMARY_SCHEMATIC_MOTION: { ...SUMMARY_SCHEMATIC_MOTION },
    SUMMARY_BADGE_MOTION: { ...SUMMARY_BADGE_MOTION },
    DFS_TIMING: { ...DFS_TIMING },
    DFS_MOTION: { ...DFS_MOTION },
    DFS_BADGE_LAYOUT: DFS_BADGE_LAYOUT.map((item) => ({ ...item })),
    PLAYBACK_UTILS: { ...PLAYBACK_UTILS },
    DECK_TEXT: { ...DECK_TEXT },
    DECK_CSS_VARS: { ...DECK_CSS_VARS },
  };
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
