import TuningSliderRow from "./TuningSliderRow.jsx";
import { formatCssVarValue, parseCssVarNumber } from "../schema/cssVar.js";

/** 时间轴 clip：渲染 group 内指定 fieldKeys 的滑块 */
export default function TuningClipFields({ ctx, slideMeta, clip, gesture }) {
  const unitRules = ctx.cssVarUnitRules;
  const group = slideMeta.groups.find((g) => g.id === clip.groupId);
  if (!group) return null;

  const keys = clip.fieldKeys ?? Object.keys(group.fields ?? {});
  const cssVars = ctx.getCssVars?.() ?? ctx.live[ctx.cssVarsBlock];

  const readFieldValue = (fieldKey) => {
    if (group.kind === "css") {
      return parseCssVarNumber(fieldKey, cssVars[fieldKey]);
    }
    return ctx.live[group.block]?.[fieldKey];
  };

  const writeFieldValue = (fieldKey, num) => {
    if (group.kind === "css") {
      const fieldUnit = group.fields[fieldKey]?.unit;
      ctx.updateCssVar(fieldKey, formatCssVarValue(fieldKey, num, unitRules, fieldUnit));
      return;
    }
    ctx.updateBlockField(group.block, fieldKey, num);
  };

  return keys
    .filter((key) => group.fields?.[key])
    .map((fieldKey) => {
      const field = group.fields[fieldKey];
      return (
        <TuningSliderRow
          key={fieldKey}
          label={field.label}
          min={field.min}
          max={field.max}
          inputMin={field.inputMin ?? field.min}
          inputMax={field.inputMax ?? field.max}
          step={field.step}
          value={readFieldValue(fieldKey)}
          onChange={(num) => writeFieldValue(fieldKey, num)}
          onGestureStart={gesture.start}
          onGestureEnd={gesture.end}
          formatDisplay={
            group.kind === "css"
              ? (n) => formatCssVarValue(fieldKey, n, unitRules, field.unit)
              : undefined
          }
        />
      );
    });
}
