/** 将 animConfig.DECK_CSS_VARS 注入 .md-deck（布局/字号类参数的唯一运行时入口） */

export function applyDeckCssVars(el, vars) {
  if (!el || !vars) return;
  Object.entries(vars).forEach(([name, value]) => {
    el.style.setProperty(name, String(value));
  });
}
