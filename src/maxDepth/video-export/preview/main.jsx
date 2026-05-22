import { Player } from "@remotion/player";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MaxDepthVideoComposition from "../remotion/MaxDepthVideoComposition.jsx";
import {
  TOTAL_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../videoTimeline.js";
import "../video-preview.css";

function VideoPreviewApp() {
  return (
    <div className="md-video-preview">
      <header className="md-video-preview__head">
        <h1>maxDepth 视频导出预览</h1>
        <p>
          独立入口，不影响原 PPT 交互演示（<code>index.html</code>）。
          口播稿见 <code>src/maxDepth/video-export/voiceover-script.md</code>
        </p>
      </header>
      <div className="md-video-preview__player">
        <Player
          component={MaxDepthVideoComposition}
          durationInFrames={TOTAL_DURATION_FRAMES}
          fps={VIDEO_FPS}
          compositionWidth={VIDEO_WIDTH}
          compositionHeight={VIDEO_HEIGHT}
          style={{ width: "100%", aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}` }}
          controls
          loop
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VideoPreviewApp />
  </StrictMode>,
);
