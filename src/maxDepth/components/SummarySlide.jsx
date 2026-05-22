import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SUMMARY_TOP_DOWN_EDGES,
  SUMMARY_TOP_DOWN_NODES,
} from "../constants.js";
import { flashPanel } from "../useDfsPlayback.js";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";
import TreeSvg from "./TreeSvg.jsx";
import SubtreeSchematic from "./SubtreeSchematic.jsx";

const LEFT_ANCHOR = { x1: 240, y1: 283, x2: 388, y2: 94 };
const RIGHT_ANCHOR = { x1: 560, y1: 283, x2: 412, y2: 94 };
const EASE = [0.16, 1, 0.3, 1];

export default function SummarySlide({ step, animateForward }) {
  const timing = useAnimBlock("SUMMARY_TIMING");
  const badgeMotion = useAnimBlock("SUMMARY_BADGE_MOTION");
  const utils = useAnimBlock("PLAYBACK_UTILS");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const topPanelPick = useTuningPickable("summary-panel-enter", {
    pickRole: "top",
    className: "md-approach-panel",
  });
  const bottomPanelPick = useTuningPickable("summary-panel-final", {
    pickRole: "bottom",
    className: "md-approach-panel",
  });
  const topBadgePick = useTuningPickable("summary-badge-green", {
    className: "md-tree-badge-anchor",
  });
  const bottomBadgePick = useTuningPickable("summary-badge-gold", {
    className: "md-tree-badge-anchor",
  });
  const topPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const runId = useRef(0);

  const [edgePulseKeys, setEdgePulseKeys] = useState(new Set());
  const [topBadge, setTopBadge] = useState("");
  const [bottomBadge, setBottomBadge] = useState("");
  const [flashLeft, setFlashLeft] = useState(false);
  const [flashRight, setFlashRight] = useState(false);
  const [annotations, setAnnotations] = useState([]);

  const resetFx = () => {
    setEdgePulseKeys(new Set());
    setTopBadge("");
    setBottomBadge("");
    setFlashLeft(false);
    setFlashRight(false);
    setAnnotations([]);
  };

  useEffect(() => {
    if (!animateForward) {
      resetFx();
      if (step >= 1) setTopBadge(copy.summaryTopBadge);
      if (step >= 2) {
        setBottomBadge(copy.summaryBottomBadge);
        setAnnotations([
          { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
          { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
        ]);
      }
      return;
    }

    if (step === 1) {
      const id = ++runId.current;
      resetFx();
      (async () => {
        await flashPanel(topPanelRef.current, utils.panelFlash);
        if (id !== runId.current) return;
        setEdgePulseKeys(new Set(["1-2"]));
        await wait(timing.edgePulseFirst);
        if (id !== runId.current) return;
        setEdgePulseKeys(new Set(["1-2", "2-4"]));
        await wait(timing.edgePulseSecond);
        if (id !== runId.current) return;
        setEdgePulseKeys(new Set());
        await wait(timing.badgePopDelay);
        if (id !== runId.current) return;
        setTopBadge(copy.summaryTopBadge);
      })();
    }

    if (step === 2) {
      const id = ++runId.current;
      (async () => {
        await flashPanel(bottomPanelRef.current, utils.panelFlash);
        if (id !== runId.current) return;
        setFlashLeft(true);
        await wait(timing.flashLeft);
        if (id !== runId.current) return;
        setFlashLeft(false);
        setAnnotations([{ id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" }]);
        await wait(timing.annoBlue);
        if (id !== runId.current) return;
        setFlashRight(true);
        await wait(timing.flashRight);
        if (id !== runId.current) return;
        setFlashRight(false);
        setAnnotations([
          { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
          { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
        ]);
        await wait(timing.badgeFinalDelay);
        setBottomBadge(copy.summaryBottomBadge);
      })();
    }
  }, [step, animateForward, timing, utils, copy]);

  return (
    <div className="md-summary-stage">
      <div className="md-summary-row" data-summary-step={step}>
        <article
          ref={topPanelRef}
          data-card="topdown"
          {...(debug ? topPanelPick : { className: "md-approach-panel" })}
        >
          <h3 className="md-approach-panel__title">{copy.summaryTopPanelTitle}</h3>
          <div className="md-approach-panel__body">
            <div className="md-diagram-frame">
              <TreeSvg
                nodes={SUMMARY_TOP_DOWN_NODES}
                edges={SUMMARY_TOP_DOWN_EDGES}
                variant="summary"
                edgePulseKeys={edgePulseKeys}
              />
              <AnimatePresence>
                {topBadge && (
                  <SummaryBadgeAnchor
                    text={topBadge}
                    debug={debug}
                    pick={topBadgePick}
                    badgeClassName="md-tree-badge md-tree-badge--green"
                    badgeMotion={badgeMotion}
                    utils={utils}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </article>

        <article
          ref={bottomPanelRef}
          data-card="bottomup"
          {...(debug ? bottomPanelPick : { className: "md-approach-panel" })}
        >
          <h3 className="md-approach-panel__title">{copy.summaryBottomPanelTitle}</h3>
          <div className="md-approach-panel__body">
            <div className="md-diagram-frame md-diagram-frame--schematic">
              <SubtreeSchematic flashLeft={flashLeft} flashRight={flashRight} annotations={annotations} />
              <AnimatePresence>
                {bottomBadge && (
                  <SummaryBadgeAnchor
                    text={bottomBadge}
                    debug={debug}
                    pick={bottomBadgePick}
                    badgeClassName="md-tree-badge md-tree-badge--gold"
                    badgeMotion={badgeMotion}
                    utils={utils}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** 外层 anchor 负责定位 + debug 选中；内层 motion 只播一次 pop，避免 tuning 重渲染重播动画 */
function SummaryBadgeAnchor({ text, debug, pick, badgeClassName, badgeMotion, utils }) {
  const [popDone, setPopDone] = useState(false);

  useEffect(() => {
    if (!text) setPopDone(false);
  }, [text]);

  return (
    <span {...(debug ? pick : { className: "md-tree-badge-anchor" })}>
      <motion.span
        className={badgeClassName}
        initial={popDone ? false : { opacity: 0, scale: badgeMotion.badgeInitialScale }}
        animate={
          popDone
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: [badgeMotion.badgeInitialScale, utils.popBadgeScaleMid, 1] }
        }
        transition={{ duration: utils.popBadgeDuration, ease: EASE }}
        onAnimationComplete={() => setPopDone(true)}
      >
        {text}
      </motion.span>
    </span>
  );
}
