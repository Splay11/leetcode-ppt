import {
  COVER_MOTION,
  COVER_TEASER_MOTION,
  DECK_TRANSITION,
  DFS_TIMING,
  SUMMARY_TIMING,
} from "../animConfig.js";
import { DFS_STEPS } from "../buildDfsSteps.js";

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

const sec = (s) => Math.max(1, Math.round(s * VIDEO_FPS));
const ms = (m) => Math.max(1, Math.round((m / 1000) * VIDEO_FPS));

function dfsStepFrames(step) {
  switch (step.type) {
    case "enter_node":
      return ms(DFS_TIMING.enterNode);
    case "enter_edge":
      return ms(DFS_TIMING.enterEdge);
    case "leaf_flash":
      return ms(DFS_TIMING.leafFlashLoop * 3);
    case "leave_edge":
      return ms(DFS_TIMING.leaveEdge);
    case "leave_node":
      return ms(240);
    default:
      return sec(0.5);
  }
}

export function buildVideoTimeline() {
  const segments = [];
  let cursor = 0;

  const push = (segment) => {
    const durationInFrames = segment.durationInFrames;
    segments.push({
      ...segment,
      startFrame: cursor,
      endFrame: cursor + durationInFrames,
    });
    cursor += durationInFrames;
  };

  const transition = () => {
    push({
      id: `transition-${segments.length}`,
      kind: "transition",
      durationInFrames: sec(DECK_TRANSITION.duration),
    });
  };

  push({
    id: "cover-title",
    kind: "cover",
    phase: 0,
    voiceoverId: "cover-title",
    durationInFrames: sec(COVER_MOTION.titleDuration) + sec(1.8),
  });

  push({
    id: "cover-full",
    kind: "cover",
    phase: 1,
    voiceoverId: "cover-approaches",
    durationInFrames:
      sec(COVER_MOTION.difficultySlotDuration + COVER_MOTION.difficultyDuration) +
      sec(COVER_TEASER_MOTION.panelDuration + 0.15) +
      sec(2.2),
  });

  transition();

  push({
    id: "summary-enter",
    kind: "summary",
    step: 0,
    voiceoverId: "summary-enter",
    durationInFrames: sec(2),
  });

  push({
    id: "summary-topdown",
    kind: "summary",
    step: 1,
    voiceoverId: "summary-topdown",
    durationInFrames:
      ms(SUMMARY_TIMING.panelFlash) +
      ms(SUMMARY_TIMING.edgePulseFirst) +
      ms(SUMMARY_TIMING.edgePulseSecond) +
      ms(SUMMARY_TIMING.badgePopDelay) +
      sec(1.5),
  });

  push({
    id: "summary-bottomup",
    kind: "summary",
    step: 2,
    voiceoverId: "summary-bottomup",
    durationInFrames:
      ms(SUMMARY_TIMING.panelFlash) +
      ms(SUMMARY_TIMING.flashLeft) +
      ms(SUMMARY_TIMING.annoBlue) +
      ms(SUMMARY_TIMING.flashRight) +
      ms(SUMMARY_TIMING.badgeFinalDelay) +
      sec(1.8),
  });

  transition();

  DFS_STEPS.forEach((step, index) => {
    push({
      id: `dfs-${index}`,
      kind: "dfs",
      dfsIndex: index + 1,
      dfsStep: step,
      voiceoverId: `dfs-${step.type}-${step.nodeId ?? step.fromId ?? index}`,
      durationInFrames: dfsStepFrames(step) + (index === DFS_STEPS.length - 1 ? sec(1.5) : 0),
    });
  });

  return {
    fps: VIDEO_FPS,
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    segments,
    totalDurationInFrames: cursor,
  };
}

export const VIDEO_TIMELINE = buildVideoTimeline();
export const TOTAL_DURATION_FRAMES = VIDEO_TIMELINE.totalDurationInFrames;

export function getSegmentAtFrame(frame) {
  const segments = VIDEO_TIMELINE.segments;
  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    if (frame >= seg.startFrame && frame < seg.endFrame) {
      return { segment: seg, localFrame: frame - seg.startFrame, index: i };
    }
  }
  const last = segments[segments.length - 1];
  return { segment: last, localFrame: last.durationInFrames - 1, index: segments.length - 1 };
}

export function getSegmentByIndex(index) {
  return VIDEO_TIMELINE.segments[Math.max(0, Math.min(index, VIDEO_TIMELINE.segments.length - 1))];
}
