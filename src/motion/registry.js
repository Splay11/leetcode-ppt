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

const DEFAULT_TOPIC_ID = import.meta.env.VITE_TOPIC || null;

function stripBaseFromPathname(pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (!base || base === "/" || !normalized.startsWith(base)) {
    return normalized;
  }
  const rest = normalized.slice(base.length) || "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/** 从 URL 路径解析题目 id，如 /leetcode-ppt/maxDepth → maxDepth */
export function getTopicIdFromPath() {
  if (typeof window === "undefined") return null;

  const segment = stripBaseFromPathname(window.location.pathname)
    .split("/")
    .filter(Boolean)[0];

  if (!segment || segment === "index.html") return null;
  return segment;
}

export function getTopicIdFromLocation() {
  if (typeof window === "undefined") return null;

  const fromQuery = new URLSearchParams(window.location.search).get("topic");
  if (fromQuery) return fromQuery;

  return getTopicIdFromPath();
}

export function resolveTopicId() {
  return getTopicIdFromLocation() || DEFAULT_TOPIC_ID;
}

export function getTopicById(id) {
  return MOTION_TOPICS.find((t) => t.id === id) ?? null;
}

export function resolveActiveTopic() {
  const id = resolveTopicId();
  if (!id) return null;

  const topic = getTopicById(id);
  if (!topic?.component) {
    const fallback = DEFAULT_TOPIC_ID ? getTopicById(DEFAULT_TOPIC_ID) : null;
    if (fallback?.component) {
      console.warn(`[motion] 未知或未实现题目 "${id}"，回退到 ${DEFAULT_TOPIC_ID}`);
      return fallback;
    }
    return null;
  }
  return topic;
}
