import TuningSliderRow from "./TuningSliderRow.jsx";
import { resolveGapField } from "../schema/timeline.js";

/** 列与列之间的等待间隔（afterMs） */
export default function TuningGapField({ ctx, slideMeta, gap, gesture }) {
  const resolved = resolveGapField(slideMeta, gap);
  if (!resolved) return null;

  const { group, key, field } = resolved;
  const value = ctx.live[group.block]?.[key] ?? 0;

  return (
    <div className="md-anim-tuning-gap">
      <TuningSliderRow
        label={field.label}
        min={field.min}
        max={field.max}
        inputMin={field.inputMin ?? field.min}
        inputMax={field.inputMax ?? field.max}
        step={field.step}
        value={value}
        onChange={(num) => ctx.updateBlockField(group.block, key, num)}
        onGestureStart={gesture.start}
        onGestureEnd={gesture.end}
      />
    </div>
  );
}
