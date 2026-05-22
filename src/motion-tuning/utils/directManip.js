import { formatCssVarValue, parseCssVarNumber } from "../schema/cssVar.js";

export function resolveManipConfig(manipRegistry, groupId, pickRole) {
  const entry = manipRegistry?.[groupId];
  if (!entry) return null;
  if (entry.scale || entry.drag) return entry;
  if (pickRole && entry[pickRole]) return entry[pickRole];
  return entry.default ?? null;
}

export function readCssNumber(ctx, key) {
  const vars = ctx.getCssVars?.() ?? ctx.live[ctx.cssVarsBlock];
  return parseCssVarNumber(key, vars[key]);
}

export function applyScale(ctx, scaleSpec, deltaY) {
  const current = readCssNumber(ctx, scaleSpec.key);
  const damped = Math.sign(deltaY) * Math.min(Math.abs(deltaY), 60);
  const factor = 1 - damped * 0.00025;
  const next = Math.min(scaleSpec.max, Math.max(scaleSpec.min, current * factor));
  ctx.updateCssVar(scaleSpec.key, String(parseFloat(next.toFixed(4))));
}

export function applyDragDelta(ctx, dragSpec, focusTarget, dx, dy) {
  const unitRules = ctx.cssVarUnitRules;

  if (dragSpec.type === "css") {
    const axes = dragSpec.axes ?? ["x", "y"];
    if (axes.includes("x") && dragSpec.keys[0]) {
      const key = dragSpec.keys[0];
      const next = readCssNumber(ctx, key) + dx;
      ctx.updateCssVar(key, formatCssVarValue(key, Math.round(next), unitRules));
    }
    if (axes.includes("y")) {
      const key = axes.length === 1 && axes[0] === "y" ? dragSpec.keys[0] : dragSpec.keys[1];
      if (key) {
        const next = readCssNumber(ctx, key) + dy;
        ctx.updateCssVar(key, formatCssVarValue(key, Math.round(next), unitRules));
      }
    }
    return;
  }

  if (dragSpec.type === "array") {
    const block = dragSpec.block;
    const nodeId = focusTarget?.nodeId;
    if (!block || !nodeId) return;
    const index = (ctx.live[block] || []).findIndex((item) => item.id === nodeId);
    if (index < 0) return;
    const item = ctx.live[block][index];
    if (dragSpec.keys[0]) {
      ctx.updateArrayField(block, index, dragSpec.keys[0], (item[dragSpec.keys[0]] ?? 0) + dx);
    }
    if (dragSpec.keys[1]) {
      ctx.updateArrayField(block, index, dragSpec.keys[1], (item[dragSpec.keys[1]] ?? 0) + dy);
    }
  }
}

export function findPickTargetFromEvent(event) {
  const path = event.composedPath?.() ?? [];
  let fallback = null;
  for (const node of path) {
    if (!(node instanceof Element) || !node.hasAttribute("data-tuning-target")) continue;
    if (node.dataset.tuningPickPriority === "low") {
      fallback = node;
      continue;
    }
    return node;
  }
  return fallback ?? event.target?.closest?.("[data-tuning-target]") ?? null;
}
