import { useEffect, useMemo, useRef, useState } from "react";
import TuningClipFields from "./TuningClipFields.jsx";
import TuningGapField from "./TuningGapField.jsx";
import { compileTimelineLanes, msToPx } from "../utils/timelineLayout.js";

const LANE_ROW_PX = 34;
const RULER_PX = 16;
const TRACK_MIN_PX = 240;

export default function AnimTimeline({ ctx, slideMeta, timeline, gesture, replayToken = 0 }) {
  const cssVarsBlock = ctx.cssVarsBlock ?? "DECK_CSS_VARS";
  const { lanes, totalMs } = useMemo(
    () => compileTimelineLanes(timeline, slideMeta, ctx.live, cssVarsBlock),
    [timeline, slideMeta, ctx.live, cssVarsBlock],
  );

  const [selectedId, setSelectedId] = useState(null);
  const [playheadMs, setPlayheadMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackScale, setTrackScale] = useState(1);
  const playRafRef = useRef(null);
  const playStartRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const trackColRef = useRef(null);

  const trackLogicalWidthPx = Math.max(msToPx(totalMs), TRACK_MIN_PX);
  const canvasHeightPx = lanes.length * LANE_ROW_PX + RULER_PX;
  const selectedLane = lanes.find((lane) => lane.id === selectedId) ?? null;
  const playheadPx = msToPx(playheadMs) * trackScale;

  useEffect(() => {
    if (!lanes.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => (prev && lanes.some((lane) => lane.id === prev) ? prev : lanes[0].id));
  }, [timeline?.label, lanes]);

  useEffect(() => {
    return () => {
      if (playRafRef.current) cancelAnimationFrame(playRafRef.current);
    };
  }, []);

  useEffect(() => {
    const trackCol = trackColRef.current;
    if (!trackCol) return undefined;

    const updateScale = () => {
      const avail = trackCol.clientWidth;
      if (!avail) return;
      setTrackScale(Math.min(1, avail / trackLogicalWidthPx));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(trackCol);
    return () => ro.disconnect();
  }, [trackLogicalWidthPx, lanes.length]);

  useEffect(() => {
    if (!replayToken) return;

    if (playRafRef.current) cancelAnimationFrame(playRafRef.current);
    setIsPlaying(true);
    setPlayheadMs(0);
    playStartRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - playStartRef.current;
      const next = Math.min(elapsed, totalMs);
      setPlayheadMs(next);
      if (next < totalMs) {
        playRafRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        playRafRef.current = null;
      }
    };

    playRafRef.current = requestAnimationFrame(tick);
  }, [replayToken, totalMs]);

  if (!timeline?.segments?.length) {
    return (
      <p className="md-anim-tuning-timeline-empty">
        当前节拍暂无时间轴配置；可在 animTimeline.js 中为 fragment 添加 segments。
      </p>
    );
  }

  return (
    <div className="md-anim-tuning-timeline">
      {timeline.label && (
        <p className="md-anim-tuning-timeline-label">{timeline.label}</p>
      )}

      <div className="md-anim-tuning-h-layout">
        <aside className="md-anim-tuning-h-sidebar">
          {selectedLane ? (
            <>
              <header className="md-anim-tuning-h-sidebar-head">
                <strong>{selectedLane.title}</strong>
                {selectedLane.segmentTitle && (
                  <span className="md-anim-tuning-h-sidebar-meta">{selectedLane.segmentTitle}</span>
                )}
              </header>
              <div className="md-anim-tuning-h-sidebar-body">
                {selectedLane.kind === "gap" ? (
                  <TuningGapField
                    ctx={ctx}
                    slideMeta={slideMeta}
                    gap={selectedLane.gap}
                    gesture={gesture}
                  />
                ) : (
                  <TuningClipFields
                    ctx={ctx}
                    slideMeta={slideMeta}
                    clip={selectedLane.clip}
                    gesture={gesture}
                  />
                )}
              </div>
            </>
          ) : (
            <p className="md-anim-tuning-h-sidebar-empty">点击右侧圆角按钮选择要调节的动画</p>
          )}
        </aside>

        <div ref={canvasWrapRef} className="md-anim-tuning-h-canvas-wrap">
          <div
            className="md-anim-tuning-h-canvas"
            style={{ minHeight: `${canvasHeightPx}px` }}
            data-playing={isPlaying ? "true" : "false"}
          >
            <div
              className="md-anim-tuning-h-grid"
              style={{
                gridTemplateRows: `repeat(${lanes.length}, ${LANE_ROW_PX}px) ${RULER_PX}px`,
              }}
            >
              {lanes.map((lane, index) => {
                const leftPx = msToPx(lane.startMs);
                const widthPx = Math.max(msToPx(lane.durationMs), 8);
                const active = lane.id === selectedId;
                const row = index + 1;

                return (
                  <div key={lane.id} className="md-anim-tuning-h-row">
                    <button
                      type="button"
                      className={`md-anim-tuning-h-chip${active ? " is-active" : ""}${
                        lane.kind === "gap" ? " is-gap" : ""
                      }`}
                      style={{ gridRow: row, gridColumn: 1 }}
                      onClick={() => setSelectedId(lane.id)}
                      title={lane.segmentTitle ? `${lane.title} · ${lane.segmentTitle}` : lane.title}
                    >
                      {lane.title}
                    </button>
                    <div
                      ref={index === 0 ? trackColRef : undefined}
                      className="md-anim-tuning-h-track-slot"
                      style={{ gridRow: row, gridColumn: 2 }}
                    >
                      <div
                        className="md-anim-tuning-h-track-scaler"
                        style={{
                          width: `${trackLogicalWidthPx}px`,
                          transform: `scaleX(${trackScale})`,
                        }}
                      >
                        <div className="md-anim-tuning-h-track">
                          <div
                            className={`md-anim-tuning-h-bar${lane.kind === "gap" ? " is-gap" : ""}${
                              active ? " is-active" : ""
                            }`}
                            style={{
                              left: `${leftPx}px`,
                              width: `${widthPx}px`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                className="md-anim-tuning-h-ruler-spacer"
                style={{ gridRow: lanes.length + 1, gridColumn: 1 }}
                aria-hidden
              />
              <div
                className="md-anim-tuning-h-ruler-slot"
                style={{ gridRow: lanes.length + 1, gridColumn: 2 }}
              >
                <div
                  className="md-anim-tuning-h-ruler-scaler"
                  style={{
                    width: `${trackLogicalWidthPx}px`,
                    transform: `scaleX(${trackScale})`,
                  }}
                >
                  <div className="md-anim-tuning-h-ruler">
                    <span>0 ms</span>
                    <span>{Math.round(totalMs)} ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="md-anim-tuning-h-playhead-layer"
              style={{ bottom: `${RULER_PX}px` }}
            >
              <div className="md-anim-tuning-h-playhead-rail">
                <div
                  className="md-anim-tuning-h-playhead"
                  style={{ transform: `translateX(${playheadPx}px)` }}
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
