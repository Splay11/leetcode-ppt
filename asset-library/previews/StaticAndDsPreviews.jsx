import { useState } from "react";
import MaxDepthCoverSlide from "../assets/md/components/CoverSlide.jsx";
import TwoSumCoverSlide from "../assets/ts/components/CoverSlide.jsx";
import { BRIEF } from "../assets/ts/constants.js";
import PreviewFrame from "../components/PreviewFrame.jsx";
import { CELL_STATES, CD_CELL_STATES, DEMO_ARRAY } from "../demoData.js";

function TsCell({ value, idx, state = "idle" }) {
  return (
    <div className={`ts-cell ts-cell--${state}`}>
      <span className="ts-cell-val">{value}</span>
      <span className="ts-cell-idx">{idx}</span>
    </div>
  );
}

function CdCell({ value, idx, state = "idle" }) {
  return (
    <div className={`cd-cell cd-cell--${state}`}>
      <span className="cd-cell-val">{value}</span>
      <span className="cd-cell-idx">{idx}</span>
    </div>
  );
}

export function TitleCardMdPreview({ compact = false }) {
  const [phase, setPhase] = useState(compact ? 1 : 1);
  return (
    <PreviewFrame
      deckClass="md-deck"
      compact={compact}
      controls={
        compact ? null : (
          <button type="button" className="al-btn" onClick={() => setPhase((p) => (p >= 1 ? 0 : 1))}>
            切换难度
          </button>
        )
      }
    >
      <MaxDepthCoverSlide phase={phase} />
    </PreviewFrame>
  );
}

export function TitleCardTsPreview({ compact = false }) {
  const [phase, setPhase] = useState(compact ? 0 : 1);
  return (
    <PreviewFrame
      deckClass="ts-deck"
      compact={compact}
      controls={
        compact ? null : (
          <button type="button" className="al-btn" onClick={() => setPhase((p) => (p >= 1 ? 0 : 1))}>
            切换难度
          </button>
        )
      }
    >
      <TwoSumCoverSlide phase={phase} />
    </PreviewFrame>
  );
}

export function DifficultyBadgePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="al-inline-row">
        <span className="ts-difficulty ts-difficulty--easy">简单</span>
        <span className="md-difficulty md-difficulty--medium">中等</span>
        <span className="cd-difficulty cd-difficulty--easy">简单</span>
      </div>
    </PreviewFrame>
  );
}

export function BriefCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-brief-stage">
        <article className="ts-brief-card">
          <h2>{BRIEF.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: BRIEF.content }} />
        </article>
      </div>
    </PreviewFrame>
  );
}

export function QuestionCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-idea-stage al-idea-preview al-idea-preview--isolated" data-idea-step="0">
        <article className="ts-question-card">
          <h2>
            如何在 <span className="em">O(n)</span> 内找到两数之和？
          </h2>
        </article>
      </div>
    </PreviewFrame>
  );
}

export function IdeaCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-idea-stage al-idea-preview al-idea-preview--isolated" data-idea-step="1">
        <article className="ts-idea-card">
          <span className="ts-idea-badge">前缀哈希</span>
          <p className="ts-idea-line">
            <span className="em">j</span> 右移时查 <span className="em">target − num[j]</span> 是否出现过。
          </p>
        </article>
      </div>
    </PreviewFrame>
  );
}

export function CodeCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-idea-stage al-idea-preview al-idea-preview--isolated" data-idea-step="2">
        <pre className="ts-code-card">
          <code className="ts-code-inner">
            <span className="ts-code-line ts-code-line--active">
              <span className="kw">for</span> j <span className="kw">in</span> range(n):
            </span>
            {"\n"}
            <span className="ts-code-line ts-code-line--ind1">need = target - nums[j]</span>
            {"\n"}
            <span className="ts-code-line ts-code-line--ind1">
              <span className="kw">if</span> need <span className="kw">in</span> map: <span className="ret">return</span>
            </span>
          </code>
        </pre>
      </div>
    </PreviewFrame>
  );
}

export function SummaryListCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-summary-stage">
        <article className="ts-summary-card">
          <span className="ts-summary-badge">总结</span>
          <ol className="ts-summary-list">
            <li style={{ opacity: 1 }}>一次遍历 + 哈希表</li>
            <li style={{ opacity: 1 }}>查 target - nums[j]</li>
            <li style={{ opacity: 0.35 }}>O(n) 时间 O(n) 空间</li>
          </ol>
        </article>
      </div>
    </PreviewFrame>
  );
}

export function ApproachPanelPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <article className="md-approach-panel">
        <h3 className="md-approach-panel__title">自顶向下</h3>
        <div className="md-approach-panel__body">
          <div className="md-diagram-frame">Panel + 树/示意容器</div>
        </div>
      </article>
    </PreviewFrame>
  );
}

export function ProgressDockPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <nav className="md-progress-dock" aria-label="演示控制">
        <div className="md-progress">
          <button type="button">‹</button>
          <span className="md-progress-text">做法总结 · 节拍 2/3</span>
          <div className="md-dots">
            <span className="md-dot" />
            <span className="md-dot active" />
            <span className="md-dot" />
          </div>
          <button type="button">›</button>
        </div>
      </nav>
    </PreviewFrame>
  );
}

export function GlassCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <div className="dfs-glass al-glass-demo">
        <span className="dfs-eyebrow">CONCEPT</span>
        <h2 className="dfs-h2">深度优先搜索</h2>
        <p className="dfs-lead">先走到底，再回溯探索其他分支。</p>
      </div>
    </PreviewFrame>
  );
}

export function InfoStepCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="dfs-deck" compact={compact}>
      <article className="dfs-info-card">
        <span className="dfs-tag">Step 1</span>
        <h3 className="dfs-h2">访问当前节点</h3>
        <p className="dfs-lead">标记 visited，递归邻居。</p>
      </article>
    </PreviewFrame>
  );
}

export function ArrayCellPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="al-inline-row">
        {CELL_STATES.map((s) => (
          <TsCell key={s.label} value={s.value} idx={s.label} state={s.className} />
        ))}
      </div>
      <div className="al-inline-row al-mt">
        {CD_CELL_STATES.map((s) => (
          <CdCell key={s.label} value={s.value} idx={s.label} state={s.className} />
        ))}
      </div>
    </PreviewFrame>
  );
}

export function ArrayRowPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-array-row ts-array-row--sim">
        {DEMO_ARRAY.map((n, i) => (
          <TsCell key={i} value={n} idx={i} state={i === 1 ? "cur" : "idle"} />
        ))}
      </div>
    </PreviewFrame>
  );
}

export function PointerJPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-array-row ts-array-row--sim">
        {DEMO_ARRAY.map((n, i) => (
          <div key={i} className="ts-cell-wrap">
            {i === 1 && (
              <div className="ts-j-pointer">
                <span className="ts-j-label">j</span>
                <span className="ts-j-arrow">▼</span>
              </div>
            )}
            <TsCell value={n} idx={i} state={i === 1 ? "cur" : "idle"} />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export function PrefixBracketPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="al-bracket-demo">
        <div className="ts-prefix-bracket" style={{ left: 8, width: 120 }} />
        <div className="ts-array-row ts-array-row--sim">
          {DEMO_ARRAY.map((n, i) => (
            <TsCell key={i} value={n} idx={i} state={i < 2 ? "prefix" : "idle"} />
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

export function QueryBoxPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="ts-deck" compact={compact}>
      <div className="ts-query-box">
        <span className="ts-query-val">9 − 7 = 2</span>
      </div>
    </PreviewFrame>
  );
}

export function HashSetChipPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="cd-deck" compact={compact}>
      <div className="cd-set-box">
        <span className="cd-set-chip">1</span>
        <span className="cd-set-chip">3</span>
        <span className="cd-set-chip">5</span>
      </div>
    </PreviewFrame>
  );
}

export function TreeNodePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 200 100" className="md-tree-svg al-mini-svg">
        <circle className="md-tree-node-circle md-tree-node-circle--summary" cx="100" cy="50" r="22" />
        <text className="md-tree-node-label" x="100" y="55" textAnchor="middle">
          1
        </text>
      </svg>
    </PreviewFrame>
  );
}

export function TreeEdgePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 200 120" className="md-tree-svg al-mini-svg">
        <line className="md-tree-edge md-tree-edge--summary" x1="100" y1="30" x2="60" y2="90" />
        <line className="md-tree-edge md-tree-edge--summary" x1="100" y1="30" x2="140" y2="90" />
        <circle className="md-tree-node-circle" cx="100" cy="30" r="18" />
        <circle className="md-tree-node-circle" cx="60" cy="90" r="18" />
        <circle className="md-tree-node-circle" cx="140" cy="90" r="18" />
      </svg>
    </PreviewFrame>
  );
}

export function TreeEdgePulsePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 200 120" className="md-tree-svg al-mini-svg">
        <line className="md-tree-edge md-tree-edge--summary" x1="100" y1="30" x2="60" y2="90" />
        <line className="md-tree-edge-pulse" x1="100" y1="30" x2="140" y2="90" />
        <circle className="md-tree-node-circle md-tree-node-circle--summary" cx="100" cy="30" r="18" />
        <circle className="md-tree-node-circle" cx="60" cy="90" r="18" />
        <circle className="md-tree-node-circle" cx="140" cy="90" r="18" />
      </svg>
    </PreviewFrame>
  );
}

export function TreePathBadgePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 200 100" className="md-tree-svg al-mini-svg">
        <circle className="md-tree-node-circle" cx="100" cy="50" r="22" />
        <g className="md-path-badge">
          <rect x="118" y="18" width="36" height="20" rx="6" />
          <text x="136" y="32" textAnchor="middle" fontSize="11">
            深度=3
          </text>
        </g>
      </svg>
    </PreviewFrame>
  );
}

export function TreeDepthBadgePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 160 80" className="md-tree-svg al-mini-svg">
        <circle className="md-tree-node-circle" cx="80" cy="40" r="20" />
        <text className="md-tree-node-label" x="80" y="45" textAnchor="middle">
          4
        </text>
        <text className="md-tree-depth-badge" x="80" y="12" textAnchor="middle" fontSize="10">
          d=2
        </text>
      </svg>
    </PreviewFrame>
  );
}

export function DepthCardPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <div className="md-dfs-depth-card al-depth-card-demo">
        <div className="md-dfs-depth-value">3</div>
        <div className="md-dfs-depth-label">当前最大深度</div>
      </div>
    </PreviewFrame>
  );
}

export function AnnoArrowPreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 300 120" className="md-schematic-svg al-mini-svg">
        <line className="md-anno-blue" x1="240" y1="90" x2="80" y2="30" markerEnd="url(#md-arrow-blue)" />
        <polygon className="md-schematic-tri md-schematic-tri--left" points="40,90 120,90 80,30" />
        <defs>
          <marker id="md-arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#4169e1" />
          </marker>
        </defs>
      </svg>
    </PreviewFrame>
  );
}

export function SubtreeTrianglePreview({ compact = false }) {
  return (
    <PreviewFrame deckClass="md-deck" compact={compact}>
      <svg viewBox="0 0 200 120" className="md-schematic-svg al-mini-svg" role="img" aria-label="子树示意">
        <g className="md-schematic-tri md-schematic-tri--left">
          <polygon points="20,100 100,100 60,30" />
        </g>
        <g className="md-schematic-tri md-schematic-tri--right md-schematic-tri--flash">
          <polygon points="100,100 180,100 140,30" />
        </g>
        <g className="md-schematic-root">
          <circle cx="100" cy="100" r="8" />
        </g>
      </svg>
    </PreviewFrame>
  );
}
