import { motion } from "framer-motion";
import { SUMMARY_ITEMS } from "../constants.js";

export default function SummarySlide({ step }) {
  return (
    <div className="ts-summary-stage">
      <motion.article
        className="ts-summary-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="ts-summary-badge">前缀哈希总结</span>
        <ol className="ts-summary-list">
          {SUMMARY_ITEMS.map((html, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={
                step >= i + 1
                  ? { opacity: 1, x: 0 }
                  : step >= 1
                    ? { opacity: 0.35, x: 0 }
                    : { opacity: 0, x: -16 }
              }
              transition={{ duration: 0.42, delay: step >= i + 1 ? i * 0.06 : 0 }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
        </ol>
      </motion.article>
    </div>
  );
}
