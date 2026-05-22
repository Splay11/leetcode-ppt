/** 从 slideTuning schema 编译 Ctrl+滚轮/拖动映射（单源，避免 manipRegistry 漂移） */

function enrichManip(group, manip) {
  if (!manip) return manip;
  const next = { ...manip };
  if (next.drag?.type === "array" && !next.drag.block) {
    next.drag = { ...next.drag, block: group.block };
  }
  if (next.scale && next.scale.min == null) next.scale.min = 0.3;
  if (next.scale && next.scale.max == null) next.scale.max = 5;
  return next;
}

export function compileManipRegistry(slideTuning) {
  const registry = {};
  if (!slideTuning) return registry;

  Object.values(slideTuning).forEach((slide) => {
    slide.groups?.forEach((group) => {
      if (group.manip) {
        registry[group.id] = enrichManip(group, group.manip);
      }
      if (group.manipByRole) {
        registry[group.id] = {};
        Object.entries(group.manipByRole).forEach(([role, manip]) => {
          registry[group.id][role] = enrichManip(group, manip);
        });
      }
    });
  });

  return registry;
}
