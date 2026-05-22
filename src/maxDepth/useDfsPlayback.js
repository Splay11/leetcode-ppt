import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useAnimBlock } from "./animHooks.js";

export function useDfsPlayback(steps, stepCount, animateForward) {
  const timing = useAnimBlock("DFS_TIMING");
  const [highlighted, setHighlighted] = useState(() => new Set());
  const [activeEdges, setActiveEdges] = useState(() => new Set());
  const [badges, setBadges] = useState(() => ({}));
  const [maxDepth, setMaxDepth] = useState(0);
  const [depthCardVisible, setDepthCardVisible] = useState(false);
  const [flashPath, setFlashPath] = useState(null);
  const [pulseNodes, setPulseNodes] = useState(() => new Set());
  const prevStep = useRef(stepCount);

  const applyStatic = (target) => {
    const hi = new Set();
    const edges = new Set();
    const badgeMap = {};
    let md = 0;
    let cardVisible = false;

    for (let i = 0; i < target && i < steps.length; i += 1) {
      const e = steps[i];
      switch (e.type) {
        case "enter_node":
          hi.add(e.nodeId);
          badgeMap[e.nodeId] = e.depth;
          break;
        case "enter_edge":
          edges.add(`${e.fromId}-${e.toId}`);
          break;
        case "leaf_flash":
          if (e.depth > md) md = e.depth;
          cardVisible = true;
          break;
        case "leave_node":
          hi.delete(e.nodeId);
          delete badgeMap[e.nodeId];
          break;
        case "leave_edge":
          edges.delete(`${e.fromId}-${e.toId}`);
          break;
        default:
          break;
      }
    }

    setHighlighted(hi);
    setActiveEdges(edges);
    setBadges({ ...badgeMap });
    setMaxDepth(md);
    setDepthCardVisible(cardVisible);
    setFlashPath(null);
    setPulseNodes(new Set());
  };

  const runForwardStep = async (index) => {
    const e = steps[index];
    if (!e) return;

    switch (e.type) {
      case "enter_node":
        setHighlighted((prev) => new Set(prev).add(e.nodeId));
        setBadges((prev) => ({ ...prev, [e.nodeId]: e.depth }));
        setPulseNodes(new Set([e.nodeId]));
        await wait(timing.enterNode);
        setPulseNodes(new Set());
        break;
      case "enter_edge":
        setActiveEdges((prev) => new Set(prev).add(`${e.fromId}-${e.toId}`));
        await wait(timing.enterEdge);
        break;
      case "leaf_flash":
        setFlashPath(e.path);
        for (let loop = 0; loop < 3; loop += 1) {
          await wait(timing.leafFlashLoop);
        }
        setFlashPath(null);
        setMaxDepth((prev) => Math.max(prev, e.depth));
        setDepthCardVisible(true);
        break;
      case "leave_node":
        setBadges((prev) => {
          const next = { ...prev };
          delete next[e.nodeId];
          return next;
        });
        setHighlighted((prev) => {
          const next = new Set(prev);
          next.delete(e.nodeId);
          return next;
        });
        break;
      case "leave_edge":
        setActiveEdges((prev) => {
          const next = new Set(prev);
          next.delete(`${e.fromId}-${e.toId}`);
          return next;
        });
        await wait(timing.leaveEdge);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const prev = prevStep.current;
    if (stepCount === prev) return;

    if (animateForward && stepCount === prev + 1) {
      runForwardStep(stepCount - 1);
    } else {
      applyStatic(stepCount);
    }
    prevStep.current = stepCount;
  }, [stepCount, animateForward, steps, timing]);

  return { highlighted, activeEdges, badges, maxDepth, depthCardVisible, flashPath, pulseNodes };
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function popBadge(el, utils) {
  if (!el || !utils) return;
  await animate(
    el,
    { scale: [0.88, utils.popBadgeScaleMid, 1], opacity: [0, 1] },
    { duration: utils.popBadgeDuration, ease: [0.16, 1, 0.3, 1] },
  );
}

export async function flashPanel(el, ms = 520) {
  if (!el) return;
  el.classList.add("md-panel-flash");
  await wait(ms);
  el.classList.remove("md-panel-flash");
}
