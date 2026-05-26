import { createDeckTuning } from "../../motion-tuning/deck/createDeckTuning.js";
import { cloneAnimConfig } from "./animConfig.js";
import * as animConfigStatic from "./animConfig.js";
import { applyDeckCssVars } from "./deckTheme.js";
import { SLIDE_TUNING } from "./animTuningRegistry.js";

export const invertBinaryTreeTuning = createDeckTuning({
  id: "invertBinaryTree",
  cloneConfig: cloneAnimConfig,
  staticConfig: animConfigStatic,
  slideTuning: SLIDE_TUNING,
  applyCssVars: applyDeckCssVars,
  configPath: "src/motion/invertBinaryTree/animConfig.js",
  cssVarsBlock: "DECK_CSS_VARS",
  playbackStorageKey: "ibt-invert-binary-tree-playback",
  deckTuningClass: "ibt-deck--tuning",
  shellClassName: "ibt-debug-shell",
  htmlDocumentClass: "has-motion-tuning",
});
