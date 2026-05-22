import { motion } from "motion/react";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";
import CoverApproachTeaser from "./CoverApproachTeaser.jsx";

const EASE = [0.16, 1, 0.3, 1];

export default function CoverSlide({ phase }) {
  const motionCfg = useAnimBlock("COVER_MOTION");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const showDifficulty = phase >= 1;
  const difficultyPick = useTuningPickable("cover-motion", { className: "md-difficulty md-difficulty--medium" });
  const titlePick = useTuningPickable("cover-fonts", { className: "md-title-card" });

  return (
    <div className="md-cover-stage">
      <CoverApproachTeaser visible={showDifficulty} />

      <div
        className={`md-cover-hero md-difficulty-wrap ${showDifficulty ? "md-difficulty-wrap--open md-difficulty-wrap--teaser" : ""}`}
      >
        <motion.div
          className="md-difficulty-slot"
          initial={false}
          animate={{
            opacity: showDifficulty ? 1 : 0,
            maxHeight: showDifficulty ? motionCfg.difficultySlotMaxHeight : 0,
            paddingTop: showDifficulty ? motionCfg.difficultySlotPadding : 0,
            paddingBottom: showDifficulty ? motionCfg.difficultySlotPadding : 0,
          }}
          transition={{ duration: motionCfg.difficultySlotDuration, ease: EASE }}
        >
          <motion.span
            {...(debug ? difficultyPick : { className: "md-difficulty md-difficulty--medium" })}
            initial={{ opacity: 0, y: motionCfg.difficultyInitialY, scale: motionCfg.difficultyInitialScale }}
            animate={
              showDifficulty
                ? { opacity: 1, y: 0, scale: 1 }
                : {
                    opacity: 0,
                    y: motionCfg.difficultyHiddenY,
                    scale: motionCfg.difficultyHiddenScale,
                  }
            }
            transition={{ duration: motionCfg.difficultyDuration, ease: EASE }}
          >
            {copy.coverDifficulty}
          </motion.span>
        </motion.div>

        <motion.article
          {...(debug ? titlePick : { className: "md-title-card" })}
          initial={{ opacity: 0, y: motionCfg.titleInitialY, scale: 1 }}
          animate={{
            opacity: 1,
            y: showDifficulty ? motionCfg.titleShrinkY : 0,
            scale: showDifficulty ? motionCfg.titleShrinkScale : 1,
          }}
          transition={{
            duration: showDifficulty ? motionCfg.titleShrinkDuration : motionCfg.titleDuration,
            ease: EASE,
          }}
        >
          <p className="md-leetcode">{copy.coverLeetcode}</p>
          <h1 className="md-main-title">{copy.coverTitle}</h1>
        </motion.article>
      </div>
    </div>
  );
}
