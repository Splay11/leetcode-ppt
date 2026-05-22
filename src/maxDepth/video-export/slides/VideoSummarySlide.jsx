import { DECK_TEXT } from "../../animConfig.js";
import { SUMMARY_TOP_DOWN_EDGES, SUMMARY_TOP_DOWN_NODES } from "../../constants.js";
import TreeSvg from "../../components/TreeSvg.jsx";
import VideoSubtreeSchematic from "./VideoSubtreeSchematic.jsx";
import { computeSummaryState } from "../summaryState.js";

export default function VideoSummarySlide({ step, localFrame }) {
  const copy = DECK_TEXT;
  const state = computeSummaryState(step, localFrame);

  return (
    <div className="md-summary-stage">
      <div className="md-summary-row" data-summary-step={step}>
        <article
          className={`md-approach-panel ${state.panelFlashTop ? "md-panel-flash" : ""}`}
          data-card="topdown"
        >
          <h3 className="md-approach-panel__title">{copy.summaryTopPanelTitle}</h3>
          <div className="md-approach-panel__body">
            <div className="md-diagram-frame">
              <TreeSvg
                nodes={SUMMARY_TOP_DOWN_NODES}
                edges={SUMMARY_TOP_DOWN_EDGES}
                variant="summary"
                edgePulseKeys={state.edgePulseKeys}
              />
              {state.topBadge ? (
                <span className="md-tree-badge-anchor">
                  <span className="md-tree-badge md-tree-badge--green">{state.topBadge}</span>
                </span>
              ) : null}
            </div>
          </div>
        </article>

        <article
          className={`md-approach-panel ${state.panelFlashBottom ? "md-panel-flash" : ""}`}
          data-card="bottomup"
        >
          <h3 className="md-approach-panel__title">{copy.summaryBottomPanelTitle}</h3>
          <div className="md-approach-panel__body">
            <div className="md-diagram-frame md-diagram-frame--schematic">
              <VideoSubtreeSchematic
                flashLeft={state.flashLeft}
                flashRight={state.flashRight}
                annotations={state.annotations}
              />
              {state.bottomBadge ? (
                <span className="md-tree-badge-anchor">
                  <span className="md-tree-badge md-tree-badge--gold">{state.bottomBadge}</span>
                </span>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
