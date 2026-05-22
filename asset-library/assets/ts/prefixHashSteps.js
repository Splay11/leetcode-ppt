import { SIM_CASE_FOUND, SIM_CASE_MISS } from "./constants.js";

/**
 * 前缀哈希逐步事件（每轮 3 拍，无冗余中间态）
 * focus → 高亮 num[j]、j 指针移动并清空查询框
 * show_need → 查询框展示 target − num[j]
 * add / found → 未命中则虚线框扩张；命中则高亮配对下标
 */
export function buildPrefixHashSteps(nums, target) {
  const steps = [];
  const indexByValue = new Map();

  for (let j = 0; j < nums.length; j += 1) {
    const value = nums[j];
    const need = target - value;

    steps.push({ type: "focus", j, value, target });
    steps.push({ type: "show_need", j, value, target, need });

    const partnerIndex = indexByValue.has(need) ? indexByValue.get(need) : -1;

    if (partnerIndex >= 0) {
      steps.push({
        type: "found",
        j,
        partnerIndex,
        pair: [partnerIndex, j],
        values: [nums[partnerIndex], value],
        target,
        need,
      });
      return steps;
    }

    indexByValue.set(value, j);
    steps.push({
      type: "add",
      j,
      value,
      need,
      prefixIndices: Array.from({ length: j + 1 }, (_, i) => i),
    });
  }

  return steps;
}

export const PREFIX_HASH_STEPS_FOUND = buildPrefixHashSteps(
  SIM_CASE_FOUND.nums,
  SIM_CASE_FOUND.target,
);

export const PREFIX_HASH_STEPS_MISS = buildPrefixHashSteps(
  SIM_CASE_MISS.nums,
  SIM_CASE_MISS.target,
);

/** @deprecated use PREFIX_HASH_STEPS_FOUND */
export const PREFIX_HASH_STEPS = PREFIX_HASH_STEPS_FOUND;
