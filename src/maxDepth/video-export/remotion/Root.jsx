import { Composition } from "remotion";
import MaxDepthVideoComposition from "./MaxDepthVideoComposition.jsx";
import {
  TOTAL_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../videoTimeline.js";

export const RemotionRoot = () => (
  <>
    <Composition
      id="MaxDepth104"
      component={MaxDepthVideoComposition}
      durationInFrames={TOTAL_DURATION_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{}}
    />
  </>
);
