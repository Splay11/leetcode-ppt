import { useEffect } from "react";
import { useAnimTuning } from "../context/AnimTuningContext.jsx";

/**
 * 向 motion-tuning 注册当前页播放进度（替代手写 registerPlayback effect）
 */
export function useTuningPlayback(playback) {
  const tuning = useAnimTuning();

  useEffect(() => {
    if (!playback || !tuning?.registerPlayback) return;
    tuning.registerPlayback(playback);
  }, [
    tuning?.registerPlayback,
    playback?.slideKey,
    playback?.slideIndex,
    playback?.fragment,
    playback?.maxFragment,
    playback?.setFragment,
    playback?.setSlideIndex,
    playback?.setAnimateForward,
    playback?.replayBeat,
  ]);
}
