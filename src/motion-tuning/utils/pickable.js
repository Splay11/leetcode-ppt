/** data-tuning-target 标记（课件在 DOM 上挂载，库负责选中态与交互） */

export function isPickFocused(focus, groupId, { nodeId, pickRole } = {}) {
  if (!focus || focus.groupId !== groupId) return false;
  if ((nodeId ?? null) !== (focus.nodeId ?? null)) return false;
  if ((pickRole ?? null) !== (focus.pickRole ?? null)) return false;
  return true;
}

export function tuningPickable(
  groupId,
  { nodeId, pickRole, pickPriority, className = "" } = {},
) {
  const pickClass = "md-tuning-pick";
  return {
    "data-tuning-target": groupId,
    ...(nodeId ? { "data-tuning-node": nodeId } : {}),
    ...(pickRole ? { "data-tuning-pick-role": pickRole } : {}),
    ...(pickPriority ? { "data-tuning-pick-priority": pickPriority } : {}),
    className: className ? `${className} ${pickClass}` : pickClass,
  };
}

export function mergePickable(groupId, opts, ...classes) {
  const props = tuningPickable(groupId, opts);
  const extra = classes.filter(Boolean).join(" ");
  if (extra) props.className = `${props.className} ${extra}`.trim();
  return props;
}

export function applyPickSelection(props, focus, groupId, opts = {}) {
  if (!isPickFocused(focus, groupId, opts)) return props;
  return {
    ...props,
    className: `${props.className} md-tuning-pick--selected`.trim(),
  };
}
