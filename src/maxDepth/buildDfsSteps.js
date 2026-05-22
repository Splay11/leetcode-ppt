import { DEMO_TREE } from "./constants.js";

/** 与 max-depth-dfs-scene buildDfsSteps 完全一致 */
export function buildDfsSteps(modelRoot = DEMO_TREE) {
  const steps = [];

  function dfs(node, parent, path, depth) {
    if (!node) return;
    const nodeId = String(node.value);
    if (parent !== null) {
      steps.push({ type: "enter_edge", fromId: String(parent.value), toId: nodeId });
    }
    steps.push({ type: "enter_node", nodeId, depth });
    const currentPath = [...path, nodeId];

    if (!node.left && !node.right) {
      steps.push({ type: "leaf_flash", path: currentPath, depth });
    } else {
      dfs(node.left, node, currentPath, depth + 1);
      dfs(node.right, node, currentPath, depth + 1);
    }
    steps.push({ type: "leave_node", nodeId });
    if (parent !== null) {
      steps.push({ type: "leave_edge", fromId: String(parent.value), toId: nodeId });
    }
  }

  dfs(modelRoot, null, [], 1);
  return steps;
}

export const DFS_STEPS = buildDfsSteps();
