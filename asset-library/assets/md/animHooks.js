import * as animConfig from "./animConfig.js";
import { useAnimBlock as useAnimBlockBase, useDeckCssVars as useDeckCssVarsBase } from "@motion-tuning";

/** maxDepth 专用：Provider 外也能读到 animConfig 默认值 */
export function useAnimBlock(blockName) {
  return useAnimBlockBase(blockName, animConfig[blockName]);
}

export function useDeckCssVars() {
  return useDeckCssVarsBase(animConfig.DECK_CSS_VARS);
}

export { useAnimTuning } from "@motion-tuning";
