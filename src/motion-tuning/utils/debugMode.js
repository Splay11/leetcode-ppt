export function isAnimDebugMode(param = "debug") {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  return q.get(param) === "1";
}
