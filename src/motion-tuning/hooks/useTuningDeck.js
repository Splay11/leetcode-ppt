import { useCallback, useRef, useState } from "react";
import { useAnimTuning } from "../context/AnimTuningContext.jsx";
import { findPickTargetFromEvent } from "../utils/directManip.js";
import { useTuningDirectManip } from "./useTuningDirectManip.js";

/**
 * 课件 deck 容器：ref、点击选中、Ctrl+手势
 */
export function useTuningDeck({ deckId, ignoreClickSelector: ignoreOverride } = {}) {
  const tuning = useAnimTuning();
  const deckRef = useRef(null);
  const [deckReady, setDeckReady] = useState(false);
  const debug = tuning?.enabled;
  const resolvedDeckId = deckId ?? tuning?.deckId ?? "deck";
  const ignoreClickSelector = ignoreOverride ?? tuning?.ignoreClickSelector;

  const setDeckRef = useCallback(
    (node) => {
      deckRef.current = node;
      setDeckReady(Boolean(node));
      tuning?.setDeckNode?.(node);
    },
    [tuning?.setDeckNode],
  );

  useTuningDirectManip(deckRef, debug, deckReady, ignoreClickSelector);

  const handleDeckClick = useCallback(
    (e) => {
      if (!debug) return;
      if (ignoreClickSelector && e.target.closest(ignoreClickSelector)) return;
      const el = findPickTargetFromEvent(e);
      if (!el) {
        tuning.clearFocusTarget();
        return;
      }
      tuning.setFocusFromElement(el);
    },
    [debug, tuning, ignoreClickSelector],
  );

  return {
    deckRef,
    setDeckRef,
    debug,
    tuning,
    handleDeckClick,
    deckTuningAttrs: debug
      ? { "data-tuning-deck": resolvedDeckId }
      : {},
  };
}
