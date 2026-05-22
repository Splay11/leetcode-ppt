import { createDeckTuning } from "../motion-tuning/deck/createDeckTuning.js";
import { cloneAnimConfig } from "./animConfig.js";
import * as animConfigStatic from "./animConfig.js";
import { applyDeckCssVars } from "./deckTheme.js";
import { SLIDE_TUNING } from "./animTuningRegistry.js";

/** maxDepth 课件 → motion-tuning 库的配置桥接 */
export const maxDepthTuning = createDeckTuning({
  id: "maxDepth",
  cloneConfig: cloneAnimConfig,
  staticConfig: animConfigStatic,
  slideTuning: SLIDE_TUNING,
  applyCssVars: applyDeckCssVars,
  configPath: "src/maxDepth/animConfig.js",
  cssVarsBlock: "DECK_CSS_VARS",
  playbackStorageKey: "md-max-depth-playback",
  deckTuningClass: "md-deck--tuning",
  shellClassName: "md-debug-shell",
  htmlDocumentClass: "has-motion-tuning",
});
