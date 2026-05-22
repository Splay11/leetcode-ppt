import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildPrefixHashSteps } from "../prefixHashSteps.js";

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function replayState(steps, upTo) {
  let j = -1;
  let showJ = false;
  let needValue = null;
  let bracketIndices = [];
  let starIndex = null;
  let partnerIndex = null;
  let foundPair = null;
  let queryResult = null;

  for (let i = 0; i < upTo && i < steps.length; i += 1) {
    const e = steps[i];
    switch (e.type) {
      case "focus":
        j = e.j;
        showJ = true;
        needValue = null;
        starIndex = null;
        queryResult = null;
        bracketIndices = j > 0 ? Array.from({ length: j }, (_, idx) => idx) : [];
        break;
      case "show_need":
        j = e.j;
        needValue = e.need;
        queryResult = null;
        break;
      case "add":
        j = e.j;
        needValue = e.need ?? needValue;
        bracketIndices = e.prefixIndices;
        starIndex = e.j;
        queryResult = null;
        break;
      case "found":
        j = e.j;
        needValue = e.need ?? needValue;
        foundPair = e.pair;
        partnerIndex = e.partnerIndex;
        queryResult = "hit";
        bracketIndices = j > 0 ? Array.from({ length: j }, (_, idx) => idx) : [];
        break;
      default:
        break;
    }
  }

  return {
    j,
    showJ,
    needValue,
    bracketIndices,
    starIndex,
    partnerIndex,
    foundPair,
    queryResult,
  };
}

function cellClass(i, display) {
  const { j, bracketIndices, starIndex, partnerIndex, foundPair, queryResult } = display;
  const inBracket = bracketIndices.includes(i);
  const isHit =
    queryResult === "hit" &&
    (i === j || i === partnerIndex || (foundPair && foundPair.includes(i)));

  if (isHit) return "hit";
  if (i === j) return "cur";
  if (i === starIndex) return "star";
  if (inBracket) return "prefix";
  return "idle";
}

export default function SimSlide({ stepCount, caseConfig }) {
  const steps = useMemo(
    () => buildPrefixHashSteps(caseConfig.nums, caseConfig.target),
    [caseConfig.nums, caseConfig.target],
  );
  const nums = caseConfig.nums;
  const target = caseConfig.target;

  const [display, setDisplay] = useState(() => replayState(steps, 0));
  const prev = useRef(stepCount);
  const arrayZoneRef = useRef(null);
  const cellRefs = useRef([]);
  const lastBracketRef = useRef(null);
  const [bracketBox, setBracketBox] = useState(null);
  const [bracketVisible, setBracketVisible] = useState(false);
  const [pointerLeft, setPointerLeft] = useState(null);

  useEffect(() => {
    setDisplay(replayState(steps, stepCount));
    prev.current = stepCount;
  }, [stepCount, steps]);

  const states = useMemo(
    () => nums.map((_, i) => cellClass(i, display)),
    [display, nums],
  );

  useLayoutEffect(() => {
    const zone = arrayZoneRef.current;
    if (!zone) return;

    const { bracketIndices, j, showJ } = display;

    if (bracketIndices.length > 0) {
      const first = cellRefs.current[bracketIndices[0]];
      const last = cellRefs.current[bracketIndices[bracketIndices.length - 1]];
      if (first && last) {
        const zoneRect = zone.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const box = {
          left: firstRect.left - zoneRect.left - 10,
          width: lastRect.right - firstRect.left + 20,
          height: firstRect.height + 20,
          top: firstRect.top - zoneRect.top - 10,
        };
        lastBracketRef.current = box;
        setBracketBox(box);
        setBracketVisible(true);
      }
    } else {
      setBracketVisible(false);
    }

    if (showJ && j >= 0 && cellRefs.current[j]) {
      const zoneRect = zone.getBoundingClientRect();
      const cellRect = cellRefs.current[j].getBoundingClientRect();
      setPointerLeft(cellRect.left - zoneRect.left + cellRect.width / 2);
    } else {
      setPointerLeft(null);
    }
  }, [display, stepCount, nums]);

  const showPointer = display.showJ && pointerLeft != null;
  const renderBracket = bracketBox ?? lastBracketRef.current;

  return (
    <div className="ts-sim-stage">
      <div className="ts-sim-header">
        <h2 className="ts-sim-title">{caseConfig.title}</h2>
        <p className="ts-target-badge">
          Target = <strong>{target}</strong>
        </p>
      </div>

      <div className="ts-sim-main">
        <motion.div
          className="ts-sim-array-anchor"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SMOOTH_EASE }}
        >
          <div className="ts-sim-row">
          <div className="ts-array-zone" ref={arrayZoneRef}>
            <div className="ts-j-pointer-slot">
              <motion.div
                className="ts-j-pointer"
                animate={{
                  opacity: showPointer ? 1 : 0,
                  y: showPointer ? 0 : -6,
                  left: pointerLeft ?? "50%",
                }}
                transition={{ duration: 0.45, ease: SMOOTH_EASE }}
                style={{ left: showPointer ? pointerLeft : "50%", pointerEvents: "none" }}
              >
                <span className="ts-j-label">j</span>
                <span className="ts-j-arrow">↓</span>
              </motion.div>
            </div>

            {renderBracket && (
              <motion.div
                className="ts-prefix-bracket"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity: bracketVisible ? 1 : 0,
                  scale: bracketVisible ? 1 : 0.94,
                  left: renderBracket.left,
                  width: renderBracket.width,
                  top: renderBracket.top,
                  height: renderBracket.height,
                }}
                transition={{
                  opacity: { duration: bracketVisible ? 0.48 : 0.35, ease: SMOOTH_EASE },
                  scale: { duration: 0.52, ease: SMOOTH_EASE },
                  left: { duration: 0.58, ease: SMOOTH_EASE },
                  width: { duration: 0.58, ease: SMOOTH_EASE },
                  top: { duration: 0.58, ease: SMOOTH_EASE },
                  height: { duration: 0.58, ease: SMOOTH_EASE },
                }}
                style={{ transformOrigin: "left center" }}
              />
            )}

            <div className="ts-array-row ts-array-row--sim">
              {nums.map((v, i) => (
                <div
                  key={`sim-${i}`}
                  ref={(el) => {
                    cellRefs.current[i] = el;
                  }}
                  className={`ts-cell ts-cell--${states[i]}`}
                >
                  {states[i] === "star" && (
                    <span className="ts-star" aria-hidden="true">
                      ★
                    </span>
                  )}
                  <span className="ts-cell-val">{v}</span>
                  <span className="ts-cell-idx">{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ts-query-slot">
            <div className="ts-query-box">
              <AnimatePresence mode="wait">
                {display.needValue != null ? (
                  <motion.span
                    key={`${display.j}-${display.needValue}`}
                    className="ts-query-val"
                    initial={{ opacity: 0, scale: 0.82, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: -4 }}
                    transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                  >
                    {display.needValue}
                  </motion.span>
                ) : (
                  <motion.span
                    key="query-empty"
                    className="ts-query-val ts-query-val--empty"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <span className="ts-query-label">查询值</span>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
