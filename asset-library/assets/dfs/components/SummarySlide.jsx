import { motion } from "framer-motion";
import { EASE, METRICS, TABLE_ROWS, fadeUp } from "../constants.js";

export default function SummarySlide() {
  return (
    <motion.div
      className="dfs-slide-inner dfs-table-layout"
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} custom={0}>
        <motion.div className="dfs-eyebrow">Page 04 · Result Table</motion.div>
        <h2 className="dfs-h2">DFS 总结与复杂度</h2>
      </motion.div>

      <motion.div
        className="dfs-summary-grid"
        initial="hidden"
        animate="visible"
      >
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            className="dfs-metric dfs-glass"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
          >
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.table
        className="dfs-table"
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.86, delay: 0.34, ease: EASE }}
      >
        <thead>
          <tr>
            <th>模块</th>
            <th>说明</th>
            <th>适用场景</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row, i) => (
            <motion.tr
              key={row.module}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.1 }}
            >
              <td>{row.module}</td>
              <td>{row.desc}</td>
              <td>{row.scene}</td>
              <td>
                <span className="dfs-pill">{row.status}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
}
