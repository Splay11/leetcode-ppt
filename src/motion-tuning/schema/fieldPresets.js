/** 调试面板字段预设：滑块窄范围 + 数字框宽范围 + 显式 unit */

export const RANGE = (label, min, max, step = 1, inputMin, inputMax, unit) => ({
  label,
  min,
  max,
  step,
  inputMin: inputMin ?? min,
  inputMax: inputMax ?? max,
  unit,
});

export const SEC = (label) => RANGE(label, 0, 2, 0.01, 0, 10, "");
export const MS = (label) => RANGE(label, 0, 2000, 10, 0, 10000, "");
export const PX = (label) => RANGE(label, -120, 120, 1, -2000, 2000, "px");
export const PCT = (label) => RANGE(label, -40, 40, 1, -100, 200, "%");
export const PCT0 = (label) => RANGE(label, 0, 100, 1, 0, 200, "%");
export const SCALE = (label) => RANGE(label, 0.5, 2.5, 0.01, 0, 5, "");
export const FONT = (label) => RANGE(label, 12, 72, 1, 8, 200, "px");
