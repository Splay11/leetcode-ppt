import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PREFIX_HASH_STEPS_FOUND,
  PREFIX_HASH_STEPS_MISS,
} from "./prefixHashSteps.js";
import { SIM_CASE_FOUND, SIM_CASE_MISS } from "./constants.js";
import CoverSlide from "./components/CoverSlide.jsx";
import BriefSlide from "./components/BriefSlide.jsx";
import IdeaSlide from "./components/IdeaSlide.jsx";
import SimSlide from "./components/SimSlide.jsx";
import SummarySlide from "./components/SummarySlide.jsx";
import "./two-sum.css";

const SLIDES = [
  { key: "cover", label: "封面", maxFragment: 1 },
  { key: "brief", label: "题意", maxFragment: 2 },
  { key: "idea", label: "思路", maxFragment: 7 },
  {
    key: "sim-found",
    label: "模拟·找到",
    maxFragment: PREFIX_HASH_STEPS_FOUND.length,
    caseConfig: SIM_CASE_FOUND,
    steps: PREFIX_HASH_STEPS_FOUND,
  },
  {
    key: "sim-miss",
    label: "模拟·未找到",
    maxFragment: PREFIX_HASH_STEPS_MISS.length,
    caseConfig: SIM_CASE_MISS,
    steps: PREFIX_HASH_STEPS_MISS,
  },
  { key: "summary", label: "总结", maxFragment: 4 },
];

export default function TwoSumDeck() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fragment, setFragment] = useState(0);

  const slide = SLIDES[slideIndex];

  const goNext = useCallback(() => {
    if (fragment < slide.maxFragment) {
      setFragment((f) => f + 1);
      return;
    }
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex((s) => s + 1);
      setFragment(0);
    }
  }, [fragment, slide.maxFragment, slideIndex]);

  const goPrev = useCallback(() => {
    if (fragment > 0) {
      setFragment((f) => f - 1);
      return;
    }
    if (slideIndex > 0) {
      const prevSlide = SLIDES[slideIndex - 1];
      setSlideIndex((s) => s - 1);
      setFragment(prevSlide.maxFragment);
    }
  }, [fragment, slideIndex]);

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
        setSlideIndex(0);
        setFragment(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const status =
    slide.steps && fragment > 0
      ? `${slide.label} ${fragment}/${slide.steps.length}`
      : `${slide.label} · ${fragment + 1}/${slide.maxFragment + 1}`;

  return (
    <div className="ts-deck">
      <AnimatePresence mode="wait">
        <motion.section
          key={slide.key}
          className="ts-slide"
          initial={{ opacity: 0, y: 22, scale: 0.986 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.986 }}
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          {slide.key === "cover" && <CoverSlide phase={fragment} />}
          {slide.key === "brief" && <BriefSlide step={fragment} />}
          {slide.key === "idea" && <IdeaSlide step={fragment} />}
          {(slide.key === "sim-found" || slide.key === "sim-miss") && (
            <SimSlide stepCount={fragment} caseConfig={slide.caseConfig} />
          )}
          {slide.key === "summary" && <SummarySlide step={fragment} />}
        </motion.section>
      </AnimatePresence>

      <nav className="ts-progress-dock" aria-label="演示控制">
        <div className="ts-progress">
          <button type="button" onClick={goPrev} aria-label="上一步">
            ‹
          </button>
          <span>{status}</span>
          <div className="ts-dots">
            {SLIDES.map((s, i) => (
              <span key={s.key} className={`ts-dot ${i === slideIndex ? "active" : ""}`} />
            ))}
          </div>
          <button type="button" onClick={goNext} aria-label="下一步">
            ›
          </button>
        </div>
      </nav>
      <p className="ts-hint">→ / Space 下一步　← 上一步</p>
    </div>
  );
}
