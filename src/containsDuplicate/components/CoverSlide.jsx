import { motion } from "framer-motion";
import { PROBLEM } from "../constants.js";

export default function CoverSlide({ phase }) {
  const showDifficulty = phase >= 1;

  return (
    <div className="cd-cover-stage">
      <div className={`cd-difficulty-wrap ${showDifficulty ? "cd-difficulty-wrap--open" : ""}`}>
        <motion.div
          className="cd-difficulty-slot"
          animate={{
            opacity: showDifficulty ? 1 : 0,
            maxHeight: showDifficulty ? 96 : 0,
            paddingTop: showDifficulty ? 10 : 0,
            paddingBottom: showDifficulty ? 10 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="cd-difficulty cd-difficulty--easy"
            initial={false}
            animate={
              showDifficulty
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 14, scale: 0.88 }
            }
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {PROBLEM.difficultyText}
          </motion.span>
        </motion.div>

        <motion.article
          className="cd-title-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="cd-leetcode">{PROBLEM.leetcode}</p>
          <h1 className="cd-main-title">{PROBLEM.title}</h1>
          <p className="cd-sub-title">{PROBLEM.titleEn} · 哈希集合</p>
        </motion.article>
      </div>
    </div>
  );
}
