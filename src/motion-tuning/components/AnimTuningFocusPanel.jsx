import { useState } from "react";
import { useAnimTuning } from "../context/AnimTuningContext.jsx";
import {
  buildGroupSavePayload,
  getTuningMetaFromContext,
  postTuningSave,
  stashPlayback,
} from "../utils/payload.js";
import TuningGroupFields from "./TuningGroupFields.jsx";
import TuningLayoutFields from "./TuningLayoutFields.jsx";
import TuningTextFields from "./TuningTextFields.jsx";
import {
  clipsForPickGroup,
  getSlideTimeline,
  isLayoutGroup,
  resolveGroup,
} from "../schema/timeline.js";

export default function AnimTuningFocusPanel() {
  const ctx = useAnimTuning();
  const slideKey = ctx?.playback?.slideKey ?? "cover";
  const slideMeta = ctx?.slideTuning?.[slideKey];
  const focus = ctx?.focusTarget;
  const fragment = ctx?.playback?.fragment ?? 0;
  const [status, setStatus] = useState({ text: "", ok: null });

  if (!ctx?.enabled || !focus?.groupId || !slideMeta) return null;

  const group = resolveGroup(slideMeta, focus.groupId);
  if (!group) return null;

  const gesture = { start: ctx.beginGesture, end: ctx.endGesture };
  const layout = isLayoutGroup(group);
  const showMotionFields = group.role !== "motion";
  const timeline = getSlideTimeline(slideMeta, fragment);
  const linkedClips = clipsForPickGroup(timeline, focus.groupId);

  let arrayIndex = focus.arrayIndex;
  if (group.kind === "array" && focus.nodeId) {
    arrayIndex = (ctx.live[group.block] || []).findIndex((item) => item.id === focus.nodeId);
    if (arrayIndex < 0) arrayIndex = 0;
  }

  const handleReset = () => {
    ctx.resetGroup(slideKey, group.id);
    setStatus({ text: "已重置本卡片", ok: true });
  };

  const handleSave = async () => {
    const payload = buildGroupSavePayload(
      slideKey,
      group.id,
      ctx.live,
      ctx.slideTuning,
      getTuningMetaFromContext(ctx),
    );
    stashPlayback(ctx.playback, ctx.playbackStorageKey);
    setStatus({ text: "保存布局中…", ok: null });
    try {
      await postTuningSave(payload, ctx.saveUrl);
      ctx.commitSavedDefaults(payload);
      setStatus({ text: "布局已保存到 animConfig.js", ok: true });
    } catch (err) {
      setStatus({
        text: `${err.message} — 请先运行 npm run tuning-server`,
        ok: false,
      });
    }
  };

  return (
    <div
      className="md-anim-tuning-focus"
      role="dialog"
      aria-label={`布局：${group.title}`}
      onClick={(e) => e.stopPropagation()}
    >
      <header className="md-anim-tuning-focus-head">
        <strong>{layout ? "布局 / 外观" : "选中对象"} · {group.title}</strong>
        <button type="button" className="md-anim-tuning-focus-close" onClick={() => ctx.clearFocusTarget()}>
          关闭
        </button>
      </header>

      <div className="md-anim-tuning-focus-body">
        {!showMotionFields && (
          <p className="md-anim-tuning-group-hint">
            动画时长请在下方<strong>时间轴</strong>调节。
            {linkedClips.length > 0 && (
              <>
                <br />
                相关动画：{linkedClips.join(" · ")}
              </>
            )}
          </p>
        )}

        {layout && group.hint && showMotionFields && (
          <p className="md-anim-tuning-group-hint">{group.hint}</p>
        )}

        <TuningTextFields ctx={ctx} group={group} gesture={gesture} />

        {group.layoutFields && group.role === "motion" && (
          <TuningLayoutFields ctx={ctx} group={group} gesture={gesture} />
        )}

        {showMotionFields && layout ? (
          <TuningGroupFields
            ctx={ctx}
            group={group}
            gesture={gesture}
            arrayIndex={group.kind === "array" ? arrayIndex : null}
            compact
          />
        ) : (
          !layout && (
            <p className="md-anim-tuning-focus-empty">
              无可编辑的布局参数。请切换到对应节拍，在底部时间轴调节动画。
            </p>
          )
        )}
      </div>

      <footer className="md-anim-tuning-focus-foot">
        {status.text && (
          <span className="md-anim-tuning-focus-status" data-ok={status.ok}>
            {status.text}
          </span>
        )}
        <div className="md-anim-tuning-focus-actions">
          <button type="button" className="md-anim-tuning-reset" onClick={handleReset} disabled={!layout}>
            重置布局
          </button>
          <button type="button" className="md-anim-tuning-save" onClick={handleSave} disabled={!layout}>
            保存布局
          </button>
        </div>
      </footer>
    </div>
  );
}
