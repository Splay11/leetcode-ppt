/** 时间轴 schema 解析 */

export function getSlideTimeline(slideMeta, fragment) {
  if (!slideMeta?.timelines) return null;
  const key = String(fragment);
  return slideMeta.timelines[key] ?? slideMeta.timelines[fragment] ?? null;
}

export function isLayoutGroup(group) {
  if (!group) return false;
  if (group.role === "timing") return false;
  if (group.layoutSlug || group.role === "layout") return true;
  if (group.kind === "css" || group.kind === "array") return true;
  return false;
}

export function resolveGroup(slideMeta, groupId) {
  return slideMeta?.groups?.find((g) => g.id === groupId) ?? null;
}

/** 从 clip 描述生成用于 TuningGroupFields 的临时 group（字段子集） */
export function resolveClipGroup(slideMeta, clip) {
  const base = resolveGroup(slideMeta, clip.groupId);
  if (!base) return null;

  const keys = clip.fieldKeys ?? Object.keys(base.fields ?? {});
  const fields = {};
  keys.forEach((key) => {
    if (base.fields?.[key]) fields[key] = base.fields[key];
  });

  if (!Object.keys(fields).length) return null;

  return {
    ...base,
    id: clip.id,
    title: clip.title,
    fields,
  };
}

export function resolveGapField(slideMeta, gap) {
  if (!gap?.groupId || !gap?.key) return null;
  const group = resolveGroup(slideMeta, gap.groupId);
  if (!group?.fields?.[gap.key]) return null;
  return { group, key: gap.key, field: group.fields[gap.key] };
}

export function clipsForPickGroup(timeline, pickGroupId) {
  if (!timeline?.segments || !pickGroupId) return [];
  const titles = [];
  timeline.segments.forEach((seg) => {
    seg.clips?.forEach((clip) => {
      if (clip.pickGroupId === pickGroupId || clip.groupId === pickGroupId) {
        titles.push(clip.title);
      }
    });
  });
  return titles;
}

/** 收集当前时间轴引用的 groupId → fieldKey 集合（clips + segment.afterMs） */
export function collectTimelineRefs(timeline) {
  const groupFields = new Map();
  if (!timeline?.segments) return groupFields;

  const add = (groupId, key) => {
    if (!groupId || !key) return;
    if (!groupFields.has(groupId)) groupFields.set(groupId, new Set());
    groupFields.get(groupId).add(key);
  };

  timeline.segments.forEach((seg) => {
    seg.clips?.forEach((clip) => {
      const keys = clip.fieldKeys ?? [];
      keys.forEach((key) => add(clip.groupId, key));
    });
    if (seg.afterMs) add(seg.afterMs.groupId, seg.afterMs.key);
  });

  return groupFields;
}
