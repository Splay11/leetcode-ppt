export const PROBLEM = {
  leetcode: "LeetCode 1",
  title: "两数之和",
  titleEn: "Two Sum",
  difficulty: "easy",
  difficultyText: "简单",
};

/** 题意页样例（Target=9，高亮 4+5） */
export const BRIEF_NUMS = [3, 4, 5, 3, 6];
export const BRIEF_TARGET = 9;
export const BRIEF_ANSWER = [1, 2];

export const BRIEF = {
  title: "题目大意",
  content:
    "给定整数数组 <b>nums</b> 和目标值 <b>target</b>，在数组中找到<strong>两个不同下标</strong> <b>i</b>、<b>j</b>，使得 <b>nums[i] + nums[j] = target</b>，返回 <b>[i, j]</b>。",
};

export const SUMMARY_ITEMS = [
  "用下标 <strong>j</strong> 从左到右扫描数组，维护前缀区间 <strong>[0, j−1]</strong> 的哈希表",
  "每次查询 <strong>target − num[j]</strong> 是否已出现在前缀哈希中",
  "未命中则将 <strong>num[j]</strong> 加入前缀，供后续 j 使用；命中则返回两个下标",
  "时间复杂度 <strong>O(n)</strong>，空间复杂度 <strong>O(n)</strong>",
];

export const CODE_LINES = [
  { indent: 0, parts: [{ t: "kw", v: "for" }, { t: "plain", v: " j in range(n):" }] },
  { indent: 1, parts: [{ t: "plain", v: "need = target - nums[j]" }] },
  { indent: 1, parts: [{ t: "kw", v: "if" }, { t: "plain", v: " need in seen:" }] },
  { indent: 2, parts: [{ t: "kw", v: "return" }, { t: "plain", v: " " }, { t: "ret", v: "[seen[need], j]" }] },
  { indent: 1, parts: [{ t: "plain", v: "seen[nums[j]] = j" }] },
];

/** 模拟 Case 1：找到解 */
export const SIM_CASE_FOUND = {
  key: "found",
  title: "样例 1 · 找到解",
  nums: [5, 4, 5, 3, 6],
  target: 8,
};

/** 模拟 Case 2：扫描完毕无解 */
export const SIM_CASE_MISS = {
  key: "miss",
  title: "样例 2 · 未找到",
  nums: [1, 2, 3, 4],
  target: 100,
};
