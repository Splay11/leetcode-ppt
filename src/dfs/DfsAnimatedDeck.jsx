import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slideTransition } from "./constants.js";
import HeroSlide from "./components/HeroSlide.jsx";
import ConceptSlide from "./components/ConceptSlide.jsx";
import StackSlide from "./components/StackSlide.jsx";
import SummarySlide from "./components/SummarySlide.jsx";
import "./dfs.css";

const SLIDE_KEYS = ["hero", "concept", "stack", "summary"];

export default function DfsAnimatedDeck() {
  const [current, setCurrent] = useState(0);
  const [graphPlayKey, setGraphPlayKey] = useState(0);

  const go = useCallback((index) => {
    const next = Math.max(0, Math.min(SLIDE_KEYS.length - 1, index));
    setCurrent(next);
    if (next === 0) setGraphPlayKey((k) => k + 1);
  }, []);

  const goPrev = useCallback(() => go(current - 1), [current, go]);
  const goNext = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") goPrev();
      if (/^[1-4]$/.test(e.key)) go(Number(e.key) - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goNext, goPrev]);

  const progress = ((current + 1) / SLIDE_KEYS.length) * 100;

  return (
    <motion.div
      className="dfs-deck"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="dfs-topbar">
        <motion.div
          className="dfs-brand"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="dfs-brand-dot" />
          DFS Animated PPT
        </motion.div>
        <motion.div
          className="dfs-page-num"
          key={current}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {String(current + 1).padStart(2, "0")} / 04
        </motion.div>
      </header>

      <main className="dfs-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={SLIDE_KEYS[current]}
            className="dfs-slide-inner"
            {...slideTransition}
            style={{ width: "100%" }}
          >
            {current === 0 && <HeroSlide playKey={graphPlayKey} />}
            {current === 1 && <ConceptSlide />}
            {current === 2 && <StackSlide />}
            {current === 3 && <SummarySlide />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="dfs-controls" aria-label="幻灯片控制">
        <button type="button" onClick={goPrev}>
          ← 上一页
        </button>
        <motion.div className="dfs-dots" layout>
          {SLIDE_KEYS.map((key, i) => (
            <motion.button
              key={key}
              type="button"
              className={`dfs-dot ${i === current ? "dfs-dot--active" : ""}`}
              onClick={() => go(i)}
              aria-label={`第 ${i + 1} 页`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
            />
          ))}
        </motion.div>
        <button type="button" onClick={goNext}>
          下一页 →
        </button>
      </nav>

      <motion.div
        className="dfs-progress"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
