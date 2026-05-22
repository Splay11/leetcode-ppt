import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HASH_STEPS } from "./hashSteps.js";
import CoverSlide from "./components/CoverSlide.jsx";
import BriefSlide from "./components/BriefSlide.jsx";
import IdeaSlide from "./components/IdeaSlide.jsx";
import SimSlide from "./components/SimSlide.jsx";
import SummarySlide from "./components/SummarySlide.jsx";
import "./contains-duplicate.css";

const SLIDES = [
  { key: "cover", label: "封面", maxFragment: 1 },
  { key: "brief", label: "题意", maxFragment: 0 },
  { key: "idea", label: "思路", maxFragment: 2 },
  { key: "sim", label: "哈希模拟", maxFragment: HASH_STEPS.length },
  { key: "summary", label: "总结", maxFragment: 4 },
];

export default function ContainsDuplicateDeck() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fragment, setFragment] = useState(0);
  const [animateForward, setAnimateForward] = useState(true);

  const slide = SLIDES[slideIndex];

  const goNext = useCallback(() => {
    setAnimateForward(true);
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
    setAnimateForward(false);
    if (fragment > 0) {
      setFragment((f) => f - 1);
      return;
    }
    if (slideIndex > 0) {
      const prev = SLIDES[slideIndex - 1];
      setSlideIndex((s) => s - 1);
      setFragment(prev.maxFragment);
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
        setAnimateForward(false);
        setSlideIndex(0);
        setFragment(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const status =
    slide.key === "sim" && fragment > 0
      ? `哈希步骤 ${fragment}/${HASH_STEPS.length}`
      : `${slide.label} · ${fragment + 1}/${slide.maxFragment + 1}`;

  return (
    <div className="cd-deck">
      <AnimatePresence mode="wait">
        <motion.section
          key={slide.key}
          className="cd-slide"
          initial={{ opacity: 0, y: 22, scale: 0.986 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.986 }}
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          {slide.key === "cover" && <CoverSlide phase={fragment} />}
          {slide.key === "brief" && <BriefSlide />}
          {slide.key === "idea" && <IdeaSlide step={fragment} />}
          {slide.key === "sim" && (
            <SimSlide stepCount={fragment} animateForward={animateForward} />
          )}
          {slide.key === "summary" && <SummarySlide step={fragment} />}
        </motion.section>
      </AnimatePresence>

      <nav className="cd-progress-dock" aria-label="演示控制">
        <div className="cd-progress">
          <button type="button" onClick={goPrev} aria-label="上一步">
            ‹
          </button>
          <span>{status}</span>
          <div className="cd-dots">
            {SLIDES.map((s, i) => (
              <span key={s.key} className={`cd-dot ${i === slideIndex ? "active" : ""}`} />
            ))}
          </div>
          <button type="button" onClick={goNext} aria-label="下一步">
            ›
          </button>
        </div>
      </nav>
      <p className="cd-hint">→ / Space 下一步　← 上一步</p>
    </div>
  );
}
