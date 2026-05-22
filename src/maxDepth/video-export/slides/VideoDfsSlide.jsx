import { DECK_TEXT } from "../../animConfig.js";
import { DFS_DEMO_EDGES, DFS_DEMO_NODES } from "../../constants.js";
import { DFS_STEPS } from "../../buildDfsSteps.js";
import TreeSvg from "../../components/TreeSvg.jsx";
import { computeDfsState } from "../dfsState.js";

export default function VideoDfsSlide({ dfsIndex }) {
  const copy = DECK_TEXT;
  const { highlighted, activeEdges, badges, maxDepth, depthCardVisible, flashPath, pulseNodes } =
    computeDfsState(DFS_STEPS, dfsIndex);

  return (
    <div className="md-dfs-stage">
      <div className="md-dfs-tree-wrap">
        <div className="md-dfs-tree-pick">
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

      {depthCardVisible ? (
        <div className="md-dfs-depth-card-anchor">
          <div className="md-dfs-depth-card md-dfs-depth-card--visible">
            <span className="md-dfs-depth-label">{copy.dfsDepthLabel}</span>
            <span className="md-dfs-depth-value">{maxDepth > 0 ? maxDepth : "—"}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
