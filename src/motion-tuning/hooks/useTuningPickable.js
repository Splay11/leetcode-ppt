import { useAnimTuning } from "../context/AnimTuningContext.jsx";
import { applyPickSelection, mergePickable } from "../utils/pickable.js";

export function useTuningPickable(groupId, opts = {}) {
  const ctx = useAnimTuning();
  if (!ctx?.enabled) {
    return { className: opts.className ?? "" };
  }
  const props = mergePickable(groupId, opts);
  return applyPickSelection(props, ctx.focusTarget, groupId, opts);
}
