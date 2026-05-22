import { motion } from "framer-motion";
import {
  BRIEF,
  BRIEF_ANSWER,
  BRIEF_NUMS,
  BRIEF_TARGET,
} from "../constants.js";

const FLOAT_EASE = [0.22, 1, 0.36, 1];

export default function BriefSlide({ step }) {
  const hintSet = new Set(BRIEF_ANSWER);
  const showSample = step >= 1;
  const showAnswer = step >= 2;

  return (
    <div className="ts-brief-stage">
      <div className="ts-brief-stack">
        <motion.article
          className="ts-brief-card"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: showSample ? -56 : 0,
            scale: showSample ? 0.97 : 1,
          }}
          transition={{
            opacity: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.75, ease: FLOAT_EASE },
            scale: { duration: 0.75, ease: FLOAT_EASE },
          }}
        >
          <h2>{BRIEF.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: BRIEF.content }} />
        </motion.article>

        <motion.div
          className={`ts-sample-block${showAnswer ? " ts-sample-block--answered" : ""}`}
          initial={false}
          animate={{
            opacity: showSample ? 1 : 0,
            y: showSample ? 0 : 28,
            scale: showSample ? 1 : 0.96,
            maxHeight: showSample ? 420 : 0,
            marginTop: showSample ? 28 : 0,
            paddingTop: showSample ? 22 : 0,
            paddingBottom: showSample ? 22 : 0,
          }}
          transition={{ duration: 0.75, ease: FLOAT_EASE }}
          style={{
            pointerEvents: showSample ? "auto" : "none",
            overflow: "hidden",
          }}
          aria-hidden={!showSample}
        >
          <p className="ts-sample-label">样例</p>
          <p className="ts-target-line">
            Target = <strong>{BRIEF_TARGET}</strong>
          </p>
          <div className="ts-array-row">
            {BRIEF_NUMS.map((v, i) => (
              <motion.div
                key={`${v}-${i}`}
                className={`ts-cell${showAnswer && hintSet.has(i) ? " ts-cell--pair-hint" : ""}`}
                animate={
                  showAnswer && hintSet.has(i)
                    ? {
                        boxShadow: [
                          "0 4px 10px rgba(70,52,26,.08), 0 0 0 0 rgba(36,148,93,0)",
                          "0 4px 10px rgba(70,52,26,.08), 0 0 16px 4px rgba(36,148,93,.28)",
                          "0 4px 10px rgba(70,52,26,.08), 0 0 0 0 rgba(36,148,93,0)",
                        ],
                      }
                    : {}
                }
                transition={
                  showAnswer && hintSet.has(i)
                    ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
              >
                <span className="ts-cell-val">{v}</span>
                <span className="ts-cell-idx">{i}</span>
              </motion.div>
            ))}
          </div>
          <div className="ts-sample-ans-slot">
            {showAnswer ? (
              <motion.p
                className="ts-sample-ans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, ease: FLOAT_EASE }}
              >
                输出：<strong>[{BRIEF_ANSWER.join(", ")}]</strong>（nums[1] + nums[2] = 4 + 5 = 9）
              </motion.p>
            ) : (
              <p className="ts-sample-ans ts-sample-ans--placeholder" aria-hidden="true">
                {"\u00A0"}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
