import { motion } from "framer-motion";
import { BRIEF, DEMO_NUMS } from "../constants.js";

export default function BriefSlide() {
  return (
    <div className="cd-brief-stage">
      <motion.article
        className="cd-brief-card"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>{BRIEF.title}</h2>
        <p dangerouslySetInnerHTML={{ __html: BRIEF.content }} />
      </motion.article>

      <motion.div
        className="cd-sample-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="cd-sample-label">样例</p>
        <div className="cd-array-row">
          {DEMO_NUMS.map((v, i) => (
            <motion.div
              key={`${v}-${i}`}
              className={`cd-cell${v === 1 ? " cd-cell--dup-hint" : ""}`}
              animate={
                v === 1
                  ? {
                      boxShadow: [
                        "0 4px 10px rgba(70,52,26,.08), 0 0 0 0 rgba(36,148,93,0)",
                        "0 4px 10px rgba(70,52,26,.08), 0 0 16px 4px rgba(36,148,93,.32)",
                        "0 4px 10px rgba(70,52,26,.08), 0 0 0 0 rgba(36,148,93,0)",
                      ],
                    }
                  : {}
              }
              transition={
                v === 1
                  ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                  : undefined
              }
            >
              <span className="cd-cell-val">{v}</span>
              <span className="cd-cell-idx">{i}</span>
            </motion.div>
          ))}
        </div>
        <p className="cd-sample-ans">
          输出：<strong>true</strong>（元素 <strong>1</strong> 出现了两次）
        </p>
      </motion.div>
    </div>
  );
}
