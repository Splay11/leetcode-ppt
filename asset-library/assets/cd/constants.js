export const PROBLEM = {
  leetcode: "LeetCode 217",
  title: "存在重复元素",
  titleEn: "Contains Duplicate",
  difficulty: "easy",
  difficultyText: "简单",
};

/** 演示样例：末尾出现重复 1 */
export const DEMO_NUMS = [1, 2, 3, 1];

export const BRIEF = {
  title: "题目大意",
  content:
    "给定一个整数数组 <b>nums</b>，若其中<strong>存在任意一个值出现至少两次</strong>，返回 <b>true</b>；若每个元素互不相同，返回 <b>false</b>。",
};

export const SUMMARY_ITEMS = [
  "从左到右扫描数组，维护一个<strong>哈希集合</strong>记录已见过的元素",
  "每次先看 <strong>nums[i]</strong> 是否已在集合中：在则立刻返回 <strong>true</strong>",
  "不在则把当前值<strong>加入集合</strong>，继续扫描下一个下标",
  "全部扫完仍无重复 → 返回 <strong>false</strong>；时间复杂度 <strong>O(n)</strong>",
];
