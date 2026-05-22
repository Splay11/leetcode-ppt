export function computeDfsState(steps, stepCount) {
  const highlighted = new Set();
  const activeEdges = new Set();
  const badges = {};
  let maxDepth = 0;
  let depthCardVisible = false;
  for (let i = 0; i < stepCount && i < steps.length; i += 1) {
    const e = steps[i];
    switch (e.type) {
      case "enter_node": highlighted.add(e.nodeId); badges[e.nodeId] = e.depth; break;
      case "enter_edge": activeEdges.add(`${e.fromId}-${e.toId}`); break;
      case "leaf_flash": maxDepth = Math.max(maxDepth, e.depth); depthCardVisible = true; break;
      case "leave_node": highlighted.delete(e.nodeId); delete badges[e.nodeId]; break;
      case "leave_edge": activeEdges.delete(`${e.fromId}-${e.toId}`); break;
      default: break;
    }
  }
  const current = steps[Math.min(stepCount, steps.length) - 1];
  let flashPath = null;
  let pulseNodes = new Set();
  if (current?.type === "leaf_flash") flashPath = current.path;
  else if (current?.type === "enter_node") pulseNodes = new Set([current.nodeId]);
  return { highlighted, activeEdges, badges, maxDepth, depthCardVisible, flashPath, pulseNodes };
}
