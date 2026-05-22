export function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function deepCloneConfig(value) {  return JSON.parse(JSON.stringify(value));
}
