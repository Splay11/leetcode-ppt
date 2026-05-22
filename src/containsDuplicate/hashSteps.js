import { DEMO_NUMS } from "./constants.js";

/**
 * 哈希做法逐步事件（与 design.md「一步一节拍」对齐）
 */
export function buildHashSteps(nums = DEMO_NUMS) {
  const steps = [];
  const set = new Set();

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    steps.push({ type: "focus", index, value });
    steps.push({
      type: "check",
      index,
      value,
      inSet: set.has(value),
    });
    if (set.has(value)) {
      steps.push({ type: "dup", index, value });
      steps.push({ type: "done", result: true });
      return steps;
    }
    set.add(value);
    steps.push({ type: "add", index, value, setSnapshot: [...set] });
  }

  steps.push({ type: "done", result: false });
  return steps;
}

export const HASH_STEPS = buildHashSteps();
