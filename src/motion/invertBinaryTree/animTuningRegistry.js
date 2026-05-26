import { FONT, PX, SCALE, SEC } from "../../motion-tuning/schema/fieldPresets.js";
import { COVER_TIMELINES } from "./animTimeline.js";
import { layoutBaseFieldEntries } from "./layoutBase.js";

export { cssVarUnit, formatCssVarValue, parseCssVarNumber } from "../../motion-tuning/schema/cssVar.js";

export const SLIDE_TUNING = {
  cover: {
    label: "封面",
    timelines: COVER_TIMELINES,
    groups: [
      {
        id: "cover-deck-transition",
        title: "幻灯片切换",
        role: "motion",
        block: "DECK_TRANSITION",
        source: { file: "src/motion/invertBinaryTree/InvertBinaryTreePresentation.jsx", lines: "deck-transition" },
        fields: {
          duration: SEC("切换时长 (s)"),
          initialY: PX("进入起始 Y"),
          exitY: PX("退出终点 Y"),
          scale: SCALE("缩放"),
        },
      },
      {
        id: "cover-motion",
        title: "封面 Motion",
        role: "motion",
        layoutSlug: "cover-difficulty",
        layoutKind: "css",
        layoutBlock: "DECK_CSS_VARS",
        layoutFields: layoutBaseFieldEntries("cover-difficulty"),
        textBlock: "DECK_TEXT",
        textFields: { coverDifficulty: "难度标签", coverTagline: "副标题" },
        block: "COVER_MOTION",
        source: { file: "src/motion/invertBinaryTree/components/CoverSlide.jsx", lines: "motion" },
        fields: {
          titleInitialY: PX("标题起始 Y"),
          titleDuration: SEC("标题时长 (s)"),
          difficultyInitialY: PX("难度起始 Y"),
          difficultyInitialScale: SCALE("难度起始缩放"),
          difficultyHiddenY: PX("难度隐藏 Y"),
          difficultyHiddenScale: SCALE("难度隐藏缩放"),
          difficultySlotMaxHeight: PX("难度槽高度"),
          difficultySlotPadding: PX("难度槽内边距"),
          difficultySlotDuration: SEC("难度槽时长 (s)"),
          difficultyDuration: SEC("难度时长 (s)"),
          titleShrinkScale: SCALE("标题微缩比例"),
          titleShrinkY: PX("标题微缩 Y"),
          titleShrinkDuration: SEC("标题微缩时长 (s)"),
        },
      },
      {
        id: "cover-fonts",
        title: "封面字号",
        role: "layout",
        layoutSlug: "cover-title",
        kind: "css",
        block: "DECK_CSS_VARS",
        textBlock: "DECK_TEXT",
        textFields: { coverLeetcode: "LeetCode", coverTitle: "主标题" },
        source: { file: "src/motion/invertBinaryTree/invert-binary-tree.css", lines: "cover-fonts" },
        fields: {
          "--ibt-cover-title-size": FONT("主标题字号 (px)"),
          "--ibt-cover-leetcode-size": FONT("LeetCode 字号 (px)"),
          "--ibt-cover-tagline-size": FONT("副标题字号 (px)"),
          ...layoutBaseFieldEntries("cover-title"),
        },
        manip: {
          drag: { type: "css", keys: ["--ibt-cover-title-left"] },
          scale: { type: "css", key: "--ibt-cover-title-layout-size", min: 0.5, max: 2 },
        },
      },
    ],
  },
};
