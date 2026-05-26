/**
 * LC 226 翻转二叉树 — 动画参数（motion-tuning 唯一数据源）
 */

export const DECK_TRANSITION = {
  duration: 0.55,
  initialY: 24,
  exitY: -16,
  scale: 0.985,
};

export const COVER_MOTION = {
  difficultySlotDuration: 0.45,
  difficultySlotPadding: 10,
  difficultySlotMaxHeight: 96,
  difficultyDuration: 0.55,
  difficultyInitialY: 18,
  difficultyInitialScale: 0.8,
  difficultyHiddenY: 14,
  difficultyHiddenScale: 0.88,
  titleDuration: 0.55,
  titleInitialY: 18,
  titleShrinkScale: 0.92,
  titleShrinkY: -8,
  titleShrinkDuration: 0.4,
};

export const DECK_TEXT = {
  coverLeetcode: "LeetCode 226",
  coverTitle: "翻转二叉树",
  coverDifficulty: "简单",
  coverTagline: "递归交换左右子树",
};

export const DECK_CSS_VARS = {
  "--ibt-cover-title-left": "50%",
  "--ibt-cover-title-layout-size": "1",
  "--ibt-cover-difficulty-left": "50%",
  "--ibt-cover-difficulty-layout-size": "1",
  "--ibt-cover-title-size": "46px",
  "--ibt-cover-leetcode-size": "22px",
  "--ibt-cover-difficulty-size": "28px",
  "--ibt-cover-tagline-size": "20px",
  "--ibt-cover-stage-offset-y": "120px",
};

export function cloneAnimConfig() {
  return {
    DECK_TRANSITION: { ...DECK_TRANSITION },
    COVER_MOTION: { ...COVER_MOTION },
    DECK_TEXT: { ...DECK_TEXT },
    DECK_CSS_VARS: { ...DECK_CSS_VARS },
  };
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
