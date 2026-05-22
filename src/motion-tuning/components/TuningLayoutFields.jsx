import TuningSliderRow from "./TuningSliderRow.jsx";
import { formatCssVarValue, parseCssVarNumber } from "../schema/cssVar.js";

/** 附加在 DECK_CSS_VARS 上的 left / layout-size 基座字段 */
export default function TuningLayoutFields({ ctx, group, gesture }) {
  if (!group?.layoutFields || !group?.layoutBlock) return null;

  const unitRules = ctx.cssVarUnitRules;
  const cssVarsBlock = group.layoutBlock === ctx.cssVarsBlock ? ctx.cssVarsBlock : group.layoutBlock;
  const cssVars = ctx.live[cssVarsBlock] ?? {};

  return Object.entries(group.layoutFields).map(([fieldKey, field]) => (
    <TuningSliderRow
      key={fieldKey}
      label={field.label}
      min={field.min}
      max={field.max}
      inputMin={field.inputMin ?? field.min}
      inputMax={field.inputMax ?? field.max}
      step={field.step}
      value={parseCssVarNumber(fieldKey, cssVars[fieldKey])}
      onChange={(num) =>
        ctx.updateCssVar(fieldKey, formatCssVarValue(fieldKey, num, unitRules, field.unit))
      }
      onGestureStart={gesture.start}
      onGestureEnd={gesture.end}
      formatDisplay={(n) => formatCssVarValue(fieldKey, n, unitRules, field.unit)}
    />
  ));
}
