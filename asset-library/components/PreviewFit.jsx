import { useLayoutEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 880;
const PAD = 8;
const MIN = 12;
const DEFAULT_SCALE = 0.22;

/** 在离屏克隆上测量，不改动可见 DOM（避免测量时 zoom:1 闪原尺寸）。 */
function measureContentSize(source) {
  const host = document.createElement("div");
  host.className = "al-preview-fit-measure al-preview-context";
  host.style.cssText = [
    "position:fixed",
    "left:-16000px",
    "top:0",
    "visibility:hidden",
    "pointer-events:none",
    `width:${DESIGN_WIDTH}px`,
    "height:auto",
    "overflow:visible",
  ].join(";");

  host.appendChild(source.cloneNode(true));
  document.body.appendChild(host);
  void host.offsetHeight;

  const origin = host.getBoundingClientRect();
  let maxW = host.scrollWidth;
  let maxH = host.scrollHeight;

  const visit = (el) => {
    if (!(el instanceof Element)) return;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;
    const r = el.getBoundingClientRect();
    if (r.width < 0.5 && r.height < 0.5) return;
    maxW = Math.max(maxW, r.right - origin.left);
    maxH = Math.max(maxH, r.bottom - origin.top);
  };

  visit(host);
  host.querySelectorAll("*").forEach(visit);

  host.remove();

  return { w: maxW, h: maxH };
}

function shellSize(shell) {
  const rect = shell.getBoundingClientRect();
  return {
    w: shell.clientWidth || rect.width,
    h: shell.clientHeight || rect.height,
  };
}

const supportsZoom = typeof CSS !== "undefined" && CSS.supports?.("zoom", "1");

export default function PreviewFit({ children }) {
  const shellRef = useRef(null);
  const innerRef = useRef(null);
  const [fit, setFit] = useState(null);
  const rafRef = useRef(0);

  useLayoutEffect(() => {
    let alive = true;
    let retries = 0;

    const run = () => {
      if (!alive) return;

      const shell = shellRef.current;
      const inner = innerRef.current;
      if (!shell || !inner) return;

      const { w: shellW, h: shellH } = shellSize(shell);
      if (shellW < MIN || shellH < MIN) {
        if (retries < 50) {
          retries += 1;
          rafRef.current = requestAnimationFrame(run);
        }
        return;
      }

      const { w, h } = measureContentSize(inner);
      if (w < MIN || h < MIN) {
        if (retries < 50) {
          retries += 1;
          rafRef.current = requestAnimationFrame(run);
        } else {
          const fallback = Math.min((shellW - PAD) / DESIGN_WIDTH, (shellH - PAD) / 320);
          setFit({ scale: fallback, boxW: shellW - PAD, boxH: shellH - PAD });
        }
        return;
      }

      const scale = Math.min((shellW - PAD) / w, (shellH - PAD) / h);
      if (!Number.isFinite(scale) || scale <= 0) return;

      setFit({ scale, boxW: w * scale, boxH: h * scale });
      retries = 0;
    };

    run();

    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(run);
    };

    const t1 = window.setTimeout(run, 0);
    const t2 = window.setTimeout(run, 120);
    window.addEventListener("load", run, { once: true });
    document.fonts?.ready?.then(run);

    const shell = shellRef.current;
    const ro = new ResizeObserver(run);
    if (shell) ro.observe(shell);

    const io =
      shell && "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) run();
          })
        : null;
    if (shell && io) io.observe(shell);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      io?.disconnect();
    };
  }, [children]);

  const scale = fit?.scale ?? DEFAULT_SCALE;
  const innerStyle = {
    width: DESIGN_WIDTH,
    ...(supportsZoom
      ? { zoom: scale }
      : {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }),
  };

  return (
    <div className="al-preview-fit" ref={shellRef}>
      {supportsZoom ? (
        <div ref={innerRef} className="al-preview-fit-inner al-preview-context" style={innerStyle}>
          {children}
        </div>
      ) : (
        <div
          className="al-preview-fit-box"
          style={fit ? { width: fit.boxW, height: fit.boxH } : { width: DESIGN_WIDTH * scale, height: 120 * scale }}
        >
          <div ref={innerRef} className="al-preview-fit-inner al-preview-context" style={innerStyle}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
