import { AbsoluteFill, useCurrentFrame } from "remotion";
import VideoDeck from "../VideoDeck.jsx";

export default function MaxDepthVideoComposition() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f8f1e5" }}>
      <VideoDeck frame={frame} />
    </AbsoluteFill>
  );
}
