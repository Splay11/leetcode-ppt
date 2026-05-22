import { motion, AnimatePresence } from "motion/react";
import { DFS_DEMO_EDGES, DFS_DEMO_NODES } from "../constants.js";
import { DFS_STEPS } from "../buildDfsSteps.js";
import { useDfsPlayback } from "../useDfsPlayback.js";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";
import TreeSvg from "./TreeSvg.jsx";

const EASE = [0.16, 1, 0.3, 1];

export default function DfsSlide({ stepCount, animateForward }) {
  const motionCfg = useAnimBlock("DFS_MOTION");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const treePick = useTuningPickable("dfs-tree", {
    className: "md-dfs-tree-pick",
    pickPriority: "low",
  });
  const depthPick = useTuningPickable("dfs-depth-card", { className: "md-dfs-depth-card-anchor" });
  const { highlighted, activeEdges, badges, maxDepth, depthCardVisible, flashPath, pulseNodes } =
    useDfsPlayback(DFS_STEPS, stepCount, animateForward);

  return (
    <div className="md-dfs-stage">
      <div className="md-dfs-tree-wrap">
        <div {...(debug ? treePick : { className: "md-dfs-tree-pick" })}>
          <TreeSvg
            variant="dfs"
            nodes={DFS_DEMO_NODES}
            edges={DFS_DEMO_EDGES}
            highlighted={highlighted}
            activeEdges={activeEdges}
            badges={badges}
            flashPath={flashPath}
            pulseNodes={pulseNodes}
          />
        </div>
      </div>

      <AnimatePresence>
        {depthCardVisible && (
          <div {...(debug ? depthPick : { className: "md-dfs-depth-card-anchor" })}>
            <motion.div
              className="md-dfs-depth-card md-dfs-depth-card--visible"
              initial={{ opacity: 0, y: motionCfg.depthCardEnterY, scale: motionCfg.depthCardScale }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: motionCfg.depthCardExitY }}
              transition={{ duration: motionCfg.depthCardDuration, ease: EASE }}
            >
              <span className="md-dfs-depth-label">{copy.dfsDepthLabel}</span>
              <motion.span
                key={maxDepth}
                className="md-dfs-depth-value"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, motionCfg.depthValueScale, 1],
                  color: ["#24945d", "#d79b25", "#24945d"],
                }}
                transition={{ duration: motionCfg.depthValueDuration, ease: "easeInOut" }}
              >
                {maxDepth > 0 ? maxDepth : "—"}
              </motion.span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
