import { motion } from "framer-motion";
import { CODE_LINES } from "../constants.js";

const LINE_EASE = [0.22, 1, 0.36, 1];

export default function IdeaSlide({ step }) {
  const layoutStep = Math.min(step, 2);
  const codeLineHighlight = step >= 3 ? step - 3 : -1;

  return (
    <div className="ts-idea-stage" data-idea-step={layoutStep}>
      <article className="ts-question-card">
        <h2>
          如何在 <span className="em">O(n)</span> 内找到两数之和？
        </h2>
      </article>

      <article className="ts-idea-card" aria-hidden={step < 1}>
        <span className="ts-idea-badge">前缀哈希</span>
        <p className="ts-idea-line">
          <span className="em">j</span> 右移时，前缀 <span className="em">[0, j−1]</span>{" "}
          用哈希维护；查 <span className="em">target − num[j]</span> 是否出现过。
        </p>
      </article>

      <pre className="ts-code-card" aria-hidden={step < 2}>
        <code className="ts-code-inner">
          {CODE_LINES.map((line, i) => {
            const isActive = codeLineHighlight === i;
            return (
              <motion.span
                key={i}
                className={[
                  "ts-code-line",
                  line.indent === 1 ? "ts-code-line--ind1" : "",
                  line.indent === 2 ? "ts-code-line--ind2" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                animate={{
                  backgroundColor: isActive
                    ? "rgba(65, 105, 225, 0.34)"
                    : "rgba(65, 105, 225, 0)",
                  boxShadow: isActive
                    ? "0 0 0 2px rgba(124, 168, 255, 0.5), 0 4px 16px rgba(65, 105, 225, 0.2)"
                    : "0 0 0 0px rgba(124, 168, 255, 0)",
                  opacity: step >= 3 && !isActive ? 0.75 : 1,
                }}
                transition={{
                  duration: 0.52,
                  ease: LINE_EASE,
                  backgroundColor: { duration: 0.48 },
                  boxShadow: { duration: 0.48 },
                  opacity: { duration: 0.38 },
                }}
              >
                {line.parts.map((part, pi) => (
                  <span key={pi} className={part.t === "plain" ? undefined : part.t}>
                    {part.v}
                  </span>
                ))}
              </motion.span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
