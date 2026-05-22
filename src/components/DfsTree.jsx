import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

/** 演示树：前序 DFS → 1, 2, 4, 5, 3 */
const NODES = [
  { id: "1", label: "1", x: 400, y: 56 },
  { id: "2", label: "2", x: 240, y: 168 },
  { id: "4", label: "4", x: 160, y: 280 },
  { id: "5", label: "5", x: 320, y: 280 },
  { id: "3", label: "3", x: 560, y: 168 },
];

const EDGES = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "2", to: "5" },
];

const DFS_STEPS = [
  { nodeId: "1", edgeKey: null, caption: "visit(1) — 进入根" },
  { nodeId: "2", edgeKey: "1-2", caption: "沿左子树 → visit(2)" },
  { nodeId: "4", edgeKey: "2-4", caption: "继续左子 → visit(4)" },
  { nodeId: "4", edgeKey: null, caption: "叶子节点，开始回溯" },
  { nodeId: "5", edgeKey: "2-5", caption: "回溯后 → visit(5)" },
  { nodeId: "2", edgeKey: null, caption: "离开节点 2，返回上层" },
  { nodeId: "3", edgeKey: "1-3", caption: "转向右子树 → visit(3)" },
  { nodeId: "3", edgeKey: null, caption: "遍历完成" },
];

const NODE_RADIUS = 34;
const STEP_MS = 950;

function edgeKey(from, to) {
  return `${from}-${to}`;
}

function getNode(id) {
  return NODES.find((n) => n.id === id);
}

export default function DfsTree() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = DFS_STEPS[stepIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % DFS_STEPS.length);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, []);

  const visitedSet = useMemo(() => {
    const set = new Set();
    for (let i = 0; i <= stepIndex; i += 1) {
      set.add(DFS_STEPS[i].nodeId);
    }
    return set;
  }, [stepIndex]);

  const activeEdge = step.edgeKey;

  return (
    <div className="dfs-tree-panel">
      <svg
        className="dfs-svg"
        viewBox="0 0 800 360"
        role="img"
        aria-label="二叉树 DFS 前序遍历示意"
      >
        <defs>
          <marker
            id="dfs-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(36,148,93,0.85)" />
          </marker>
        </defs>

        {EDGES.map(({ from, to }) => {
          const a = getNode(from);
          const b = getNode(to);
          const key = edgeKey(from, to);
          const active = activeEdge === key;
          return (
            <g key={key}>
              <line
                className="dfs-edge-base"
                x1={a.x}
                y1={a.y + NODE_RADIUS}
                x2={b.x}
                y2={b.y - NODE_RADIUS}
              />
              {active && (
                <motion.line
                  className="dfs-edge-active"
                  x1={a.x}
                  y1={a.y + NODE_RADIUS}
                  x2={b.x}
                  y2={b.y - NODE_RADIUS}
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  markerEnd="url(#dfs-arrow)"
                />
              )}
            </g>
          );
        })}

        {NODES.map((node) => {
          const isCurrent = step.nodeId === node.id;
          const isVisited = visitedSet.has(node.id);
          return (
            <motion.g
              key={node.id}
              className="dfs-node"
              animate={{
                scale: isCurrent ? 1.14 : 1,
                opacity: isVisited ? 1 : 0.38,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <circle
                className={`dfs-node-circle ${isCurrent ? "current" : ""} ${isVisited ? "visited" : ""}`}
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
              />
              <text className="dfs-node-label" x={node.x} y={node.y}>
                {node.label}
              </text>
              {isCurrent && (
                <motion.circle
                  className="dfs-node-ring"
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS + 10}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.g>
          );
        })}
      </svg>

      <motion.div
        key={stepIndex}
        className="dfs-caption"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="dfs-step-num">{String(stepIndex + 1).padStart(2, "0")}</span>
        {step.caption}
      </motion.div>

      <div className="dfs-seq">
        {DFS_STEPS.map((s, i) => (
          <span
            key={`${s.nodeId}-${i}`}
            className={`dfs-seq-chip ${i === stepIndex ? "active" : ""} ${i < stepIndex ? "done" : ""}`}
          >
            {s.nodeId}
          </span>
        ))}
      </div>
    </div>
  );
}
