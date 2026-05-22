import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DEMO_NUMS } from "../constants.js";
import { HASH_STEPS } from "../hashSteps.js";

function replayState(upTo) {
  let focusIndex = -1;
  const setValues = new Set();
  let prompt = "";
  let promptVariant = "question";
  let result = null;
  let dupIndex = -1;

  for (let i = 0; i < upTo && i < HASH_STEPS.length; i += 1) {
    const e = HASH_STEPS[i];
    switch (e.type) {
      case "focus":
        focusIndex = e.index;
        prompt = "";
        break;
      case "check":
        prompt = e.inSet
          ? `${e.value} 已在集合中？→ 是！`
          : `${e.value} 已在集合中？→ 否`;
        promptVariant = e.inSet ? "insight" : "question";
        break;
      case "add":
        setValues.add(e.value);
        prompt = `将 ${e.value} 加入集合`;
        promptVariant = "confirm";
        break;
      case "dup":
        dupIndex = e.index;
        prompt = `发现重复：${e.value} → 返回 true`;
        promptVariant = "insight";
        result = true;
        break;
      case "done":
        result = e.result;
        prompt = e.result ? "存在重复元素" : "全部元素互异";
        promptVariant = "insight";
        break;
      default:
        break;
    }
  }

  return {
    focusIndex,
    setValues: [...setValues],
    prompt,
    promptVariant,
    result,
    dupIndex,
  };
}

export default function SimSlide({ stepCount, animateForward }) {
  const [display, setDisplay] = useState(() => replayState(0));
  const prev = useRef(stepCount);

  useEffect(() => {
    if (stepCount === prev.current) return;
    const forward = animateForward && stepCount === prev.current + 1;
    prev.current = stepCount;

    if (forward) {
      const e = HASH_STEPS[stepCount - 1];
      if (e?.type === "dup") {
        setDisplay(replayState(stepCount));
        return;
      }
    }
    setDisplay(replayState(stepCount));
  }, [stepCount, animateForward]);

  const showStage = stepCount >= 0;

  const cellState = useMemo(() => {
    return DEMO_NUMS.map((v, i) => {
      if (display.dupIndex === i) return "dup";
      if (display.focusIndex === i) return "cur";
      if (display.focusIndex > i) return "done";
      return "idle";
    });
  }, [display]);

  return (
    <div className="cd-sim-stage">
      <motion.h2
        className="cd-sim-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: showStage ? 1 : 0, y: 0 }}
      >
        哈希集合 · 逐步模拟
      </motion.h2>

      <div className="cd-sim-layout">
        <div className="cd-sim-array-zone">
          <p className="cd-zone-label">nums</p>
          <div className="cd-array-row cd-array-row--sim">
            {DEMO_NUMS.map((v, i) => (
              <motion.div
                key={`sim-${i}`}
                className={`cd-cell cd-cell--${cellState[i]}`}
                animate={{
                  scale: cellState[i] === "cur" ? 1.08 : cellState[i] === "dup" ? [1, 1.12, 1.08] : 1,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="cd-cell-val">{v}</span>
                <span className="cd-cell-idx">i={i}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="cd-sim-set-zone">
          <p className="cd-zone-label">seen（哈希集合）</p>
          <div className="cd-set-box">
            <AnimatePresence mode="popLayout">
              {display.setValues.length === 0 ? (
                <motion.span
                  key="empty"
                  className="cd-set-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                >
                  ∅ 空集合
                </motion.span>
              ) : (
                display.setValues.map((v) => (
                  <motion.span
                    key={v}
                    className="cd-set-chip"
                    layout
                    initial={{ opacity: 0, scale: 0.82, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {v}
                  </motion.span>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="cd-step-prompt-slot">
        <AnimatePresence mode="wait">
          {display.prompt ? (
            <motion.p
              key={display.prompt}
              className={`cd-step-prompt cd-step-prompt--${display.promptVariant}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.38 }}
            >
              {display.prompt}
            </motion.p>
          ) : (
            <motion.p
              key="placeholder"
              className="cd-step-prompt cd-step-prompt--placeholder"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
            >
              {"\u00A0"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
