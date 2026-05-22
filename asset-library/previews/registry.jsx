import {
  TitleCardMdPreview,
  TitleCardTsPreview,
  DifficultyBadgePreview,
  BriefCardPreview,
  QuestionCardPreview,
  IdeaCardPreview,
  CodeCardPreview,
  SummaryListCardPreview,
  ApproachPanelPreview,
  ProgressDockPreview,
  GlassCardPreview,
  InfoStepCardPreview,
  ArrayCellPreview,
  ArrayRowPreview,
  PointerJPreview,
  PrefixBracketPreview,
  QueryBoxPreview,
  HashSetChipPreview,
  TreeNodePreview,
  TreeEdgePreview,
  TreeEdgePulsePreview,
  TreePathBadgePreview,
  TreeDepthBadgePreview,
  DepthCardPreview,
  AnnoArrowPreview,
  SubtreeTrianglePreview,
} from "./StaticAndDsPreviews.jsx";

import {
  AlgoPrefixHashPreview,
  AlgoHashSetPreview,
  AlgoDfsTreePreview,
  AlgoLeafFlashPreview,
  LayoutCoverPreview,
  LayoutBriefPreview,
  LayoutIdeaPreview,
  LayoutSimArrayPreview,
  LayoutSummaryListPreview,
  LayoutDualPanelPreview,
  LayoutDfsTreePreview,
  LayoutHeroSplitPreview,
  LayoutConceptCenterPreview,
  LayoutStackSplitPreview,
  LayoutGlassTablePreview,
} from "./AlgoAndLayoutPreviews.jsx";

export const PREVIEW_REGISTRY = {
  "title-card-md": TitleCardMdPreview,
  "title-card-ts": TitleCardTsPreview,
  "difficulty-badge": DifficultyBadgePreview,
  "brief-card": BriefCardPreview,
  "question-card": QuestionCardPreview,
  "idea-card": IdeaCardPreview,
  "code-card": CodeCardPreview,
  "summary-list-card": SummaryListCardPreview,
  "approach-panel": ApproachPanelPreview,
  "progress-dock": ProgressDockPreview,
  "glass-card": GlassCardPreview,
  "info-step-card": InfoStepCardPreview,
  "array-cell": ArrayCellPreview,
  "array-row": ArrayRowPreview,
  "pointer-j": PointerJPreview,
  "prefix-bracket": PrefixBracketPreview,
  "query-box": QueryBoxPreview,
  "hash-set-chip": HashSetChipPreview,
  "tree-node": TreeNodePreview,
  "tree-edge": TreeEdgePreview,
  "tree-edge-pulse": TreeEdgePulsePreview,
  "tree-path-badge": TreePathBadgePreview,
  "tree-depth-badge": TreeDepthBadgePreview,
  "depth-card": DepthCardPreview,
  "anno-arrow": AnnoArrowPreview,
  "subtree-triangle": SubtreeTrianglePreview,
  "algo-prefix-hash": AlgoPrefixHashPreview,
  "algo-hash-set": AlgoHashSetPreview,
  "algo-dfs-tree": AlgoDfsTreePreview,
  "algo-leaf-flash": AlgoLeafFlashPreview,
  "layout-cover": LayoutCoverPreview,
  "layout-brief": LayoutBriefPreview,
  "layout-idea": LayoutIdeaPreview,
  "layout-sim-array": LayoutSimArrayPreview,
  "layout-summary-list": LayoutSummaryListPreview,
  "layout-dual-panel": LayoutDualPanelPreview,
  "layout-dfs-tree": LayoutDfsTreePreview,
  "layout-hero-split": LayoutHeroSplitPreview,
  "layout-concept-center": LayoutConceptCenterPreview,
  "layout-stack-split": LayoutStackSplitPreview,
  "layout-glass-table": LayoutGlassTablePreview,
};

export function PreviewNotFound({ previewKey }) {
  return (
    <div className="al-empty">
      <p>预览尚未实现</p>
    </div>
  );
}

export function AssetPreview({ asset, compact = false }) {
  const Comp = PREVIEW_REGISTRY[asset.previewKey];
  if (!Comp) return <PreviewNotFound previewKey={asset.previewKey} />;
  return <Comp compact={compact} />;
}
