import { motion } from "framer-motion";
import { EASE, STACK_FRAMES, STEP_CARDS } from "../constants.js";

const panelVariants = {
  hidden: { opacity: 0, x: 120, scale: 1.03 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 42, y: 18 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.72, delay: 0.3 + i * 0.17, ease: EASE },
  }),
};

export default function StackSlide() {
  return (
    <motion.div
      className="dfs-slide-inner dfs-split"
      initial="hidden"
      animate="visible"
    >
      <motion.aside
        className="dfs-left-panel dfs-glass"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="dfs-eyebrow">Page 03 · Stack Trace</motion.div>
          <h2 className="dfs-h2">递归调用栈</h2>
          <p style={{ marginTop: 16, color: "var(--muted)", lineHeight: 1.8, fontSize: 18 }}>
            DFS 的「深入」本质上来自调用栈：新节点入栈，分支结束后出栈，继续探索其他路径。
          </p>
        </motion.div>

        <motion.div className="dfs-stack-view">
          {STACK_FRAMES.map((frame, i) => (
            <motion.div
              key={frame.fn}
              className={`dfs-stack-item ${i === STACK_FRAMES.length - 1 ? "dfs-stack-item--top" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.5, ease: EASE }}
              layout
            >
              <span>{frame.fn}</span>
              <span>{frame.tag}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.aside>

      <motion.section
        className="dfs-cards"
        initial="hidden"
        animate="visible"
      >
        {STEP_CARDS.map((card, i) => (
          <motion.article
            key={card.tag}
            className="dfs-info-card dfs-glass"
            variants={cardVariants}
            custom={i}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <span className="dfs-tag">{card.tag}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </motion.article>
        ))}
      </motion.section>
    </motion.div>
  );
}
