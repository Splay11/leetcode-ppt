export default function IdeaSlide({ step }) {
  return (
    <div className="cd-idea-stage" data-idea-step={step}>
      <article className="cd-question-card">
        <h2>
          如何判断数组里<span className="em">是否存在重复元素</span>？
        </h2>
      </article>

      <article className="cd-idea-card" aria-hidden={step < 1}>
        <span className="cd-idea-badge">哈希做法</span>
        <p className="cd-idea-line">
          用<span className="em">哈希集合</span>记录「已经见过」的元素；扫描时 O(1) 查重。
        </p>
      </article>

      <pre className="cd-code-card" aria-hidden={step < 2}>
        <code className="cd-code-inner">
          <span className="cd-code-line">
            <span className="kw">for</span> x in nums:
          </span>
          <span className="cd-code-line cd-code-line--ind1">
            <span className="kw">if</span> x in seen:
          </span>
          <span className="cd-code-line cd-code-line--ind2">
            <span className="kw">return</span> <span className="ret">true</span>
          </span>
          <span className="cd-code-line cd-code-line--ind1">seen.add(x)</span>
          <span className="cd-code-line">
            <span className="kw">return</span> <span className="ret">false</span>
          </span>
        </code>
      </pre>
    </div>
  );
}
