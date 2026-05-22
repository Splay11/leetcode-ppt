# Agent 指南：动画与样式如何对接 motion-tuning

> **读者**：后续在 `motion-demo` 里改课件动画、CSS、Slide 组件的 Agent。  
> **库 API 细节**见 [`src/motion-tuning/README.md`](../src/motion-tuning/README.md)。  
> **参考实现**见 [`src/maxDepth/`](../src/maxDepth/)（当前最完整的对接样例）。

---

## 1. 这份文档解决什么问题

motion-tuning 不是「加几个滑块」那么简单。动画脚本、CSS 变量、DOM pick 挂载、时间轴 schema、保存 payload **必须同一套命名与数据流**。  
本文总结 **设计规范 + 本次迭代沉淀**，避免 Agent 改完动画后在 `?debug=1` 下出现：点不中、拖不动、保存写错 key、时间轴与画面不同步、面板布局异常等问题。

---

## 2. 架构一句话

```
animConfig.js（唯一数值源）
    ↔ animTuningRegistry.js（schema + manip + timelines）
    ↔ Slide 组件（useAnimBlock / useDeckCssVars + pick）
    ↔ 课件 CSS（var(--md-*) + debug pointer-events）
    ↔ animTimeline.js（底部时间轴 segment/clip）
         ↓ POST save
tools/anim-tuning-server.mjs → patch animConfig.js
```

库 (`src/motion-tuning/`) 负责面板 UI、live 状态、撤销、保存协议；**课件**负责具体动画与视觉。**不要**在课件里重复写 manipRegistry。

---

## 3. 设计前必问的五个问题

新增或改动一段动画前，先答完：

| # | 问题 | 落点 |
|---|------|------|
| 1 | 数值放哪个 block？ | `animConfig.js` 的 `XXX_MOTION` / `XXX_TIMING` / `DECK_CSS_VARS` |
| 2 | 调试面板哪个 group 管？ | `animTuningRegistry.js` 的 `group.id` |
| 3 | 用户点选画面上的谁？ | `useTuningPickable("group-id")` 挂在**负责定位/调节**的那层 DOM |
| 4 | 组件怎么读？ | `useAnimBlock("BLOCK")` 或 CSS `var(--md-...)` |
| 5 | 是否进底部时间轴？ | `animTimeline.js` 里为当前 `fragment` 写 `segments` / `clips` |

**五条链任一断裂 → debug 静默失效**（能开面板但调节无效或保存不对）。

---

## 4. animConfig：唯一数据源

```js
// animConfig.js — 所有可调数值只在这里 export
export const SUMMARY_TIMING = { panelFlash: 520, edgePulseFirst: 520, ... };
export const DECK_CSS_VARS = { "--md-cover-title-size": "48px", ... };
export const DECK_TEXT = { coverTitle: "二叉树的最大深度", ... };

export function cloneAnimConfig() {
  return {
    SUMMARY_TIMING: { ...SUMMARY_TIMING },
    DECK_CSS_VARS: { ...DECK_CSS_VARS },
    // 每个 block 都要浅拷贝
  };
}
```

规范：

- **Motion 时长**：秒用 `SEC` block（如 `COVER_MOTION`）；毫秒等待用 `*_TIMING` block（如 `SUMMARY_TIMING`），与时间轴 `MS_TIMING_KEY` 一致。
- **布局**：优先 CSS 变量 + `layoutBase.js` 生成的 `--md-{slug}-left` / `--md-{slug}-layout-size`。
- **文案**：放 `DECK_TEXT`，registry 里用 `textBlock` + `textFields`，组件用 `useAnimBlock("DECK_TEXT")`。
- **禁止**在组件里写死 magic number 再「顺便」加滑块——先加 config，再读 config。

---

## 5. animTuningRegistry：schema 规范

每个 slide：

```js
export const SLIDE_TUNING = {
  summary: {
    label: "做法总结",
    timelines: SUMMARY_TIMELINES,  // 来自 animTimeline.js
    groups: [ /* ... */ ],
  },
};
```

### 5.1 group 怎么拆

| 原则 | 说明 |
|------|------|
| **一 pick 目标 = 一 group.id** | 两棵 SVG、两个 Panel → 两个 group，不要共用一个 id |
| **role 分流** | `role: "motion"` → 底部时间轴；`role: "layout"` → 右下角 focus |
| **layout 基座** | 用 `layoutSlug` + `mergeLayoutBase()` 统一 left/size 字段 |
| **manip 写在 group 上** | Ctrl+拖动/缩放；多 Panel 用 `manipByRole` + `pickRole` |

### 5.2 字段 preset

从 `@motion-tuning` 引入：`SEC` `MS` `PX` `PCT` `PCT0` `FONT` `SCALE`。  
label 写清楚单位，便于面板与时间轴估算时长。

---

## 6. 动画脚本设计规范（对接时间轴 + 将来 scrub）

当前 deck 播放是 **离散 fragment + async 脚本**（`await wait(ms)`），与时间轴 **估算 ms** 是两套逻辑。设计时请尽量对齐，便于调试和后续 seek。

### 6.1 推荐模式

```js
// ✅ 时长来自 useAnimBlock
const timing = useAnimBlock("SUMMARY_TIMING");
await wait(timing.edgePulseFirst);

// ✅ 跳转用静态快照，前进用 async 步骤
if (!animateForward) applyStatic(stepCount);
else runForwardStep(index);
```

```js
// ❌ 避免：组件内写死 520
await wait(520);

// ❌ 避免：同一 DOM 同时 CSS transform 与 Motion scale（会互相覆盖）
```

### 6.2 与时间轴对齐

`animTimeline.js` 中每个 clip 的 `fieldKeys` 必须能在 registry 的 group 里找到，且 **播放顺序与 Slide 内脚本顺序一致**：

```js
{
  id: "seg-edge-pulse-1",
  title: "边 pulse ①",
  afterMs: { groupId: "summary-timing", key: "edgePulseFirst" },
  clips: [{
    id: "clip-edge-pulse-12",
    title: "边 1→2 pulse",
    groupId: "summary-tree-motion",
    fieldKeys: ["edgePulseDuration"],
    pickGroupId: "summary-tree-motion",
  }],
}
```

- `afterMs`：segment 间等待，对应 `*_TIMING` 里的 ms 字段。
- `durationMode: "sum"` / `durationMultiplier`：clip 内多字段求和或循环（如 leaf_flash ×3）。
- 改脚本顺序或增删 `await` 时，**同步改 animTimeline.js**。

### 6.3 playback 分离（maxDepth 模式）

调试面板切节拍 **不应打断** 正在看的 deck 画面时，Presentation 层分离：

- `panelFragment`：底部面板 scrub / 时间轴
- `deckFragment`：实际渲染
- `replayBeat()`：仅重播 deck，不改变 panel scrub

新课件若需要时间轴重播，在 `useTuningPlayback` 注册 `replayBeat`。

---

## 7. CSS 与样式规范

### 7.1 分工

| 文件 | 写什么 |
|------|--------|
| `motion-tuning.css` | 调试 shell、底部面板、focus 卡片、`[data-tuning-deck]` 选中框 |
| 课件 CSS（如 `max-depth.css`） | 布局、`var(--md-*)`、**debug 专用** pointer-events / z-index |

### 7.2 Transform 分层（必守）

```
外层 anchor：定位（left / translate / CSS 变量）
内层子元素：Motion 动画（opacity / scale）
```

Badge 等 pick 目标挂在 **anchor**，不要挂在会被 Motion 缩放的内层。

### 7.3 Debug 下 pointer-events 模板

仅在 `.md-deck--tuning`（或课件等价 class）下开启：

```css
/* 容器不抢点击 */
.md-deck--tuning .md-diagram-frame { pointer-events: none; }

/* 真正要选中的 SVG / anchor 可点 */
.md-deck--tuning .md-diagram-frame svg[data-tuning-target] {
  pointer-events: all;
  cursor: pointer;
}

/* 父级 hover 不因子元素冒泡而虚线框 */
[data-tuning-target]:hover:not(:has([data-tuning-target]:hover)) { ... }
```

### 7.4 useTuningPickable 与 className

```jsx
const pick = useTuningPickable("summary-tree-motion", { className: "md-tree-svg" });
// 或 debug 时合并：{ ...pick, className: `md-tree-svg ${pick.className}` }
```

**禁止** `{...pick}` 覆盖掉语义 class，否则 CSS 与 pointer-events 失效。

### 7.5 Debug shell 与 deck 缩放

`html.has-motion-tuning` 下：

- shell 为 **flex 列**：上 deck viewport，下 `AnimTuningPanel`
- 面板展开约占 **40vh**；收起保留 **32px** 细条 +「展开 ▸」
- deck 用 `--md-deck-fit-scale` 等比缩放，勿与面板高度硬编码冲突

改面板高度/收起样式只动 `motion-tuning.css`，deck 背景（如 `.md-deck::before`）在 debug 下改为 `absolute`，避免撑出滚动条。

---

## 8. 底部动画时间轴 UI 约定（Agent 改库/样式时）

本次迭代形成的布局约定，后续改动请保持：

| 区域 | 约定 |
|------|------|
| 左栏 | 选中 clip / gap 的字段编辑 |
| 右栏 | 泳道：左 chip、右 2px 细线 track；chip 不参与 scale |
| 横向 | track 区占满宽度后 **scaleX 等比压缩**，**禁止横向滚动** |
| 纵向 | 泳道过多时 **canvas-wrap 内纵向滚动** |
| playhead | **绝对 overlay**，与 track 同坐标系；贯穿所有泳道，不参与 grid 行高 |
| 节拍 scrub | 底部细线 slider；左上「节拍」、右上 `x / x` |
| 保存 | 「保存本节拍动画」仅写当前 fragment 时间轴字段；右下角 focus「保存布局」写 layout group |

---

## 9. 接入 checklist（新 Slide / 新动画）

```
[ ] animConfig.js 增加 block 字段 + cloneAnimConfig 拷贝
[ ] animTuningRegistry.js 增加 group（id / block / fields / role / manip）
[ ] animTimeline.js 增加 fragment 的 segments（与脚本顺序一致）
[ ] 组件 useAnimBlock 读取，禁止 magic number
[ ] useTuningPickable 挂到正确 DOM，className 合并
[ ] 课件 CSS：var(--md-*) + .deck--tuning pointer-events
[ ] layout 需调位置：layoutBase slug 与 registry layoutSlug 一致
[ ] 文案进 DECK_TEXT + textFields
[ ] MaxDepthPresentation：fragment / replayBeat 如需则注册
```

---

## 10. 改完必验证

```bash
npm run tuning-server   # 3847，保存前必开
# 浏览器 ?debug=1
```

- [ ] 点选目标 → 右下角 group 标题正确
- [ ] 布局字段 → focus 面板；motion 字段 → 底部时间轴 clip
- [ ] Ctrl+拖动 / 缩放有效，松手不弹回
- [ ] 改底部时间轴字段 → 重播后 playhead 与条带大致对齐
- [ ] 「保存本节拍动画」/「保存布局」写入 `animConfig.js` 正确 block
- [ ] Ctrl+Z 撤销可用
- [ ] 收起面板 → 32px 细条可展开；deck 占满剩余空间
- [ ] 关 debug（去掉 `?debug=1`）演示正常、无选中框闪烁
- [ ] `npm run build` 通过

---

## 11. 常见踩坑（浓缩）

1. pick spread 覆盖 `className` → 点不中  
2. 多个元素共用一个 `group.id` → 面板混乱  
3. 父 Panel 与子 SVG 同时 pick → hover 冒泡虚线框  
4. 只改变量名不改 registry → 滑块/保存 key 错误  
5. 时间轴 clip 顺序与 Slide 脚本不一致 → playhead 与画面不同步  
6. playhead 与 bar 不同坐标系（chip 列偏移未算）→ 线对齐错误  
7. 滑块改动触发 Motion 重播 → 需 `popDone` / runId 取消 async  
8. 忘记 `configPath` → 保存到错误文件  

完整列表见库 README §8。

---

## 12. 已知限制与后续方向

| 能力 | 现状 |
|------|------|
| 节拍 scrub（底部） | ✅ 切换 fragment，deck 可分离 |
| 时间轴重播 playhead | ✅ 可视化，时长为 compileTimelineLanes 估算 |
| 拖 playhead 驱动画面 | ❌ 未实现；需 `applyBeatProgress(ms)` 或 seek 架构 |
| 逐帧连续 scrub | ❌ 需重构 async 脚本为可 seek 时间线 |

设计新动画时，若预期要做 scrub，请：**时长全部 config 化、步骤可静态快照、顺序与时间轴 clip 一一对应**，降低后续接入成本。

---

## 13. 文件索引（maxDepth）

| 路径 | 职责 |
|------|------|
| `src/maxDepth/animConfig.js` | 数值唯一源 |
| `src/maxDepth/animTuningRegistry.js` | groups + timelines 注册 |
| `src/maxDepth/animTimeline.js` | 每 fragment 的 segment/clip |
| `src/maxDepth/layoutBase.js` | 布局 left/size 字段生成 |
| `src/maxDepth/tuningBridge.js` | `createDeckTuning(...)` |
| `src/maxDepth/animHooks.js` | useAnimBlock 封装 |
| `src/maxDepth/MaxDepthPresentation.jsx` | Shell、playback、replayBeat |
| `src/maxDepth/max-depth.css` | 布局 + debug pointer-events |
| `src/maxDepth/components/*.jsx` | pick 挂载、动画脚本 |
| `src/motion-tuning/` | 通用调试库 |
| `src/motion-tuning/README.md` | 库 API 与 payload 协议 |

---

## 14. 本次对话沉淀摘要

便于后续 Agent 理解上下文，避免重复踩坑：

1. **双保存**：底部「保存本节拍动画」= 时间轴字段；右下角「保存布局」= 单 group layout。  
2. **水平时间轴**：segment 串联、clip 并行；泳道 chip + 细 track；playhead overlay 贯穿。  
3. **面板尺寸**：展开约 40vh；收起 32px 细条保留「展开 ▸」。  
4. **坐标系**：scaleX 只作用于 track 列；playhead 与 bar 同一列内算 ms→px。  
5. **滚动**：canvas 可纵向滚；不可横向滚。  
6. **playback**：panelFragment / deckFragment 分离；重播不改变底部 scrub。  

---

*维护：改 motion-tuning 交互或 maxDepth 对接约定时，请同步更新本文 §8、§14。*

**相关文档**

- 素材库 catalog 与选用指南：[`docs/asset-library.md`](../docs/asset-library.md)
- 浏览素材：`npm run assets`
