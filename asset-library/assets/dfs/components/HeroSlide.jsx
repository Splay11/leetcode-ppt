import { motion } from "framer-motion";
import { fadeUp } from "../constants.js";
import HeroGraph from "./HeroGraph.jsx";

export default function HeroSlide({ playKey }) {
  return (
    <motion.div
      className="dfs-slide-inner dfs-hero"
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} custom={0}>
        <motion.div className="dfs-eyebrow">Graph Algorithm · Visual Presentation</motion.div>
        <h1 className="dfs-h1">
          Depth First Search{" "}
          <span className="dfs-gradient-text">可视化演示</span>
        </h1>
        <p className="dfs-lead">
          用 4 页 PPT 式动画讲清楚 DFS：从核心概念、递归/栈机制，到节点访问流程和复杂度对比。
        </p>
      </motion.div>

      <motion.article
        className="dfs-hero-card dfs-glass"
        variants={fadeUp}
        custom={2}
      >
        <h3>DFS 遍历路径</h3>
        <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.7 }}>
          沿着一条路径尽可能深入，走不通再回溯。
        </p>
        <HeroGraph playKey={playKey} />
      </motion.article>
    </motion.div>
  );
}
