import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { edgeEndpoints } from "../constants.js";
import { useAnimBlock } from "../animHooks.js";
import { applyPickSelection, mergePickable, useAnimTuning, useTuningPickable } from "@motion-tuning";

const EASE = [0.16, 1, 0.3, 1];

export default function TreeSvg({
  nodes,
  edges,
  highlighted = new Set(),
  activeEdges = new Set(),
  badges = {},
  flashPath = null,
  pulseNodes = new Set(),
  variant = "summary",
  edgePulseKeys = new Set(),
  className = "",
}) {
  const summaryTreeMotion = useAnimBlock("SUMMARY_TREE_MOTION");
  const dfsMotion = useAnimBlock("DFS_MOTION");
  const badgeLayoutConfig = useAnimBlock("DFS_BADGE_LAYOUT");
  const motionCfg = variant === "summary" ? summaryTreeMotion : dfsMotion;
  const debug = useAnimTuning()?.enabled;
  const summaryTreePick = useTuningPickable("summary-tree-motion");
  const summarySvgProps =
    variant === "summary" && debug
      ? {
          ...summaryTreePick,
          className: `md-tree-svg ${className} ${summaryTreePick.className}`.trim(),
        }
      : { className: `md-tree-svg ${className}`.trim() };
  const focusTarget = useAnimTuning()?.focusTarget;
  const flashSet = flashPath ? new Set(flashPath) : null;
  const offsetMap = useMemo(
    () => Object.fromEntries(badgeLayoutConfig.map((item) => [item.id, item])),
    [badgeLayoutConfig],
  );

  return (
    <svg viewBox="0 0 800 400" role="img" {...summarySvgProps}>
      {edges.map(({ from, to }) => {
        const ep = edgeEndpoints(from, to, nodes);
        if (!ep) return null;
        const key = `${from}-${to}`;
        const pulsing = activeEdges.has(key) || edgePulseKeys.has(key);
        return (
          <g key={key}>
            <line
              className={`md-tree-edge ${variant === "summary" ? "md-tree-edge--summary" : ""}`}
              x1={ep.x1}
              y1={ep.y1}
              x2={ep.x2}
              y2={ep.y2}
            />
            {pulsing && (
              <motion.line
                className="md-tree-edge-pulse"
                x1={ep.x1}
                y1={ep.y1}
                x2={ep.x2}
                y2={ep.y2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: motionCfg.edgePulseDuration, ease: EASE }}
              />
            )}
          </g>
        );
      })}

      {nodes.map((node) => {
        const isHi = highlighted.has(node.id);
        const isFlash = flashSet?.has(node.id);
        const isPulse = pulseNodes.has(node.id);
        const badge = badges[node.id];
        const layout = badgeLayout(node, badge, offsetMap[node.id]);

        return (
          <g key={node.id} className="md-tree-node">
            <motion.circle
              className={`md-tree-node-circle ${isHi ? "md-tree-node-circle--gold" : ""} ${
                variant === "summary" ? "md-tree-node-circle--summary" : ""
              }`}
              cx={node.x}
              cy={node.y}
              r={node.r}
              animate={{
                scale: isFlash || isPulse ? [1, motionCfg.nodePulseScale, 1] : 1,
              }}
              transition={{
                duration: isFlash ? motionCfg.nodeFlashDuration : motionCfg.nodePulseDuration,
                ease: "easeInOut",
                repeat: isFlash ? 2 : 0,
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
            <text className="md-tree-node-label" x={node.x} y={node.y}>
              {node.label}
            </text>
            <AnimatePresence>
              {layout && (
                <motion.g
                  key={`${node.id}-${badge}`}
                  className="md-path-badge"
                  initial={{
                    opacity: 0,
                    scale: motionCfg.pathBadgeInitialScale ?? 0.88,
                  }}
                  animate={{
                    opacity: 1,
                    scale: [
                      motionCfg.pathBadgeInitialScale ?? 0.88,
                      motionCfg.pathBadgePopScaleMid ?? 1.03,
                      1,
                    ],
                  }}
                  exit={{
                    opacity: 0,
                    scale: motionCfg.pathBadgeInitialScale ?? 0.88,
                  }}
                  transition={{
                    duration: motionCfg.pathBadgePopDuration ?? 0.32,
                    ease: EASE,
                  }}
                  style={{
                    transformOrigin: `${layout.cx}px ${layout.cy}px`,
                    transform: `scale(${layout.layoutSize ?? 1})`,
                  }}
                >
                  <motion.rect
                    {...(variant === "dfs" && debug
                      ? applyPickSelection(
                          mergePickable("dfs-badge-layout", { nodeId: node.id }),
                          focusTarget,
                          "dfs-badge-layout",
                          { nodeId: node.id },
                        )
                      : {})}
                    x={layout.x}
                    y={layout.y}
                    width={layout.w}
                    height={layout.h}
                    rx="9"
                  />
                  <text x={layout.cx} y={layout.cy} pointerEvents="none">
                    {badge}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        );
      })}
    </svg>
  );
}

function badgeLayout(node, depth, offset) {
  if (depth == null) return null;
  const r = node.r ?? 34;
  const gap = 6;
  const h = 22;
  const depthStr = String(depth);
  const w = depthStr.length > 1 ? 32 : 26;
  const shiftX = offset?.shiftX ?? 0;
  const shiftY = offset?.shiftY ?? 0;
  const layoutLeft = offset?.layoutLeft ?? 50;
  const layoutSize = offset?.layoutSize ?? 1;
  let cx = node.x;
  let cy = node.y - r - gap - h / 2;
  let badgeTop = cy - h / 2;
  if (badgeTop < 8) {
    const bump = 8 - badgeTop;
    cy += bump;
    badgeTop = 8;
  }
  cx += shiftX + (layoutLeft - 50) * 4;
  cy += shiftY;
  badgeTop += shiftY;
  return { x: cx - w / 2, y: badgeTop, w, h, cx, cy, layoutSize };
}
