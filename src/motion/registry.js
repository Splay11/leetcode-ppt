import MaxDepthPresentation from "../maxDepth/MaxDepthPresentation.jsx";
import InvertBinaryTreePresentation from "./invertBinaryTree/InvertBinaryTreePresentation.jsx";

/** @typedef {"done" | "wip" | "planned"} TopicStatus */

/**
 * Motion 知识点注册表（App 按 id 加载对应 Deck）
 * @type {Array<{
 *   id: string;
 *   leetcode: number;
 *   label: string;
 *   status: TopicStatus;
 *   path: string;
 *   component: import("react").ComponentType;
 * }>}
 */
export const MOTION_TOPICS = [
  {
    id: "maxDepth",
    leetcode: 104,
    label: "二叉树的最大深度",
    status: "done",
    path: "src/maxDepth",
    component: MaxDepthPresentation,
  },
  {
    id: "invertBinaryTree",
    leetcode: 226,
    label: "翻转二叉树",
    status: "wip",
    path: "src/motion/invertBinaryTree",
    component: InvertBinaryTreePresentation,
  },
  {
    id: "symmetricTree",
    leetcode: 101,
    label: "对称二叉树",
    status: "planned",
    path: "src/motion/symmetricTree",
    component: null,
  },
  {
    id: "validateBst",
    leetcode: 98,
    label: "验证二叉搜索树",
    status: "planned",
    path: "src/motion/validateBst",
    component: null,
  },
];

const DEFAULT_TOPIC_ID = import.meta.env.VITE_TOPIC || "invertBinaryTree";

export function getTopicIdFromLocation() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("topic");
}

export function resolveTopicId() {
  return getTopicIdFromLocation() || DEFAULT_TOPIC_ID;
}

export function getTopicById(id) {
  return MOTION_TOPICS.find((t) => t.id === id) ?? null;
}

export function resolveActiveTopic() {
  const id = resolveTopicId();
  const topic = getTopicById(id);
  if (!topic?.component) {
    const fallback = getTopicById(DEFAULT_TOPIC_ID);
    if (fallback?.component) {
      console.warn(`[motion] 未知或未实现题目 "${id}"，回退到 ${DEFAULT_TOPIC_ID}`);
      return fallback;
    }
    throw new Error(`[motion] 无法加载题目: ${id}`);
  }
  return topic;
}
