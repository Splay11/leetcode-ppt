import { useEffect, useState } from "react";
import { clampNumber } from "../utils/clone.js";

export default function TuningSliderRow({
  label,
  min,
  max,
  inputMin = min,
  inputMax = max,
  step = 1,
  value,
  onChange,
  onGestureStart,
  onGestureEnd,
  formatDisplay,
  refText,
  onHoverRef,
  onHoverClear,
}) {
  const [draft, setDraft] = useState(() => String(value));
  const sliderValue = clampNumber(value, min, max);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const applyClamped = (raw) => {
    const num = clampNumber(Number(raw), inputMin, inputMax);
    onChange(num);
    setDraft(String(num));
    return num;
  };

  const display = formatDisplay ? formatDisplay(value) : String(value);

  return (
    <label
      className="md-anim-tuning-row"
      onMouseEnter={onHoverRef}
      onMouseLeave={onHoverClear}
    >
      <span className="md-anim-tuning-row-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onPointerDown={onGestureStart}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={onGestureEnd}
        onPointerCancel={onGestureEnd}
      />
      <input
        type="number"
        className="md-anim-tuning-num"
        step={step}
        value={draft}
        title={`当前 ${display}，滑块 ${min}–${max}，可输入 ${inputMin}–${inputMax}`}
        onFocus={onGestureStart}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          applyClamped(draft);
          onGestureEnd();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />
      {refText && <span className="md-anim-tuning-row-ref">{refText}</span>}
    </label>
  );
}
