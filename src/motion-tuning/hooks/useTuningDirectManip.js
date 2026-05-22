import { useEffect, useRef } from "react";
import { useAnimTuning } from "../context/AnimTuningContext.jsx";
import {
  applyDragDelta,
  applyScale,
  findPickTargetFromEvent,
  resolveManipConfig,
} from "../utils/directManip.js";

export function useTuningDirectManip(deckRef, enabled, deckReady, ignoreClickSelector) {
  const ctx = useAnimTuning();
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  const dragRef = useRef(null);
  const wheelActiveRef = useRef(false);
  const wheelTimerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !deckReady) return undefined;
    const deck = deckRef.current;
    if (!deck) return undefined;

    const getCtx = () => ctxRef.current;

    const getManip = () => {
      const c = getCtx();
      const focus = c?.focusTarget;
      if (!focus?.groupId) return null;
      return resolveManipConfig(c.manipRegistry, focus.groupId, focus.pickRole);
    };

    const onWheel = (e) => {
      const c = getCtx();
      if (!e.ctrlKey || !c?.focusTarget?.groupId) return;
      const manip = getManip();
      if (!manip?.scale) return;
      e.preventDefault();
      if (!wheelActiveRef.current) {
        c.beginGesture();
        wheelActiveRef.current = true;
      }
      applyScale(c, manip.scale, e.deltaY);
      clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        getCtx()?.endGesture();
        wheelActiveRef.current = false;
      }, 220);
    };

    const onPointerDown = (e) => {
      const c = getCtx();
      if (!e.ctrlKey || e.button !== 0 || !c?.focusTarget?.groupId) return;
      const ignore =
        ignoreClickSelector ??
        ".md-anim-tuning-focus, .md-progress-dock, .md-anim-tuning, [data-tuning-ignore], button";
      if (ignore && e.target.closest(ignore)) return;
      const selected = deck.querySelector(".md-tuning-pick--selected");
      if (!selected) return;
      const hit = findPickTargetFromEvent(e);
      if (!hit || hit !== selected) return;

      const manip = getManip();
      if (!manip?.drag) return;

      e.preventDefault();
      dragRef.current = { lastX: e.clientX, lastY: e.clientY };
      c.beginGesture();
      deck.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      e.preventDefault();
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      const c = getCtx();
      const manip = getManip();
      if (!c || !manip?.drag) return;
      applyDragDelta(c, manip.drag, c.focusTarget, dx, dy);
    };

    const endDrag = (e) => {
      if (!dragRef.current) return;
      dragRef.current = null;
      getCtx()?.endGesture();
      try {
        deck.releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    deck.addEventListener("wheel", onWheel, { passive: false });
    deck.addEventListener("pointerdown", onPointerDown);
    deck.addEventListener("pointermove", onPointerMove);
    deck.addEventListener("pointerup", endDrag);
    deck.addEventListener("pointercancel", endDrag);

    return () => {
      clearTimeout(wheelTimerRef.current);
      if (wheelActiveRef.current) {
        wheelActiveRef.current = false;
        getCtx()?.endGesture();
      }
      deck.removeEventListener("wheel", onWheel);
      deck.removeEventListener("pointerdown", onPointerDown);
      deck.removeEventListener("pointermove", onPointerMove);
      deck.removeEventListener("pointerup", endDrag);
      deck.removeEventListener("pointercancel", endDrag);
    };
  }, [enabled, deckReady, deckRef, ignoreClickSelector]);
}
