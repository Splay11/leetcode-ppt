export function applyDeckCssVars(el, vars) {
  if (!el || !vars) return;
  Object.entries(vars).forEach(([name, value]) => {
    el.style.setProperty(name, String(value));
  });
}
