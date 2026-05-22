import { motion } from "motion/react";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";

const EASE = [0.16, 1, 0.3, 1];

function annoDuration(motionCfg, annotation) {
  return annotation.id === "l" ? motionCfg.annoBlueDuration : motionCfg.annoGoldDuration;
}

export default function SubtreeSchematic({
  flashLeft = false,
  flashRight = false,
  annotations = [],
}) {
  const motionCfg = useAnimBlock("SUMMARY_SCHEMATIC_MOTION");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const schematicPick = useTuningPickable("summary-schematic-motion");
  const schematicSvgProps = debug
    ? {
        ...schematicPick,
        className: `md-schematic-svg ${schematicPick.className}`.trim(),
      }
    : { className: "md-schematic-svg" };

  return (
    <svg viewBox="0 0 800 400" role="img" aria-label="自底向上示意" {...schematicSvgProps}>
      <defs>
        <marker id="md-arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(65,105,225,0.9)" />
        </marker>
        <marker id="md-arrow-gold" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(215,155,37,0.94)" />
        </marker>
      </defs>

      <line className="md-schematic-edge" x1="400" y1="108" x2="240" y2="168" />
      <line className="md-schematic-edge" x1="400" y1="108" x2="560" y2="168" />

      <g className={`md-schematic-tri md-schematic-tri--left ${flashLeft ? "md-schematic-tri--flash" : ""}`}>
        <polygon points="240,168 120,340 360,340" />
      </g>
      <g className={`md-schematic-tri md-schematic-tri--right ${flashRight ? "md-schematic-tri--flash-gold" : ""}`}>
        <polygon points="560,168 440,340 680,340" />
      </g>

      <g transform="translate(240 366)">
        <text className="md-schematic-caption">{copy.schematicLeftCaption}</text>
      </g>
      <g transform="translate(560 366)">
        <text className="md-schematic-caption">{copy.schematicRightCaption}</text>
      </g>

      <g className="md-schematic-root">
        <circle cx="400" cy="72" r="34" />
        <text x="400" y="72">1</text>
      </g>

      {annotations.map((a) => (
        <motion.line
          key={a.id}
          x1={a.x1}
          y1={a.y1}
          x2={a.x2}
          y2={a.y2}
          className={a.className}
          markerEnd={a.markerEnd}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: annoDuration(motionCfg, a), ease: EASE }}
        />
      ))}
    </svg>
  );
}
