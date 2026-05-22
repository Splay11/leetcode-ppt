import { compileManipRegistry } from "../schema/compileManipRegistry.js";
import { buildFieldUnits } from "../schema/buildFieldUnits.js";

const DEFAULT_SAVE_URL = "http://127.0.0.1:3847/save-tuning";
const DEFAULT_IGNORE =
  ".md-anim-tuning-focus, .md-progress-dock, .md-anim-tuning, [data-tuning-ignore], button";

/**
 * 课件接入工厂 — 新 PPT 复制此结构即可
 *
 * @param {object} opts
 * @param {string} opts.id - 课件唯一 id（保存 payload、playback key）
 * @param {() => object} opts.cloneConfig
 * @param {object} opts.staticConfig - animConfig 模块 namespace
 * @param {object} opts.slideTuning - SLIDE_TUNING schema
 * @param {(node: HTMLElement, vars: object) => void} opts.applyCssVars
 * @param {string} opts.configPath - 相对项目根，保存写入目标
 * @param {string} [opts.cssVarsBlock='DECK_CSS_VARS']
 */
export function createDeckTuning({
  id,
  cloneConfig,
  staticConfig,
  slideTuning,
  applyCssVars,
  configPath,
  cssVarsBlock = "DECK_CSS_VARS",
  saveUrl = DEFAULT_SAVE_URL,
  playbackStorageKey,
  deckTuningClass = "mt-deck--tuning",
  shellClassName = "mt-debug-shell",
  htmlDocumentClass = "has-motion-tuning",
  ignoreClickSelector = DEFAULT_IGNORE,
  cssVarUnitRules,
  manipRegistry,
}) {
  if (!id) throw new Error("createDeckTuning: id is required");
  if (!configPath) throw new Error("createDeckTuning: configPath is required");

  const fieldUnits = buildFieldUnits(slideTuning);

  return {
    id,
    cloneConfig,
    staticConfig,
    slideTuning,
    manipRegistry: manipRegistry ?? compileManipRegistry(slideTuning),
    applyCssVars,
    configPath,
    cssVarsBlock,
    saveUrl,
    playbackStorageKey: playbackStorageKey ?? `motion-tuning-${id}-playback`,
    deckTuningClass,
    shellClassName,
    htmlDocumentClass,
    ignoreClickSelector,
    cssVarUnitRules: { ...fieldUnits, ...cssVarUnitRules },
  };
}
