import { MOTION_TOPICS } from "../motion/registry.js";

const STATUS_LABEL = {
  done: "已完成",
  wip: "开发中",
  planned: "规划中",
};

export default function TopicHub({ missingId = null }) {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="topic-hub">
      <header className="topic-hub__head">
        <p className="topic-hub__eyebrow">LeetCode Hot 100 · Motion PPT</p>
        <h1>算法动画演示</h1>
        <p className="topic-hub__sub">选择题目进入演示（空格下一步，← 上一步）</p>
        {missingId && (
          <p className="topic-hub__warn">未找到题目「{missingId}」，请从下方列表选择。</p>
        )}
      </header>

      <ul className="topic-hub__list">
        {MOTION_TOPICS.map((topic) => {
          const ready = Boolean(topic.component);
          return (
            <li key={topic.id}>
              {ready ? (
                <a className="topic-hub__card" href={`${base}${topic.id}/`}>
                  <span className="topic-hub__lc">LC {topic.leetcode}</span>
                  <strong>{topic.label}</strong>
                  <span className={`topic-hub__status topic-hub__status--${topic.status}`}>
                    {STATUS_LABEL[topic.status]}
                  </span>
                </a>
              ) : (
                <div className="topic-hub__card topic-hub__card--disabled" aria-disabled="true">
                  <span className="topic-hub__lc">LC {topic.leetcode}</span>
                  <strong>{topic.label}</strong>
                  <span className={`topic-hub__status topic-hub__status--${topic.status}`}>
                    {STATUS_LABEL[topic.status]}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
