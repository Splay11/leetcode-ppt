export const GRAPH_NODES = [
  { id: "A", label: "A", left: 42, top: 44 },
  { id: "B", label: "B", left: 228, top: 104 },
  { id: "C", label: "C", left: 224, top: 212 },
  { id: "D", label: "D", left: 390, top: 76 },
  { id: "E", label: "E", left: 408, top: 190 },
];

export const GRAPH_EDGES = [
  { left: 84, top: 74, width: 148, rotate: 20 },
  { left: 84, top: 74, width: 146, rotate: 58 },
  { left: 250, top: 126, width: 132, rotate: -21 },
  { left: 258, top: 128, width: 132, rotate: 39 },
  { left: 260, top: 232, width: 126, rotate: -12 },
];

/** DFS 演示访问顺序（节点下标） */
export const DFS_VISIT_ORDER = [0, 1, 3, 1, 4, 2];

export const STACK_FRAMES = [
  { fn: "dfs(A)", tag: "root" },
  { fn: "dfs(B)", tag: "go deeper" },
  { fn: "dfs(D)", tag: "current" },
];

export const STEP_CARDS = [
  { tag: "Step 1", title: "访问起点", desc: "选择起始节点，标记为 visited，避免重复遍历和死循环。" },
  { tag: "Step 2", title: "探索邻居", desc: "优先进入第一个未访问的邻居节点，形成一条深入路径。" },
  { tag: "Step 3", title: "触底回溯", desc: "当当前节点没有可继续访问的邻居，就回退到上一层。" },
  { tag: "Step 4", title: "完成遍历", desc: "重复深入与回溯，直到所有可达节点都被访问完成。" },
];

export const METRICS = [
  { value: "O(V + E)", label: "时间复杂度" },
  { value: "O(V)", label: "空间复杂度" },
  { value: "Backtracking", label: "核心机制" },
];

export const TABLE_ROWS = [
  { module: "图遍历", desc: "访问所有可达节点，生成访问序列", scene: "连通性、路径搜索", status: "常用" },
  { module: "递归搜索", desc: "利用函数调用栈保存当前搜索路径", scene: "树、图、组合问题", status: "高效" },
  { module: "回溯算法", desc: "尝试一个分支，失败后撤销并尝试其他选择", scene: "排列组合、棋盘问题", status: "核心" },
  { module: "栈实现", desc: "可用显式 stack 替代递归，避免递归深度限制", scene: "大规模图、工程实现", status: "推荐" },
];

export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.78, delay: i * 0.16, ease: EASE },
  }),
};

export const slideTransition = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.985 },
  transition: { duration: 0.68, ease: EASE },
};
