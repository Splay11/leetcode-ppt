import { PCT0, SCALE } from "../../motion-tuning/schema/fieldPresets.js";

const PREFIX = "ibt";

export function layoutLeftKey(slug) {
  return `--${PREFIX}-${slug}-left`;
}

export function layoutSizeKey(slug) {
  return `--${PREFIX}-${slug}-layout-size`;
}

export function layoutBaseFieldEntries(slug) {
  return {
    [layoutLeftKey(slug)]: PCT0("水平位置 (%)"),
    [layoutSizeKey(slug)]: SCALE("大小 (缩放)"),
  };
}

export function mergeLayoutBase(fields, slug) {
  return {
    ...layoutBaseFieldEntries(slug),
    ...fields,
  };
}
