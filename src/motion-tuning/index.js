/**
 * motion-tuning — 可复用动画调试库
 *
 * 课件侧用 createDeckTuning() 生成 tuning 对象，
 * 并用 MotionTuningShell 包裹演示内容。
 */

export { MotionTuningShell } from "./MotionTuningShell.jsx";
export { AnimTuningFocusPanel } from "./MotionTuningShell.jsx";

export {
  AnimTuningProvider,
  useAnimTuning,
  useAnimBlock,
  useDeckCssVars,
} from "./context/AnimTuningContext.jsx";

export { createDeckTuning } from "./deck/createDeckTuning.js";
export { compileManipRegistry } from "./schema/compileManipRegistry.js";
export { buildFieldUnits } from "./schema/buildFieldUnits.js";
export {
  getSlideTimeline,
  isLayoutGroup,
  resolveGroup,
  clipsForPickGroup,
} from "./schema/timeline.js";

export { useTuningPickable } from "./hooks/useTuningPickable.js";
export { useTuningDirectManip } from "./hooks/useTuningDirectManip.js";
export { useTuningDeck } from "./hooks/useTuningDeck.js";
export { useTuningPlayback } from "./hooks/useTuningPlayback.js";

export {
  isPickFocused,
  tuningPickable,
  mergePickable,
  applyPickSelection,
} from "./utils/pickable.js";

export {
  buildSlideSavePayload,
  buildGroupSavePayload,
  getTuningMetaFromContext,
  postTuningSave,
  stashPlayback,
  popStashedPlayback,
} from "./utils/payload.js";

export {
  resolveManipConfig,
  findPickTargetFromEvent,
  applyScale,
  applyDragDelta,
} from "./utils/directManip.js";

export { isAnimDebugMode } from "./utils/debugMode.js";
export { clampNumber, deepCloneConfig } from "./utils/clone.js";

export { RANGE, SEC, MS, PX, PCT, PCT0, SCALE, FONT } from "./schema/fieldPresets.js";
export { cssVarUnit, formatCssVarValue, parseCssVarNumber } from "./schema/cssVar.js";

export { default as AnimTuningPanel } from "./components/AnimTuningPanel.jsx";
export { default as TuningGroupFields } from "./components/TuningGroupFields.jsx";
