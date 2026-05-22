/** CSS 变量读写：field.unit > unitRules > 名称启发式 */

export function cssVarUnit(name, unitRules) {
  if (unitRules?.[name]) return unitRules[name];
  if (name.endsWith("-left") && name.includes("badge")) return "%";
  if (name.includes("card-top") || name.includes("card-left")) return "%";
  if (name.includes("tree-scale")) return "";
  if (name.includes("badge") && name.endsWith("-top")) return "px";
  if (name.includes("scale") && !name.includes("shift")) return "";
  return "px";
}

export function formatCssVarValue(name, num, unitRules, fieldUnit) {
  const unit = fieldUnit ?? unitRules?.[name] ?? cssVarUnit(name, unitRules);
  if (unit === "%") return `${num}%`;
  if (unit === "px") return `${num}px`;
  return String(num);
}

export function parseCssVarNumber(name, value) {
  if (typeof value === "number") return value;
  const s = String(value).trim();
  if (s.endsWith("px")) return parseFloat(s);
  if (s.endsWith("%")) return parseFloat(s);
  return parseFloat(s) || 0;
}
