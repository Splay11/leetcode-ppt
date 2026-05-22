import { useEffect, useRef, useState } from "react";
import { AnimTuningProvider } from "./context/AnimTuningContext.jsx";
import AnimTuningPanel from "./components/AnimTuningPanel.jsx";
import { isAnimDebugMode } from "./utils/debugMode.js";

import "./styles/motion-tuning.css";

function toDocumentClassTokens(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(/\s+/).filter(Boolean);
}

/**
 * 动画调试外壳：Provider + 底部总面板
 *
 * @param {object} props.tuning - createDeckTuning() 返回值
 * @param {boolean} [props.enabled] - 默认读取 URL ?debug=1
 */
export function MotionTuningShell({
  tuning,
  enabled = isAnimDebugMode(),
  children,
}) {
  const htmlDocumentClass = tuning.htmlDocumentClass ?? "has-motion-tuning";
  const shellClassName = tuning.shellClassName ?? "mt-debug-shell";
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [deckScale, setDeckScale] = useState(1);
  const deckViewportRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const tokens = toDocumentClassTokens(htmlDocumentClass);
    if (!tokens.length) return undefined;
    document.documentElement.classList.add(...tokens);
    return () => document.documentElement.classList.remove(...tokens);
  }, [enabled, htmlDocumentClass]);

  useEffect(() => {
    if (!enabled) return undefined;
    const viewport = deckViewportRef.current;
    if (!viewport) return undefined;

    const updateScale = () => {
      const heightScale = viewport.clientHeight / window.innerHeight;
      const widthScale = viewport.clientWidth / window.innerWidth;
      setDeckScale(Math.min(1, heightScale, widthScale));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(viewport);
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [enabled, panelExpanded]);

  const shellClass = enabled ? shellClassName : undefined;

  return (
    <AnimTuningProvider
      enabled={enabled}
      cloneConfig={tuning.cloneConfig}
      staticConfig={tuning.staticConfig}
      slideTuning={tuning.slideTuning}
      manipRegistry={tuning.manipRegistry}
      applyCssVars={tuning.applyCssVars}
      saveUrl={tuning.saveUrl}
      playbackStorageKey={tuning.playbackStorageKey}
      cssVarUnitRules={tuning.cssVarUnitRules}
      cssVarsBlock={tuning.cssVarsBlock}
      deckId={tuning.id}
      configPath={tuning.configPath}
      ignoreClickSelector={tuning.ignoreClickSelector}
    >
      {enabled ? (
        <div
          className={shellClass}
          style={{ "--md-deck-fit-scale": deckScale }}
        >
          <div ref={deckViewportRef} className="mt-debug-deck-viewport">
            <div className="mt-debug-deck-stage">{children}</div>
          </div>
          <AnimTuningPanel
            expanded={panelExpanded}
            onToggleExpanded={() => setPanelExpanded((open) => !open)}
          />
        </div>
      ) : (
        children
      )}
    </AnimTuningProvider>
  );
}

import AnimTuningFocusPanel from "./components/AnimTuningFocusPanel.jsx";

export { AnimTuningFocusPanel };
