/**
 * maxDepth 动画时间轴 — 按 slideKey + fragment 索引
 * 与 SummarySlide / CoverSlide 播放脚本顺序对齐
 */

export const COVER_TIMELINES = {
  0: {
    label: "节拍 1 · 标题入场",
    segments: [
      {
        id: "seg-cover-title",
        title: "标题",
        clips: [
          {
            id: "clip-title-motion",
            title: "标题 Motion",
            groupId: "cover-motion",
            fieldKeys: ["titleInitialY", "titleDuration"],
            pickGroupId: "cover-fonts",
          },
        ],
      },
    ],
  },
  1: {
    label: "节拍 2 · 难度标签 + 双做法预告",
    segments: [
      {
        id: "seg-cover-difficulty",
        title: "难度",
        clips: [
          {
            id: "clip-difficulty-slot",
            title: "难度槽展开",
            groupId: "cover-motion",
            fieldKeys: ["difficultySlotDuration", "difficultySlotMaxHeight", "difficultySlotPadding"],
          },
          {
            id: "clip-difficulty-enter",
            title: "难度标签入场",
            groupId: "cover-motion",
            fieldKeys: [
              "difficultyDuration",
              "difficultyInitialY",
              "difficultyInitialScale",
              "difficultyHiddenY",
              "difficultyHiddenScale",
            ],
          },
          {
            id: "clip-title-shrink",
            title: "标题微缩",
            groupId: "cover-motion",
            fieldKeys: ["titleShrinkScale", "titleShrinkY", "titleShrinkDuration"],
            pickGroupId: "cover-fonts",
          },
        ],
      },
      {
        id: "seg-cover-teaser",
        title: "双做法预告",
        clips: [
          {
            id: "clip-teaser-panels",
            title: "Panel 入场",
            groupId: "cover-teaser",
            fieldKeys: ["panelEnterY", "panelDuration", "panelStagger"],
          },
          {
            id: "clip-teaser-loop",
            title: "循环微动画",
            groupId: "cover-teaser",
            fieldKeys: ["loopInterval", "flashInterval"],
          },
        ],
      },
    ],
  },
};

export const SUMMARY_TIMELINES = {
  0: {
    label: "节拍 1 · 进入页（Panel 布局请点选画面中的 Panel）",
    segments: [],
  },
  1: {
    label: "节拍 2 · 上 Panel（自顶向下）",
    segments: [
      {
        id: "seg-panel-flash",
        title: "Panel 闪",
        clips: [
          {
            id: "clip-panel-flash-wait",
            title: "闪烁保持",
            groupId: "summary-timing",
            fieldKeys: ["panelFlash"],
            pickGroupId: "summary-panel-enter",
          },
          {
            id: "clip-panel-flash",
            title: "Panel 闪烁",
            groupId: "summary-utils",
            fieldKeys: ["panelFlash"],
            pickGroupId: "summary-panel-enter",
          },
        ],
      },
      {
        id: "seg-edge-pulse-1",
        title: "边 pulse ①",
        afterMs: { groupId: "summary-timing", key: "edgePulseFirst" },
        clips: [
          {
            id: "clip-edge-pulse-12",
            title: "边 1→2 pulse",
            groupId: "summary-tree-motion",
            fieldKeys: ["edgePulseDuration"],
            pickGroupId: "summary-tree-motion",
          },
        ],
      },
      {
        id: "seg-edge-pulse-2",
        title: "边 pulse ②",
        afterMs: { groupId: "summary-timing", key: "edgePulseSecond" },
        clips: [
          {
            id: "clip-edge-pulse-24",
            title: "边 2→4 pulse",
            groupId: "summary-tree-motion",
            fieldKeys: ["edgePulseDuration"],
            pickGroupId: "summary-tree-motion",
          },
        ],
      },
      {
        id: "seg-green-badge",
        title: "绿色 Badge",
        afterMs: { groupId: "summary-timing", key: "badgePopDelay" },
        clips: [
          {
            id: "clip-badge-pop",
            title: "Badge pop",
            groupId: "summary-badge-motion",
            fieldKeys: ["badgeInitialScale"],
            pickGroupId: "summary-badge-green",
          },
          {
            id: "clip-badge-pop-dur",
            title: "Badge pop 时长",
            groupId: "summary-utils",
            fieldKeys: ["popBadgeDuration", "popBadgeScaleMid"],
            pickGroupId: "summary-badge-green",
          },
        ],
      },
    ],
  },
  2: {
    label: "节拍 3 · 下 Panel（自底向上）",
    segments: [
      {
        id: "seg-bottom-flash",
        title: "Panel 闪",
        clips: [
          {
            id: "clip-bottom-flash-wait",
            title: "闪烁保持",
            groupId: "summary-timing",
            fieldKeys: ["panelFlash"],
            pickGroupId: "summary-panel-final",
          },
          {
            id: "clip-bottom-panel-flash",
            title: "下 Panel 闪烁",
            groupId: "summary-utils",
            fieldKeys: ["panelFlash"],
            pickGroupId: "summary-panel-final",
          },
        ],
      },
      {
        id: "seg-flash-left",
        title: "左子树闪",
        afterMs: { groupId: "summary-timing", key: "flashLeft" },
        clips: [
          {
            id: "clip-flash-left-wait",
            title: "闪烁保持",
            groupId: "summary-timing",
            fieldKeys: ["flashLeft"],
            pickGroupId: "summary-schematic-motion",
          },
        ],
      },
      {
        id: "seg-blue-arrow",
        title: "蓝箭头",
        afterMs: { groupId: "summary-timing", key: "annoBlue" },
        clips: [
          {
            id: "clip-blue-arrow",
            title: "蓝箭头绘制",
            groupId: "summary-schematic-motion",
            fieldKeys: ["annoBlueDuration"],
            pickGroupId: "summary-schematic-motion",
          },
        ],
      },
      {
        id: "seg-flash-right",
        title: "右子树 + 金箭头",
        afterMs: { groupId: "summary-timing", key: "flashRight" },
        clips: [
          {
            id: "clip-gold-arrow",
            title: "金箭头绘制",
            groupId: "summary-schematic-motion",
            fieldKeys: ["annoGoldDuration"],
            pickGroupId: "summary-schematic-motion",
          },
        ],
      },
      {
        id: "seg-gold-badge",
        title: "金色 Badge",
        afterMs: { groupId: "summary-timing", key: "badgeFinalDelay" },
        clips: [
          {
            id: "clip-gold-badge-pop",
            title: "Badge pop",
            groupId: "summary-badge-motion",
            fieldKeys: ["badgeInitialScale"],
            pickGroupId: "summary-badge-gold",
          },
          {
            id: "clip-gold-badge-dur",
            title: "Badge pop 时长",
            groupId: "summary-utils",
            fieldKeys: ["popBadgeDuration", "popBadgeScaleMid"],
            pickGroupId: "summary-badge-gold",
          },
        ],
      },
    ],
  },
};

/** DFS：按步骤类型生成时间轴（与 useDfsPlayback / DfsSlide 对齐） */
export const DFS_TIMELINES = {
  0: {
    label: "DFS · 起始",
    segments: [
      {
        id: "seg-dfs-idle",
        title: "就绪",
        clips: [
          {
            id: "clip-dfs-edge-pulse-default",
            title: "边 pulse 默认",
            groupId: "dfs-motion",
            fieldKeys: ["edgePulseDuration"],
            pickGroupId: "dfs-tree",
          },
        ],
      },
    ],
  },
};

function buildDfsStepTimeline(step, stepIndex) {
  const baseLabel = `DFS 步骤 ${stepIndex}`;

  switch (step?.type) {
    case "enter_edge":
      return {
        label: `${baseLabel} · 进入边 ${step.fromId}→${step.toId}`,
        segments: [
          {
            id: `seg-dfs-edge-${stepIndex}`,
            title: "边激活",
            clips: [
              {
                id: `clip-dfs-enter-edge-${stepIndex}`,
                title: "进入边等待",
                groupId: "dfs-timing",
                fieldKeys: ["enterEdge"],
              },
              {
                id: `clip-dfs-edge-pulse-${stepIndex}`,
                title: "边 pulse",
                groupId: "dfs-motion",
                fieldKeys: ["edgePulseDuration"],
                pickGroupId: "dfs-tree",
              },
            ],
          },
        ],
      };
    case "enter_node":
      return {
        label: `${baseLabel} · 进入节点 ${step.nodeId}（深度 ${step.depth}）`,
        segments: [
          {
            id: `seg-dfs-node-${stepIndex}`,
            title: "节点 pulse",
            clips: [
              {
                id: `clip-dfs-enter-node-${stepIndex}`,
                title: "进入节点等待",
                groupId: "dfs-timing",
                fieldKeys: ["enterNode"],
              },
              {
                id: `clip-dfs-node-pulse-${stepIndex}`,
                title: "节点 pulse",
                groupId: "dfs-motion",
                fieldKeys: ["nodePulseDuration", "nodePulseScale"],
                pickGroupId: "dfs-tree",
              },
            ],
          },
          {
            id: `seg-dfs-badge-${stepIndex}`,
            title: "深度标 pop",
            clips: [
              {
                id: `clip-dfs-badge-pop-${stepIndex}`,
                title: "深度标 pop",
                groupId: "dfs-motion",
                fieldKeys: [
                  "pathBadgeInitialScale",
                  "pathBadgePopDuration",
                  "pathBadgePopScaleMid",
                ],
                pickGroupId: "dfs-badge-layout",
              },
            ],
          },
        ],
      };
    case "leaf_flash":
      return {
        label: `${baseLabel} · 叶子回溯 · 深度卡`,
        segments: [
          {
            id: `seg-dfs-flash-${stepIndex}`,
            title: "路径闪烁 ×3",
            clips: [
              {
                id: `clip-dfs-flash-loop-${stepIndex}`,
                title: "单圈等待（×3）",
                groupId: "dfs-timing",
                fieldKeys: ["leafFlashLoop"],
                durationMultiplier: 3,
              },
              {
                id: `clip-dfs-node-flash-${stepIndex}`,
                title: "节点 flash",
                groupId: "dfs-motion",
                fieldKeys: ["nodeFlashDuration", "nodePulseScale"],
                pickGroupId: "dfs-tree",
                durationMultiplier: 3,
              },
            ],
          },
          {
            id: `seg-dfs-depth-card-${stepIndex}`,
            title: "深度卡入场",
            clips: [
              {
                id: `clip-dfs-depth-enter-${stepIndex}`,
                title: "深度卡 Motion",
                groupId: "dfs-motion",
                fieldKeys: [
                  "depthCardEnterY",
                  "depthCardScale",
                  "depthCardDuration",
                  "depthCardExitY",
                ],
                pickGroupId: "dfs-depth-card",
              },
            ],
          },
          {
            id: `seg-dfs-depth-value-${stepIndex}`,
            title: "深度数值 pulse",
            clips: [
              {
                id: `clip-dfs-depth-value-${stepIndex}`,
                title: "数值 pulse",
                groupId: "dfs-motion",
                fieldKeys: ["depthValueScale", "depthValueDuration"],
                pickGroupId: "dfs-depth-card",
              },
            ],
          },
        ],
      };
    case "leave_node":
      return {
        label: `${baseLabel} · 离开节点 ${step.nodeId}`,
        segments: [
          {
            id: `seg-dfs-leave-node-${stepIndex}`,
            title: "离开节点",
            clips: [],
          },
        ],
      };
    case "leave_edge":
      return {
        label: `${baseLabel} · 离开边 ${step.fromId}→${step.toId}`,
        segments: [
          {
            id: `seg-dfs-leave-edge-${stepIndex}`,
            title: "离开边",
            clips: [
              {
                id: `clip-dfs-leave-edge-${stepIndex}`,
                title: "离开边等待",
                groupId: "dfs-timing",
                fieldKeys: ["leaveEdge"],
              },
            ],
          },
        ],
      };
    default:
      return {
        label: baseLabel,
        segments: [],
      };
  }
}

export function buildDfsTimelines(steps) {
  const stepList = Array.isArray(steps) ? steps : [];
  const timelines = { ...DFS_TIMELINES };
  for (let i = 1; i <= stepList.length; i += 1) {
    timelines[i] = buildDfsStepTimeline(stepList[i - 1], i);
  }
  return timelines;
}
