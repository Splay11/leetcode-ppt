import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CoverSlide from "./components/CoverSlide.jsx";
import SummarySlide from "./components/SummarySlide.jsx";
import DfsSlide from "./components/DfsSlide.jsx";
import { DFS_STEPS } from "./buildDfsSteps.js";
import {
  AnimTuningFocusPanel,
  MotionTuningShell,
  popStashedPlayback,
  useAnimBlock,
  useTuningDeck,
  useTuningPlayback,
} from "@motion-tuning";
import { maxDepthTuning } from "./tuningBridge.js";
import "./max-depth.css";

const SLIDES = [
  { key: "cover", label: "封面", maxFragment: 1 },
  { key: "summary", label: "做法总结", maxFragment: 2 },
  { key: "dfs", label: "DFS 演示", maxFragment: DFS_STEPS.length },
];

const EASE = [0.16, 1, 0.3, 1];

function MaxDepthPresentationInner() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [panelFragment, setPanelFragment] = useState(0);
  const [deckFragment, setDeckFragment] = useState(0);
  const [animateForward, setAnimateForward] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const deckTransition = useAnimBlock("DECK_TRANSITION");
  const { setDeckRef, debug, handleDeckClick, deckTuningAttrs } = useTuningDeck();

  const slide = SLIDES[slideIndex];

  const syncFragment = useCallback((value) => {
    setPanelFragment(value);
    setDeckFragment(value);
    setAnimateForward(false);
  }, []);

  const replayBeat = useCallback(() => {
    const target = panelFragment;
    setAnimateForward(false);
    setReplayNonce((n) => n + 1);

    if (target <= 0) {
      setDeckFragment(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateForward(true);
          setDeckFragment(0);
        });
      });
      return;
    }

    setDeckFragment(target - 1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimateForward(true);
        setDeckFragment(target);
      });
    });
  }, [panelFragment]);

  useTuningPlayback({
    slideKey: slide.key,
    slideIndex,
    fragment: panelFragment,
    maxFragment: slide.maxFragment,
    setFragment: syncFragment,
    setSlideIndex,
    setAnimateForward,
    replayBeat,
  });

  useEffect(() => {
    const stashed = popStashedPlayback(maxDepthTuning.playbackStorageKey);
    if (!stashed) return;
    setSlideIndex(stashed.slideIndex);
    setPanelFragment(stashed.fragment);
    setDeckFragment(stashed.fragment);
    setAnimateForward(false);
  }, []);

  const goNext = useCallback(() => {
    setAnimateForward(true);
    if (panelFragment < slide.maxFragment) {
      const next = panelFragment + 1;
      setPanelFragment(next);
      setDeckFragment(next);
      return;
    }
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex((s) => s + 1);
      setPanelFragment(0);
      setDeckFragment(0);
    }
  }, [panelFragment, slide.maxFragment, slideIndex]);

  const goPrev = useCallback(() => {
    setAnimateForward(false);
    if (panelFragment > 0) {
      const next = panelFragment - 1;
      setPanelFragment(next);
      setDeckFragment(next);
      return;
    }
    if (slideIndex > 0) {
      const prevSlide = SLIDES[slideIndex - 1];
      setSlideIndex((s) => s - 1);
      setPanelFragment(prevSlide.maxFragment);
      setDeckFragment(prevSlide.maxFragment);
    }
  }, [panelFragment, slideIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "Home") {
        e.preventDefault();
        setAnimateForward(false);
        setSlideIndex(0);
        setPanelFragment(0);
        setDeckFragment(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const statusText =
    slide.key === "dfs" && panelFragment > 0
      ? `DFS 步骤 ${panelFragment} / ${DFS_STEPS.length}`
      : `${slide.label} · 节拍 ${panelFragment + 1}/${slide.maxFragment + 1}`;

  return (
    <div
      ref={setDeckRef}
      className={`md-deck${debug ? ` ${maxDepthTuning.deckTuningClass}` : ""}`}
      {...deckTuningAttrs}
      onClick={debug ? handleDeckClick : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.section
          key={slide.key}
          className="md-slide"
          initial={{ opacity: 0, y: deckTransition.initialY, scale: deckTransition.scale }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: deckTransition.exitY, scale: deckTransition.scale }}
          transition={{ duration: deckTransition.duration, ease: EASE }}
        >
          {slide.key === "cover" && (
            <CoverSlide key={`cover-${replayNonce}`} phase={deckFragment} />
          )}
          {slide.key === "summary" && (
            <SummarySlide step={deckFragment} animateForward={animateForward} />
          )}
          {slide.key === "dfs" && (
            <DfsSlide stepCount={deckFragment} animateForward={animateForward} />
          )}
        </motion.section>
      </AnimatePresence>

      <nav className="md-progress-dock" aria-label="演示控制">
        <div className="md-progress">
          <button type="button" onClick={goPrev} aria-label="上一步">
            ‹
          </button>
          <span className="md-progress-text">{statusText}</span>
          <div className="md-dots">
            {SLIDES.map((s, i) => (
              <span key={s.key} className={`md-dot ${i === slideIndex ? "active" : ""}`} />
            ))}
          </div>
          <button type="button" onClick={goNext} aria-label="下一步">
            ›
          </button>
        </div>
      </nav>

      <p className="md-hint">
        → / Space 下一步　← 上一步
        {debug && "　·　Ctrl+滚轮 缩放　Ctrl+拖动 位移"}
      </p>

      {debug && <AnimTuningFocusPanel />}
    </div>
  );
}

export default function MaxDepthPresentation() {
  return (
    <MotionTuningShell tuning={maxDepthTuning}>
      <MaxDepthPresentationInner />
    </MotionTuningShell>
  );
}
