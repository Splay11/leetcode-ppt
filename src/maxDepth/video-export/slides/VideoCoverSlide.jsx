import { COVER_MOTION, COVER_TEASER_MOTION, DECK_TEXT } from "../../animConfig.js";
import { SUMMARY_TOP_DOWN_EDGES, SUMMARY_TOP_DOWN_NODES } from "../../constants.js";
import TreeSvg from "../../components/TreeSvg.jsx";
import VideoSubtreeSchematic from "./VideoSubtreeSchematic.jsx";
import { frameProgress, lerp, easeOut } from "../remotionUtils.js";

const LEFT_ANCHOR = { x1: 240, y1: 283, x2: 388, y2: 94 };
const RIGHT_ANCHOR = { x1: 560, y1: 283, x2: 412, y2: 94 };
const STATIC_ANNOTATIONS = [
  { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
  { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
];

export default function VideoCoverSlide({ phase, localFrame, fps }) {
  const copy = DECK_TEXT;
  const motionCfg = COVER_MOTION;
  const teaserCfg = COVER_TEASER_MOTION;
  const showDifficulty = phase >= 1;

  const titleEnter = easeOut(
    frameProgress(localFrame, 0, Math.round(motionCfg.titleDuration * fps)),
  );
  const diffEnd = Math.round(motionCfg.difficultyDuration * fps);
  const diffEnter = showDifficulty ? easeOut(frameProgress(localFrame, 0, diffEnd)) : 0;
  const slotEnd = Math.round(motionCfg.difficultySlotDuration * fps);
  const slotOpen = showDifficulty ? easeOut(frameProgress(localFrame, 0, slotEnd)) : 0;

  const teaserStart = Math.round(teaserCfg.panelDuration * fps * 0.2);
  const teaserLeft = showDifficulty
    ? easeOut(frameProgress(localFrame, teaserStart, teaserStart + Math.round(teaserCfg.panelDuration * fps)))
    : 0;
  const teaserRight = showDifficulty
    ? easeOut(
        frameProgress(
          localFrame,
          teaserStart + Math.round(teaserCfg.panelStagger * fps),
          teaserStart + Math.round((teaserCfg.panelDuration + teaserCfg.panelStagger) * fps),
        ),
      )
    : 0;

  const titleShrink = showDifficulty
    ? easeOut(frameProgress(localFrame, 0, Math.round(motionCfg.titleShrinkDuration * fps)))
    : 0;

  const loopPhase = showDifficulty ? localFrame % Math.round((teaserCfg.loopInterval / 1000) * fps) : 0;
  const loopHalf = Math.round((teaserCfg.loopInterval / 2000) * fps);
  const edgePulseKeys =
    showDifficulty && loopPhase < loopHalf ? new Set(["1-2"]) : new Set(["1-2", "2-4"]);

  const flashPhase = showDifficulty ? localFrame % Math.round((teaserCfg.flashInterval / 1000) * fps) : 0;
  const flashHalf = Math.round((teaserCfg.flashInterval / 2000) * fps);
  const flashLeft = showDifficulty && flashPhase < flashHalf;
  const flashRight = showDifficulty && flashPhase >= flashHalf;

  return (
    <div className="md-cover-stage">
      <div className={`md-cover-teaser-row ${showDifficulty ? "md-cover-teaser-row--visible" : ""}`}>
        <div
          className="md-cover-teaser-panel-wrap"
          style={{
            opacity: teaserLeft,
            transform: `translateY(${lerp(teaserCfg.panelEnterY, 0, teaserLeft)}px)`,
          }}
        >
          <article className="md-cover-teaser-panel" data-card="topdown">
            <h3 className="md-cover-teaser-panel__title">{copy.summaryTopPanelTitle}</h3>
            <div className="md-cover-teaser-panel__body">
              <div className="md-cover-teaser-diagram">
                <TreeSvg
                  nodes={SUMMARY_TOP_DOWN_NODES}
                  edges={SUMMARY_TOP_DOWN_EDGES}
                  variant="summary"
                  edgePulseKeys={edgePulseKeys}
                />
              </div>
            </div>
          </article>
        </div>
        <div
          className="md-cover-teaser-panel-wrap"
          style={{
            opacity: teaserRight,
            transform: `translateY(${lerp(teaserCfg.panelEnterY, 0, teaserRight)}px)`,
          }}
        >
          <article className="md-cover-teaser-panel" data-card="bottomup">
            <h3 className="md-cover-teaser-panel__title">{copy.summaryBottomPanelTitle}</h3>
            <div className="md-cover-teaser-panel__body">
              <div className="md-cover-teaser-diagram md-cover-teaser-diagram--schematic">
                <VideoSubtreeSchematic
                  flashLeft={flashLeft}
                  flashRight={flashRight}
                  annotations={showDifficulty ? STATIC_ANNOTATIONS : []}
                />
              </div>
            </div>
          </article>
        </div>
      </div>

      <div
        className={`md-cover-hero md-difficulty-wrap ${showDifficulty ? "md-difficulty-wrap--open md-difficulty-wrap--teaser" : ""}`}
      >
        <div
          className="md-difficulty-slot"
          style={{
            opacity: diffEnter * slotOpen,
            maxHeight: slotOpen * motionCfg.difficultySlotMaxHeight,
            paddingTop: slotOpen * motionCfg.difficultySlotPadding,
            paddingBottom: slotOpen * motionCfg.difficultySlotPadding,
            overflow: "hidden",
          }}
        >
          <span
            className="md-difficulty md-difficulty--medium"
            style={{
              opacity: diffEnter,
              transform: `translateY(${lerp(motionCfg.difficultyInitialY, 0, diffEnter)}px) scale(${lerp(motionCfg.difficultyInitialScale, 1, diffEnter)})`,
              display: "inline-flex",
            }}
          >
            {copy.coverDifficulty}
          </span>
        </div>

        <article
          className="md-title-card"
          style={{
            opacity: titleEnter,
            transform: `translateY(${lerp(motionCfg.titleInitialY, showDifficulty ? motionCfg.titleShrinkY : 0, Math.max(titleEnter, titleShrink))}px) scale(${lerp(1, showDifficulty ? motionCfg.titleShrinkScale : 1, titleShrink)})`,
          }}
        >
          <p className="md-leetcode">{copy.coverLeetcode}</p>
          <h1 className="md-main-title">{copy.coverTitle}</h1>
        </article>
      </div>
    </div>
  );
}
