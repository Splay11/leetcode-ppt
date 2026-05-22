export default function TuningTextRow({
  label,
  value,
  onChange,
  onGestureStart,
  onGestureEnd,
  placeholder,
}) {
  return (
    <label className="md-anim-tuning-text-row">
      <span className="md-anim-tuning-row-label">{label}</span>
      <input
        type="text"
        className="md-anim-tuning-text-input"
        value={value ?? ""}
        placeholder={placeholder}
        onFocus={onGestureStart}
        onBlur={onGestureEnd}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
