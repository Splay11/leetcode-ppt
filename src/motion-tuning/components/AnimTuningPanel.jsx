import { useEffect, useState } from "react";
import { useAnimTuning } from "../context/AnimTuningContext.jsx";
import {
  buildTimelineSavePayload,
  getTuningMetaFromContext,
  postTuningSave,
  stashPlayback,
} from "../utils/payload.js";
import AnimTimeline from "./AnimTimeline.jsx";
import { getSlideTimeline } from "../schema/timeline.js";

import "../styles/motion-tuning.css";

export default function AnimTuningPanel({ expanded = true, onToggleExpanded }) {
  const ctx = useAnimTuning();
  const [status, setStatus] = useState({
    text: "下方：本节拍动画时间轴 · 保存仅写入当前节拍字段 · 点选画面元素：右下角保存布局",
    ok: null,
  });
  const [replayToken, setReplayToken] = useState(0);

  const slideKey = ctx?.playback?.slideKey ?? "cover";
  const slideMeta = ctx?.slideTuning?.[slideKey];
  const maxFragment = ctx?.playback?.maxFragment ?? 1;
  const fragment = ctx?.playback?.fragment ?? 0;
  const timeline = getSlideTimeline(slideMeta, fragment);

  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z" || e.shiftKey) return;
      e.preventDefault();
      const result = ctx.undoLastChange();
      if (result.ok) {
        setStatus({
          text: `已撤回 · 还可撤 ${result.remaining} 次（最多记忆 ${ctx.maxHistory} 次）`,
          ok: true,
        });
      } else {
        setStatus({ text: "暂无可撤回的操作", ok: false });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ctx.undoLastChange, ctx.maxHistory]);

  if (!ctx?.enabled || !slideMeta) return null;

  const gesture = {
    start: ctx.beginGesture,
    end: ctx.endGesture,
  };

  const handleFragment = (value) => {
    ctx.playback?.setFragment?.(value);
    ctx.playback?.setAnimateForward?.(false);
  };

  const handleSave = async () => {
    const payload = buildTimelineSavePayload(
      slideKey,
      fragment,
      ctx.live,
      ctx.slideTuning,
      getTuningMetaFromContext(ctx),
    );
    stashPlayback(ctx.playback, ctx.playbackStorageKey);

    setStatus({ text: "保存本节拍动画中…", ok: null });
    try {
      await postTuningSave(payload, ctx.saveUrl);
      ctx.commitSavedDefaults(payload);
      setStatus({ text: "本节拍动画已保存到 animConfig.js", ok: true });
    } catch (err) {
      setStatus({
        text: `${err.message} — 请先运行 npm run tuning-server`,
        ok: false,
      });
    }
  };

  const handleReset = () => {
    const beatLabel = timeline?.label ?? `节拍 ${fragment + 1}`;
    const ok = window.confirm(`确定重置「${beatLabel}」的时间轴字段吗？\n此操作可 Ctrl+Z 撤回。`);
    if (!ok) return;
    ctx.resetTimeline(slideKey, fragment);
    setStatus({ text: `已重置「${beatLabel}」时间轴字段`, ok: true });
  };

  const handleReplay = () => {
    ctx.clearFocusTarget();
    ctx.playback?.replayBeat?.();
    setReplayToken((token) => token + 1);
    setStatus({ text: "重播本节拍…", ok: null });
  };

  return (
    <aside
      className={`md-anim-tuning${expanded ? "" : " md-anim-tuning--collapsed"}`}
      aria-label="动画调试面板"
      aria-expanded={expanded}
    >
      <div className="md-anim-tuning-panel">
        <header className="md-anim-tuning-head">
          <div className="md-anim-tuning-head-copy">
            <button
              type="button"
              className="md-anim-tuning-toggle"
              onClick={onToggleExpanded}
              aria-expanded={expanded}
              title={expanded ? "收起动画面板" : "展开动画面板"}
            >
              {expanded ? "收起 ▾" : "展开 ▸"}
            </button>
            <strong>动画时间轴</strong>
            <span className="md-anim-tuning-slide-name">{slideMeta.label}</span>
            {expanded && (
              <>
                <span className="md-anim-tuning-badge">?debug=1</span>
                <span className="md-anim-tuning-undo-hint">
                  已记忆 {ctx.undoCount}/{ctx.maxHistory} 次 · Ctrl+Z 撤回
                </span>
                <span className="md-anim-tuning-status" data-ok={status.ok}>
                  {status.text}
                </span>
              </>
            )}
          </div>
          {expanded && (
            <div className="md-anim-tuning-actions">
              <button
                type="button"
                className="md-anim-tuning-replay"
                onClick={handleReplay}
                title="回到上一节拍并立即播放当前节拍（进度条不变）"
              >
                重播
              </button>
              <button type="button" className="md-anim-tuning-reset" onClick={handleReset}>
                重置本节拍
              </button>
              <button type="button" className="md-anim-tuning-save" onClick={handleSave}>
                保存本节拍动画
              </button>
            </div>
          )}
        </header>

        <div className="md-anim-tuning-body">
          <AnimTimeline
            ctx={ctx}
            slideMeta={slideMeta}
            timeline={timeline}
            gesture={gesture}
            replayToken={replayToken}
          />

          <div className="md-anim-tuning-scrub md-anim-tuning-scrub--dock">
            <div className="md-anim-tuning-scrub-head">
              <span className="md-anim-tuning-scrub-title">节拍</span>
              <span className="md-anim-tuning-scrub-count">
                {fragment + 1} / {maxFragment + 1}
              </span>
            </div>
            <input
              type="range"
              className="md-anim-tuning-scrub-line"
              min={0}
              max={maxFragment}
              step={1}
              value={fragment}
              aria-label={`节拍 ${fragment + 1} / ${maxFragment + 1}`}
              onPointerDown={gesture.start}
              onChange={(e) => handleFragment(Number(e.target.value))}
              onPointerUp={gesture.end}
              onPointerCancel={gesture.end}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
