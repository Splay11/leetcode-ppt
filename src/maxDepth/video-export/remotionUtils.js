export function frameProgress(localFrame, start, end) {
  if (localFrame <= start) return 0;
  if (localFrame >= end) return 1;
  return (localFrame - start) / (end - start);
}
export function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
export function lerp(a, b, t) { return a + (b - a) * t; }
