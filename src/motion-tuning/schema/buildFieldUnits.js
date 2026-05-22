/** 从 schema 提取 CSS 字段 unit（优先于变量名猜测） */

export function buildFieldUnits(slideTuning) {
  const units = {};
  if (!slideTuning) return units;

  Object.values(slideTuning).forEach((slide) => {
    slide.groups?.forEach((group) => {
      if (group.kind !== "css" || !group.fields) return;
      Object.entries(group.fields).forEach(([key, field]) => {
        if (field.unit != null && field.unit !== "") {
          units[key] = field.unit;
        }
      });
    });
  });

  return units;
}
