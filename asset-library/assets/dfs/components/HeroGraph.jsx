import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DFS_VISIT_ORDER,
  GRAPH_EDGES,
  GRAPH_NODES,
} from "../constants.js";

export default function HeroGraph({ playKey }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeEdge, setActiveEdge] = useState(-1);
  const [visited, setVisited] = useState(() => new Set([0]));

  useEffect(() => {
    setCurrentIndex(0);
    setActiveEdge(-1);
    setVisited(new Set([0]));

    const timers = DFS_VISIT_ORDER.map((nodeIndex, step) =>
      window.setTimeout(() => {
        setCurrentIndex(nodeIndex);
        setVisited((prev) => new Set([...prev, nodeIndex]));
        setActiveEdge(Math.max(0, step - 1));
      }, 450 + step * 520),
    );

    return () => timers.forEach(clearTimeout);
  }, [playKey]);

  return (
    <motion.div
      className="dfs-node-map"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {GRAPH_EDGES.map((edge, i) => (
        <motion.div
          key={`edge-${i}`}
          className={`dfs-edge ${activeEdge >= i ? "dfs-edge--active" : ""}`}
          style={{
            left: edge.left,
            top: edge.top,
            width: edge.width,
            transform: `rotate(${edge.rotate}deg)`,
          }}
          animate={
            activeEdge >= i
              ? { opacity: 1, scaleX: 1 }
              : { opacity: 0.55, scaleX: 0.85 }
          }
          transition={{ duration: 0.35 }}
        />
      ))}

      {GRAPH_NODES.map((node, i) => {
        const isCurrent = currentIndex === i;
        const isVisited = visited.has(i);
        return (
          <motion.div
            key={node.id}
            className="dfs-node"
            style={{ left: node.left, top: node.top }}
            animate={{
              scale: isCurrent ? 1.2 : isVisited ? 1.12 : 1,
              rotate: isCurrent ? -3 : 0,
              background: isCurrent
                ? "linear-gradient(145deg, #fbbf24, #fde68a)"
                : isVisited
                  ? "linear-gradient(145deg, #34d399, #a7f3d0)"
                  : "linear-gradient(145deg, #ffffff, #c9f7ff)",
              boxShadow: isCurrent
                ? "0 0 0 12px rgba(251, 191, 36, 0.16), 0 20px 50px rgba(251, 191, 36, 0.32)"
                : isVisited
                  ? "0 0 0 10px rgba(52, 211, 153, 0.12), 0 18px 40px rgba(52, 211, 153, 0.32)"
                  : "0 14px 34px rgba(103, 232, 249, 0.24)",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            {node.label}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
