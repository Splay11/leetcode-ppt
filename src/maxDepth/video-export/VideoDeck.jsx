import { useEffect, useRef } from "react";
import { DECK_CSS_VARS, DECK_TRANSITION } from "../animConfig.js";
import { applyDeckCssVars } from "../deckTheme.js";
import "../max-depth.css";
import {
  getSegmentAtFrame,
  getSegmentByIndex,
  VIDEO_FPS,
} from "./videoTimeline.js";
import VideoCoverSlide from "./slides/VideoCoverSlide.jsx";
import VideoSummarySlide from "./slides/VideoSummarySlide.jsx";
import VideoDfsSlide from "./slides/VideoDfsSlide.jsx";
import { lerp } from "./remotionUtils.js";

function renderSegment(segment, localFrame) {
  switch (segment.kind) {
    case "cover":
      return <VideoCoverSlide phase={segment.phase} localFrame={localFrame} fps={VIDEO_FPS} />;
    case "summary":
      return <VideoSummarySlide step={segment.step} localFrame={localFrame} />;
    case "dfs":
      return <VideoDfsSlide dfsIndex={segment.dfsIndex} />;
    default:
      return null;
  }
}

/** 帧驱动视频 deck — 独立于 MaxDepthPresentation，不影响原 PPT 交互流 */
export default function VideoDeck({ frame }) {
  const deckRef = useRef(null);
  const { segment, localFrame, index } = getSegmentAtFrame(frame);

  useEffect(() => {
    applyDeckCssVars(deckRef.current, DECK_CSS_VARS);
  }, []);

  if (segment.kind === "transition") {
    const prev = getSegmentByIndex(index - 1);
    const next = getSegmentByIndex(index + 1);
    const t = localFrame / segment.durationInFrames;
    const exitOpacity = 1 - t;
    const enterOpacity = t;
    const exitY = lerp(0, DECK_TRANSITION.exitY, t);
    const enterY = lerp(DECK_TRANSITION.initialY, 0, t);

    return (
      <div ref={deckRef} className="md-deck md-deck--video-export">
        <div
          className="md-slide"
          style={{
            opacity: exitOpacity,
            transform: `translateY(${exitY}px) scale(${lerp(1, DECK_TRANSITION.scale, t)})`,
          }}
        >
          {renderSegment(prev, prev.durationInFrames - 1)}
        </div>
        <div
          className="md-slide"
          style={{
            opacity: enterOpacity,
            transform: `translateY(${enterY}px) scale(${lerp(DECK_TRANSITION.scale, 1, t)})`,
          }}
        >
          {renderSegment(next, 0)}
        </div>
      </div>
    );
  }

  return (
    <div ref={deckRef} className="md-deck md-deck--video-export">
      <div className="md-slide">{renderSegment(segment, localFrame)}</div>
    </div>
  );
}
