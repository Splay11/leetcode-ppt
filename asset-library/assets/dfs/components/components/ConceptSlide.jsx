import { motion } from "framer-motion";
import { fadeUp } from "../constants.js";

const CODE_LINES = [
  "function dfs(node) {",
  "  if (visited.has(node)) return;",
  "  visited.add(node);",
  "  for (const next of graph[node]) dfs(next);",
  "}",
];

export default function ConceptSlide() {
  return (
    <motion.div
      className="dfs-slide-inner dfs-center"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="dfs-eyebrow" variants={fadeUp} custom={0}>
        Page 02 · Core Idea
      </motion.div>

      <motion.article
        className="dfs-concept-card dfs-glass"
        variants={fadeUp}
        custom={1}
      >
        <motion.div
          className="dfs-concept-title"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <motion.div
            className="dfs-icon-box"
            animate={{ rotate: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🔎
          </motion.div>
          <h2 className="dfs-h2">
            DFS 的核心：<span className="dfs-gradient-text">先深入，再回溯</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          DFS 会从一个起点开始，优先访问当前节点的下一个未访问邻居；如果当前路径无法继续，就回到上一个节点，寻找其他分支。
        </motion.p>

        <motion.div
          className="dfs-code-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.65 }}
        >
          {CODE_LINES.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.58 + i * 0.08, duration: 0.4 }}
            >
              {line}
            </motion.div>
          ))}
        </motion.div>
      </motion.article>
    </motion.div>
  );
}
