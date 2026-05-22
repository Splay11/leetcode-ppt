import { SUMMARY_TIMING } from "../animConfig.js";
import { DECK_TEXT } from "../animConfig.js";

const LEFT_ANCHOR = { x1: 240, y1: 283, x2: 388, y2: 94 };
const RIGHT_ANCHOR = { x1: 560, y1: 283, x2: 412, y2: 94 };

const ms = (m) => Math.round((m / 1000) * 30);

/** 根据 segment 内 localFrame 计算 Summary 页视觉状态 */
export function computeSummaryState(step, localFrame) {
  const copy = DECK_TEXT;
  const base = {
    step,
    edgePulseKeys: new Set(),
    topBadge: "",
    bottomBadge: "",
    flashLeft: false,
    flashRight: false,
    annotations: [],
    panelFlashTop: false,
    panelFlashBottom: false,
  };

  if (step <= 0) return base;

  if (step >= 1) {
    base.topBadge = copy.summaryTopBadge;
  }
  if (step >= 2) {
    base.bottomBadge = copy.summaryBottomBadge;
    base.annotations = [
      { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
      { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
    ];
  }

  if (step === 1) {
    const t0 = 0;
    const t1 = t0 + ms(SUMMARY_TIMING.panelFlash);
    const t2 = t1 + ms(SUMMARY_TIMING.edgePulseFirst);
    const t3 = t2 + ms(SUMMARY_TIMING.edgePulseSecond);
    const t4 = t3 + ms(SUMMARY_TIMING.badgePopDelay);

    if (localFrame < t1) {
      base.panelFlashTop = true;
      base.topBadge = "";
    } else if (localFrame < t2) {
      base.edgePulseKeys = new Set(["1-2"]);
      base.topBadge = "";
    } else if (localFrame < t3) {
      base.edgePulseKeys = new Set(["1-2", "2-4"]);
      base.topBadge = "";
    } else if (localFrame < t4) {
      base.topBadge = "";
    }
  }

  if (step === 2) {
    const t0 = 0;
    const t1 = t0 + ms(SUMMARY_TIMING.panelFlash);
    const t2 = t1 + ms(SUMMARY_TIMING.flashLeft);
    const t3 = t2 + ms(SUMMARY_TIMING.annoBlue);
    const t4 = t3 + ms(SUMMARY_TIMING.flashRight);
    const t5 = t4 + ms(SUMMARY_TIMING.badgeFinalDelay);

    base.annotations = [];
    base.bottomBadge = "";

    if (localFrame < t1) {
      base.panelFlashBottom = true;
    } else if (localFrame < t2) {
      base.flashLeft = true;
    } else if (localFrame < t3) {
      base.annotations = [
        { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
      ];
    } else if (localFrame < t4) {
      base.flashRight = true;
      base.annotations = [
        { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
      ];
    } else if (localFrame < t5) {
      base.annotations = [
        { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
        { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
      ];
    } else {
      base.bottomBadge = copy.summaryBottomBadge;
      base.annotations = [
        { id: "l", ...LEFT_ANCHOR, className: "md-anno-blue", markerEnd: "url(#md-arrow-blue)" },
        { id: "r", ...RIGHT_ANCHOR, className: "md-anno-gold", markerEnd: "url(#md-arrow-gold)" },
      ];
    }
  }

  return base;
}
