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
    label: "节拍 2 · 难度 + 副标题",
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
    ],
  },
};
