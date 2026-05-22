import { PCT0, SCALE } from "@motion-tuning/schema/fieldPresets.js";

export function layoutLeftKey(slug) {
  return `--md-${slug}-left`;
}

export function layoutSizeKey(slug) {
  return `--md-${slug}-layout-size`;
}

export function layoutBaseFieldEntries(slug) {
  return {
    [layoutLeftKey(slug)]: PCT0("水平位置 (%)"),
    [layoutSizeKey(slug)]: SCALE("大小 (缩放)"),
  };
}

export function mergeLayoutBase(fields, slug) {
  return {
    ...layoutBaseFieldEntries(slug),
    ...fields,
  };
}

export function layoutBaseDefaults(slug, left = 50, size = 1) {
  return {
    [layoutLeftKey(slug)]: `${left}%`,
    [layoutSizeKey(slug)]: String(size),
  };
}

/** �?pickRole 的组：为每个 role 生成独立 left/size 字段前缀 */
export function mergeLayoutBaseByRoles(fields, groupId, roles) {
  const next = { ...fields };
  roles.forEach((role) => {
    Object.assign(next, layoutBaseFieldEntries(`${groupId}-${role}`));
  });
  return next;
}

export function resolveLayoutSlug(group, pickRole) {
  if (!group?.layoutSlug) return null;
  if (pickRole && group.layoutRoles?.includes(pickRole)) {
    return `${group.id}-${pickRole}`;
  }
  return group.layoutSlug;
}

/** 右下角面板应展示�?CSS 字段（按 pickRole 过滤 layout 前缀�?*/
export function filterFocusCssFields(group, pickRole) {
  if (!group?.fields) return {};
  const entries = Object.entries(group.fields);
  if (!pickRole || !group.layoutRoles?.length) {
    return Object.fromEntries(entries);
  }
  const rolePrefix = `--md-${group.id}-${pickRole}-`;
  const shared = entries.filter(([key]) => !key.startsWith(`--md-${group.id}-`) || key.startsWith(rolePrefix));
  const roleEntries = entries.filter(([key]) => key.startsWith(rolePrefix));
  const baseSlug = `${group.id}-${pickRole}`;
  const baseKeys = new Set([layoutLeftKey(baseSlug), layoutSizeKey(baseSlug)]);
  const merged = Object.fromEntries([
    ...entries.filter(([key]) => baseKeys.has(key)),
    ...roleEntries,
    ...shared.filter(([key]) => !baseKeys.has(key) && !key.startsWith(`--md-${group.id}-`)),
  ]);
  return merged;
}

export function getLayoutBaseFields(group, pickRole) {
  const slug = resolveLayoutSlug(group, pickRole);
  if (!slug) return {};
  return layoutBaseFieldEntries(slug);
}
