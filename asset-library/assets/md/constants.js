/** 做法总结 · 自顶向下示意树（与 max-depth-core 一致） */
export const SUMMARY_TOP_DOWN_NODES = [
  { id: "1", label: "1", x: 400, y: 72, r: 34 },
  { id: "2", label: "2", x: 300, y: 168, r: 34 },
  { id: "4", label: "4", x: 250, y: 278, r: 34 },
  { id: "5", label: "5", x: 350, y: 278, r: 34 },
  { id: "3", label: "3", x: 560, y: 168, r: 34 },
];

export const SUMMARY_TOP_DOWN_EDGES = [
  { from: "1", to: "2" },
  { from: "2", to: "4" },
  { from: "2", to: "5" },
  { from: "1", to: "3" },
];

/** DFS 演示树（与 max-depth-dfs-scene DEMO_TREE 一致） */
export const DFS_DEMO_NODES = [
  { id: "1", label: "1", x: 400, y: 56, r: 34 },
  { id: "2", label: "2", x: 260, y: 158, r: 34 },
  { id: "4", label: "4", x: 540, y: 158, r: 34 },
  { id: "3", label: "3", x: 180, y: 268, r: 34 },
  { id: "5", label: "5", x: 340, y: 268, r: 34 },
  { id: "6", label: "6", x: 340, y: 368, r: 34 },
];

export const DFS_DEMO_EDGES = [
  { from: "1", to: "2" },
  { from: "1", to: "4" },
  { from: "2", to: "3" },
  { from: "2", to: "5" },
  { from: "5", to: "6" },
];

export const DEMO_TREE = {
  value: 1,
  left: {
    value: 2,
    left: { value: 3 },
    right: { value: 5, left: { value: 6 } },
  },
  right: { value: 4 },
};

export const PROBLEM = {
  leetcode: "LeetCode 104",
  title: "二叉树的最大深度",
  difficulty: "medium",
  difficultyText: "中等",
};

export function nodeMap(nodes) {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

export function edgeEndpoints(fromId, toId, nodes) {
  const a = nodes.find((n) => n.id === fromId);
  const b = nodes.find((n) => n.id === toId);
  if (!a || !b) return null;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: a.x + ux * a.r,
    y1: a.y + uy * a.r,
    x2: b.x - ux * b.r,
    y2: b.y - uy * b.r,
    len: dist,
  };
}
