import TuningSliderRow from "./TuningSliderRow.jsx";
import { formatCssVarValue, parseCssVarNumber } from "../schema/cssVar.js";

export default function TuningGroupFields({
  ctx,
  group,
  gesture,
  arrayIndex = null,
  compact = false,
  fieldsOverride = null,
}) {
  const unitRules = ctx.cssVarUnitRules;
  const fieldMap = fieldsOverride ?? group.fields ?? {};

  const cssVars = ctx.getCssVars?.() ?? ctx.live[ctx.cssVarsBlock];

  const readFieldValue = (fieldKey) => {
    if (group.kind === "css") {
      return parseCssVarNumber(fieldKey, cssVars[fieldKey]);
    }
    return ctx.live[group.block][fieldKey];
  };

  const writeFieldValue = (fieldKey, num) => {
    if (group.kind === "css") {
      const fieldUnit = group.fields[fieldKey]?.unit;
      ctx.updateCssVar(fieldKey, formatCssVarValue(fieldKey, num, unitRules, fieldUnit));
      return;
    }
    ctx.updateBlockField(group.block, fieldKey, num);
  };

  const fieldProps = (fieldKey, field) => ({
    label: field.label,
    min: field.min,
    max: field.max,
    inputMin: field.inputMin ?? field.min,
    inputMax: field.inputMax ?? field.max,
    step: field.step,
    onGestureStart: gesture.start,
    onGestureEnd: gesture.end,
    refText: compact ? undefined : `${group.source.file}:${group.source.lines}`,
  });

  const renderArrayFields = (item, index) =>
    Object.entries(group.fields).map(([fieldKey, field]) => (
      <TuningSliderRow
        key={fieldKey}
        {...fieldProps(fieldKey, field)}
        value={item[fieldKey] ?? 0}
        onChange={(num) => ctx.updateArrayField(group.block, index, fieldKey, num)}
      />
    ));

  if (group.kind === "array") {
    if (arrayIndex != null) {
      const item = (ctx.live[group.block] || [])[arrayIndex];
      if (!item) return null;
      return (
        <div className="md-anim-tuning-array-fields">
          <p className="md-anim-tuning-focus-node">{item.label || `节点 ${item.id}`}</p>
          {renderArrayFields(item, arrayIndex)}
        </div>
      );
    }

    return (
      <div className="md-anim-tuning-array">
        {(ctx.live[group.block] || []).map((item, index) => (
          <details key={item.id} className="md-anim-tuning-array-item">
            <summary className="md-anim-tuning-array-summary">
              <span>{item.label || `节点 ${item.id}`}</span>
              <span className="md-anim-tuning-array-meta">
                X {item.shiftX ?? 0} · Y {item.shiftY ?? 0}
              </span>
            </summary>
            <div className="md-anim-tuning-array-fields">{renderArrayFields(item, index)}</div>
          </details>
        ))}
      </div>
    );
  }

  return Object.entries(fieldMap).map(([fieldKey, field]) => (
    <TuningSliderRow
      key={fieldKey}
      {...fieldProps(fieldKey, field)}
      value={readFieldValue(fieldKey)}
      onChange={(num) => writeFieldValue(fieldKey, num)}
      formatDisplay={
        group.kind === "css"
          ? (n) => formatCssVarValue(fieldKey, n, unitRules, field.unit)
          : undefined
      }
    />
  ));
}
