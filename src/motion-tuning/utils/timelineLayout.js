import { resolveGapField, resolveGroup } from "../schema/timeline.js";
import { parseCssVarNumber } from "../schema/cssVar.js";

const MS_TIMING_KEY =
  /^(panelFlash|enterNode|enterEdge|leaveEdge|leafFlashLoop|edgePulseFirst|edgePulseSecond|flashLeft|flashRight|annoBlue|badgePopDelay|badgeFinalDelay)$/i;

/** 从 live 配置读取字段数值 */
export function readFieldValue(group, fieldKey, live, cssVarsBlock) {
  if (!group) return 0;
  if (group.kind === "css") {
    return parseCssVarNumber(fieldKey, live[cssVarsBlock]?.[fieldKey]);
  }
  return live[group.block]?.[fieldKey];
}

/** 字段值 → 毫秒（用于估算条带长度） */
export function fieldValueToMs(group, fieldKey, value) {
  if (value == null || Number.isNaN(Number(value))) return 0;
  const num = Number(value);
  if (group.role === "timing" || MS_TIMING_KEY.test(fieldKey)) return num;
  if (/duration/i.test(fieldKey)) return num * 1000;
  return 0;
}

/** 估算单个 clip 的持续时长 (ms) */
export function inferClipDurationMs(clip, slideMeta, live, cssVarsBlock) {
  const group = resolveGroup(slideMeta, clip.groupId);
  if (!group) return 400;

  const keys = clip.fieldKeys ?? Object.keys(group.fields ?? {});
  let maxMs = 0;
  let sumMs = 0;

  keys.forEach((key) => {
    const ms = fieldValueToMs(group, key, readFieldValue(group, key, live, cssVarsBlock));
    maxMs = Math.max(maxMs, ms);
    sumMs += ms;
  });

  let base = 0;
  if (clip.durationMode === "sum") base = sumMs;
  else if (maxMs > 0) base = maxMs;
  else base = clip.durationFallbackMs ?? 400;

  const multiplier = clip.durationMultiplier ?? 1;
  return Math.max(80, Math.round(base * multiplier));
}

export function readGapDurationMs(slideMeta, gap, live) {
  const resolved = resolveGapField(slideMeta, gap);
  if (!resolved) return 0;
  const value = live[resolved.group.block]?.[resolved.key];
  return Math.max(0, Number(value) || 0);
}

/**
 * 将 fragment 时间轴编译为水平泳道
 * segments 串联；segment 内 clips 并行（同一 startMs）
 */
export function compileTimelineLanes(timeline, slideMeta, live, cssVarsBlock = "DECK_CSS_VARS") {
  if (!timeline?.segments?.length) {
    return { lanes: [], totalMs: 0 };
  }

  const lanes = [];
  let cursorMs = 0;

  timeline.segments.forEach((segment, index) => {
    if (index > 0 && segment.afterMs) {
      const durationMs = readGapDurationMs(slideMeta, segment.afterMs, live);
      const resolved = resolveGapField(slideMeta, segment.afterMs);
      lanes.push({
        id: `gap-${segment.id}`,
        kind: "gap",
        title: resolved?.field?.label ?? "间隔等待",
        segmentTitle: segment.title,
        startMs: cursorMs,
        durationMs: durationMs || 80,
        gap: segment.afterMs,
      });
      cursorMs += durationMs || 80;
    }

    const clipStartMs = cursorMs;
    let segmentEndMs = clipStartMs;

    (segment.clips ?? []).forEach((clip) => {
      const durationMs = inferClipDurationMs(clip, slideMeta, live, cssVarsBlock);
      const endMs = clipStartMs + durationMs;
      segmentEndMs = Math.max(segmentEndMs, endMs);

      lanes.push({
        id: clip.id,
        kind: "clip",
        title: clip.title,
        segmentTitle: segment.title,
        startMs: clipStartMs,
        durationMs,
        clip,
        pickGroupId: clip.pickGroupId ?? clip.groupId,
      });
    });

    cursorMs = segmentEndMs;
  });

  const totalMs = Math.max(cursorMs, 80);
  return { lanes, totalMs };
}

export const TIMELINE_MS_PER_PX = 4;

export function msToPx(ms) {
  return ms / TIMELINE_MS_PER_PX;
}

export function pxToMs(px) {
  return px * TIMELINE_MS_PER_PX;
}
