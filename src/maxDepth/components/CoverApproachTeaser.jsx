import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SUMMARY_TOP_DOWN_EDGES, SUMMARY_TOP_DOWN_NODES } from "../constants.js";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";
import TreeSvg from "./TreeSvg.jsx";
import SubtreeSchematic from "./SubtreeSchematic.jsx";

const LEFT_ANCHOR = { x1: 240, y1: 283, x2: 388, y2: 94 };
const RIGHT_ANCHOR = { x1: 560, y1: 283, x2: 412, y2: 94 };
const STATIC_ANNOTATIONS = [
  { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
  { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
];
const EASE = [0.16, 1, 0.3, 1];

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function CoverApproachTeaser({ visible }) {
  const teaserCfg = useAnimBlock("COVER_TEASER_MOTION");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const leftPanelPick = useTuningPickable("cover-teaser-left", { className: "md-cover-teaser-panel" });
  const rightPanelPick = useTuningPickable("cover-teaser-right", { className: "md-cover-teaser-panel" });

  const [edgePulseKeys, setEdgePulseKeys] = useState(new Set());
  const [flashLeft, setFlashLeft] = useState(false);
  const [flashRight, setFlashRight] = useState(false);
  const loopId = useRef(0);

  useEffect(() => {
    if (!visible) {
      setEdgePulseKeys(new Set());
      setFlashLeft(false);
      setFlashRight(false);
      return;
    }

    const id = ++loopId.current;

    (async () => {
      while (id === loopId.current) {
        setEdgePulseKeys(new Set(["1-2"]));
        await wait(teaserCfg.loopInterval / 2);
        if (id !== loopId.current) return;
        setEdgePulseKeys(new Set(["1-2", "2-4"]));
        await wait(teaserCfg.loopInterval / 2);
      }
    })();

    (async () => {
      while (id === loopId.current) {
        setFlashLeft(true);
        setFlashRight(false);
        await wait(teaserCfg.flashInterval / 2);
        if (id !== loopId.current) return;
        setFlashLeft(false);
        setFlashRight(true);
        await wait(teaserCfg.flashInterval / 2);
      }
    })();

    return () => {
      loopId.current += 1;
    };
  }, [visible, teaserCfg.loopInterval, teaserCfg.flashInterval]);

  return (
    <div className={`md-cover-teaser-row ${visible ? "md-cover-teaser-row--visible" : ""}`} aria-hidden={!visible}>
      <motion.div
        className="md-cover-teaser-panel-wrap"
        initial={false}
        animate={
          visible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: teaserCfg.panelEnterY }
        }
        transition={{ duration: teaserCfg.panelDuration, ease: EASE }}
      >
        <article
          data-card="topdown"
          {...(debug ? leftPanelPick : { className: "md-cover-teaser-panel" })}
        >
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
      </motion.div>

      <motion.div
        className="md-cover-teaser-panel-wrap"
        initial={false}
        animate={
          visible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: teaserCfg.panelEnterY }
        }
        transition={{
          duration: teaserCfg.panelDuration,
          delay: visible ? teaserCfg.panelStagger : 0,
          ease: EASE,
        }}
      >
        <article
          data-card="bottomup"
          {...(debug ? rightPanelPick : { className: "md-cover-teaser-panel" })}
        >
          <h3 className="md-cover-teaser-panel__title">{copy.summaryBottomPanelTitle}</h3>
          <div className="md-cover-teaser-panel__body">
            <div className="md-cover-teaser-diagram md-cover-teaser-diagram--schematic">
              <SubtreeSchematic
                flashLeft={flashLeft}
                flashRight={flashRight}
                annotations={visible ? STATIC_ANNOTATIONS : []}
              />
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
