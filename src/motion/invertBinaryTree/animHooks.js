import * as animConfig from "./animConfig.js";
import { useAnimBlock as useAnimBlockBase, useDeckCssVars as useDeckCssVarsBase } from "@motion-tuning";

export function useAnimBlock(blockName) {
  return useAnimBlockBase(blockName, animConfig[blockName]);
}

export function useDeckCssVars() {
  return useDeckCssVarsBase(animConfig.DECK_CSS_VARS);
}

export { useAnimTuning } from "@motion-tuning";
