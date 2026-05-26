import { motion } from "motion/react";
import { useAnimBlock } from "../animHooks.js";
import { useAnimTuning, useTuningPickable } from "@motion-tuning";

const EASE = [0.16, 1, 0.3, 1];

export default function CoverSlide({ phase }) {
  const motionCfg = useAnimBlock("COVER_MOTION");
  const copy = useAnimBlock("DECK_TEXT");
  const debug = useAnimTuning()?.enabled;
  const showDifficulty = phase >= 1;
  const difficultyPick = useTuningPickable("cover-motion", {
    className: "ibt-difficulty ibt-difficulty--easy",
  });
  const titlePick = useTuningPickable("cover-fonts", { className: "ibt-title-card" });

  return (
    <div className="ibt-cover-stage">
      <div
        className={`ibt-cover-hero ibt-difficulty-wrap ${showDifficulty ? "ibt-difficulty-wrap--open" : ""}`}
      >
        <motion.div
          className="ibt-difficulty-slot"
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
            {...(debug ? difficultyPick : { className: "ibt-difficulty ibt-difficulty--easy" })}
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
          {...(debug ? titlePick : { className: "ibt-title-card" })}
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
          <p className="ibt-leetcode">{copy.coverLeetcode}</p>
          <h1 className="ibt-main-title">{copy.coverTitle}</h1>
          <motion.p
            className="ibt-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showDifficulty ? 1 : 0, y: showDifficulty ? 0 : 10 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {copy.coverTagline}
          </motion.p>
        </motion.article>
      </div>
    </div>
  );
}
