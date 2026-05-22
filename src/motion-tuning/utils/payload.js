import { deepCloneConfig } from "./clone.js";
import {
  collectTimelineRefs,
  getSlideTimeline,
  resolveGroup,
} from "../schema/timeline.js";

const DEFAULT_SAVE_URL = "http://127.0.0.1:3847/save-tuning";

function resolveTuningMeta(tuningMeta = {}) {
  return {
    cssVarsBlock: tuningMeta.cssVarsBlock ?? "DECK_CSS_VARS",
    deckId: tuningMeta.deckId ?? null,
    configPath: tuningMeta.configPath ?? null,
  };
}

function applyGroupFieldsToPayload(group, fieldKeys, live, payload, cssVarsBlock) {
  const keys =
    fieldKeys instanceof Set ? [...fieldKeys] : fieldKeys ?? Object.keys(group.fields ?? {});

  if (group.textFields && group.textBlock) {
    if (!payload.blocks[group.textBlock]) payload.blocks[group.textBlock] = {};
    Object.keys(group.textFields).forEach((key) => {
      payload.blocks[group.textBlock][key] = live[group.textBlock]?.[key];
    });
  }

  if (group.layoutFields && group.layoutBlock) {
    const block = group.layoutBlock;
    if (block === cssVarsBlock) {
      Object.keys(group.layoutFields).forEach((key) => {
        payload.cssVars[key] = live[cssVarsBlock][key];
      });
    }
  }

  if (group.kind === "css") {
    keys.forEach((key) => {
      if (group.fields?.[key]) payload.cssVars[key] = live[cssVarsBlock][key];
    });
    return;
  }
  if (group.kind === "array") {
    payload.arrayBlocks[group.block] = live[group.block].map((item) => ({ ...item }));
    return;
  }
  if (!payload.blocks[group.block]) payload.blocks[group.block] = {};
  keys.forEach((key) => {
    if (group.fields?.[key]) payload.blocks[group.block][key] = live[group.block][key];
  });
}

function applyGroupToPayload(group, live, payload, cssVarsBlock) {
  applyGroupFieldsToPayload(group, null, live, payload, cssVarsBlock);
}

function withMeta(slideKey, payload, tuningMeta) {
  const meta = resolveTuningMeta(tuningMeta);
  return { slideKey, ...meta, ...payload };
}

export function buildSlideSavePayload(slideKey, live, slideTuning, tuningMeta) {
  const meta = slideTuning[slideKey];
  const payload = { blocks: {}, cssVars: {}, arrayBlocks: {} };
  if (!meta) return withMeta(slideKey, payload, tuningMeta);
  const { cssVarsBlock } = resolveTuningMeta(tuningMeta);
  meta.groups.forEach((group) => applyGroupToPayload(group, live, payload, cssVarsBlock));
  return withMeta(slideKey, payload, tuningMeta);
}

export function buildGroupSavePayload(slideKey, groupId, live, slideTuning, tuningMeta) {
  const group = slideTuning[slideKey]?.groups?.find((g) => g.id === groupId);
  const payload = { blocks: {}, cssVars: {}, arrayBlocks: {} };
  if (!group) return withMeta(slideKey, payload, tuningMeta);
  applyGroupToPayload(group, live, payload, resolveTuningMeta(tuningMeta).cssVarsBlock);
  return withMeta(slideKey, payload, tuningMeta);
}

/** 仅保存当前 fragment 时间轴上引用的动画/时序字段 */
export function buildTimelineSavePayload(
  slideKey,
  fragment,
  live,
  slideTuning,
  tuningMeta,
) {
  const slideMeta = slideTuning[slideKey];
  const timeline = getSlideTimeline(slideMeta, fragment);
  const payload = { blocks: {}, cssVars: {}, arrayBlocks: {} };
  if (!slideMeta || !timeline) return withMeta(slideKey, payload, tuningMeta);

  const { cssVarsBlock } = resolveTuningMeta(tuningMeta);
  collectTimelineRefs(timeline).forEach((fieldKeys, groupId) => {
    const group = resolveGroup(slideMeta, groupId);
    if (group) applyGroupFieldsToPayload(group, fieldKeys, live, payload, cssVarsBlock);
  });
  return withMeta(slideKey, payload, tuningMeta);
}

export function applyGroupFieldDefaults(
  live,
  group,
  fieldKeys,
  defaults,
  cssVarsBlock = "DECK_CSS_VARS",
) {
  const keys =
    fieldKeys instanceof Set ? [...fieldKeys] : fieldKeys ?? Object.keys(group.fields ?? {});

  if (group.textFields && group.textBlock && defaults[group.textBlock]) {
    Object.keys(group.textFields).forEach((key) => {
      live[group.textBlock][key] = defaults[group.textBlock][key];
    });
  }

  if (group.layoutFields && group.layoutBlock && defaults[group.layoutBlock]) {
    Object.keys(group.layoutFields).forEach((key) => {
      live[group.layoutBlock][key] = defaults[group.layoutBlock][key];
    });
  }

  if (group.kind === "css") {
    keys.forEach((key) => {
      if (group.fields?.[key]) live[cssVarsBlock][key] = defaults[cssVarsBlock][key];
    });
    return;
  }
  if (group.kind === "array") {
    live[group.block] = defaults[group.block].map((item) => ({ ...item }));
    return;
  }
  keys.forEach((key) => {
    if (group.fields?.[key]) live[group.block][key] = defaults[group.block][key];
  });
}

export function applyGroupDefaults(live, group, defaults, cssVarsBlock = "DECK_CSS_VARS") {
  applyGroupFieldDefaults(live, group, null, defaults, cssVarsBlock);
}

export function applyTimelineDefaults(
  live,
  slideMeta,
  fragment,
  defaults,
  cssVarsBlock = "DECK_CSS_VARS",
) {
  const timeline = getSlideTimeline(slideMeta, fragment);
  if (!timeline) return;
  collectTimelineRefs(timeline).forEach((fieldKeys, groupId) => {
    const group = resolveGroup(slideMeta, groupId);
    if (group) applyGroupFieldDefaults(live, group, fieldKeys, defaults, cssVarsBlock);
  });
}

export function mergeSavedIntoDefaults(defaults, payload, cssVarsBlock = "DECK_CSS_VARS") {
  const block = payload.cssVarsBlock ?? cssVarsBlock;
  const next = deepCloneConfig(defaults);
  if (payload.blocks) {
    Object.entries(payload.blocks).forEach(([name, values]) => {
      if (!next[name]) return;
      Object.assign(next[name], values);
    });
  }
  if (payload.cssVars) {
    Object.assign(next[block], payload.cssVars);
  }
  if (payload.arrayBlocks) {
    Object.entries(payload.arrayBlocks).forEach(([name, items]) => {
      next[name] = items.map((item) => ({ ...item }));
    });
  }
  return next;
}

export async function postTuningSave(payload, saveUrl = DEFAULT_SAVE_URL) {
  const res = await fetch(saveUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "保存失败");
  return data;
}

export function stashPlayback(playback, storageKey) {
  if (!playback || typeof sessionStorage === "undefined" || !storageKey) return;
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      slideIndex: playback.slideIndex,
      fragment: playback.fragment,
    }),
  );
}

export function popStashedPlayback(storageKey) {
  if (typeof sessionStorage === "undefined" || !storageKey) return null;
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return null;
  sessionStorage.removeItem(storageKey);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getTuningMetaFromContext(ctx) {
  if (!ctx) return {};
  return {
    cssVarsBlock: ctx.cssVarsBlock,
    deckId: ctx.deckId,
    configPath: ctx.configPath,
  };
}
