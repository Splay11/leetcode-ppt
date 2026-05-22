# motion-tuning

> **Agent 必读**：修改 `src/motion-tuning/`、任意课件的 `animTuningRegistry.js` / `tuningBridge.js`、或调试相关 CSS / 组件 pick 挂载时，请先读完本文。  
> **课件侧动画/CSS 设计规范**（五链对齐、时间轴、样式分层、验收清单）：[`docs/agent-motion-tuning-design.md`](../../docs/agent-motion-tuning-design.md)  
> **通用素材库**（元素/动画/布局流 catalog）：[`docs/asset-library.md`](../../docs/asset-library.md) · 浏览 [`asset-library/index.html`](../../asset-library/index.html)

可复用的 **Motion 课件动画参数调试库**（`?debug=1` + 底部面板 + 右下角 focus 卡片 + Ctrl 手势 + 保存到 `animConfig.js`）。与具体 PPT 视觉命名解耦；课件侧 class 名、CSS 变量名可自定义，只要对齐本文「四链」即可。

---

## 1. 架构分层

```
┌─────────────────────────────────────────────────────────────┐
│  motion-tuning 库 (src/motion-tuning/)                       │
│  MotionTuningShell · Context · Panel · pick · manip · save   │
│  通用 CSS: [data-tuning-deck]、调试面板样式                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ tuningBridge (createDeckTuning)
┌───────────────────────────▼─────────────────────────────────┐
│  课件 (例: src/maxDepth/)                                    │
│  animConfig.js · animTuningRegistry.js · tuningBridge.js     │
│  animHooks.js · deckTheme.js · 课件 CSS · Slide 组件         │
└───────────────────────────┬─────────────────────────────────┘
                            │ POST /save-tuning
┌───────────────────────────▼─────────────────────────────────┐
│  tools/anim-tuning-server.mjs → patch animConfig.js          │
└─────────────────────────────────────────────────────────────┘
```

| 层 | 职责 | 不应包含 |
|----|------|----------|
| **库** | live 状态、撤销、面板 UI、pick 协议、payload 构建、manip 编译 | 课件 `--md-*` 变量、二叉树专用 pointer-events |
| **课件** | 参数唯一数据源、schema、DOM pick 挂载、布局 CSS、Motion 动画 | 重复维护 manipRegistry.js |
| **保存服务** | 按 payload 的 `configPath` / `cssVarsBlock` 写文件 | 写死某个课件路径 |

Vite 别名：`@motion-tuning` → `src/motion-tuning/index.js`

---

## 2. 目录结构（库）

```
src/motion-tuning/
├── deck/createDeckTuning.js    # 课件接入工厂
├── context/AnimTuningContext.jsx
├── components/                 # 底部总面板、focus 卡片、滑块行
├── hooks/
│   ├── useTuningDeck.js        # deck ref + 点击选中 + data-tuning-deck
│   ├── useTuningPickable.js    # data-tuning-target + 选中 class
│   ├── useTuningPlayback.js    # 注册 slide/fragment
│   └── useTuningDirectManip.js # Ctrl+滚轮/拖动
├── schema/
│   ├── fieldPresets.js         # SEC / MS / PX / PCT / FONT …
│   ├── compileManipRegistry.js # 从 schema 编译 manip（单源）
│   └── buildFieldUnits.js
├── utils/payload.js            # 保存 payload、merge defaults
├── MotionTuningShell.jsx
└── styles/motion-tuning.css
```

---

## 3. 四链对齐（最重要）

改样式 / DOM / 动画块时，**四条必须一致**，否则 debug 会「静默失效」（能打开面板但拖不动、保存不对、点不中）：

```
animConfig.js 里的值
    ↓ 同名 key
animTuningRegistry.js 的 fields / manip.keys
    ↓ 同名 CSS 变量或 block 字段
课件 CSS 的 var(...) 或组件里 useAnimBlock("BLOCK")
    ↓ 同一个 group.id
useTuningPickable("group-id") 挂在「负责定位/调节」的那层 DOM
```

额外对齐：

| 字段 | 说明 |
|------|------|
| `createDeckTuning({ id, configPath, cssVarsBlock })` | 保存 payload 与服务端 patch 目标 |
| `group.block` + `kind` | `"css"` → live[cssVarsBlock]；默认 → live[block]；`"array"` → live[block] 数组 |
| `group.manip` / `manipByRole` | Ctrl 手势映射，**不要**再写独立 manipRegistry.js |

---

## 4. 课件接入清单

每套新 PPT 至少需要：

| 文件 | 作用 |
|------|------|
| `animConfig.js` | **唯一数据源**：Motion 块 + CSS 变量块 + `cloneAnimConfig()` |
| `animTuningRegistry.js` | `SLIDE_TUNING`：slide → groups → fields + **manip** |
| `tuningBridge.js` | `createDeckTuning({ id, configPath, … })` |
| `animHooks.js` | `useAnimBlock` / `useDeckCssVars` + static fallback |
| `deckTheme.js`（或等价） | `applyCssVars(deckNode, vars)` |
| 课件 CSS | 布局 + **debug 专用** pointer-events / z-index |
| 根 Presentation | `MotionTuningShell` + `useTuningDeck` + `useTuningPlayback` + `AnimTuningFocusPanel` |

### 4.1 animConfig.js

```js
export const DECK_CSS_VARS = { "--my-title-size": "48px" };
export const HERO_MOTION = { duration: 0.6 };

export function cloneAnimConfig() {
  return {
    DECK_CSS_VARS: { ...DECK_CSS_VARS },
    HERO_MOTION: { ...HERO_MOTION },
  };
}
```

### 4.2 animTuningRegistry.js

```js
import { FONT, PX, SEC, SCALE } from "@motion-tuning";

export const SLIDE_TUNING = {
  intro: {
    label: "开场",
    groups: [
      {
        id: "hero-title",           // ↔ useTuningPickable("hero-title")
        title: "标题",
        block: "DECK_CSS_VARS",
        kind: "css",
        source: { file: "…", lines: "…" },
        fields: {
          "--my-title-size": FONT("标题字号"),
        },
        manip: {
          drag: { type: "css", keys: ["--my-title-size"], axes: ["y"] },
        },
      },
      {
        id: "tree-stage",
        title: "树 / 边 pulse",
        block: "TREE_MOTION",
        fields: { edgePulseDuration: SEC("边 pulse 时长") },
        // 无 manip 则仅滑块调节
      },
    ],
  },
};
```

**一个可点目标 = 一个 `group.id`。** 两棵 SVG、两套动画 → 两个 group（参考 maxDepth 的 `summary-tree-motion` / `summary-schematic-motion`）。

#### group 类型

| kind | block | live 路径 | 保存字段 |
|------|-------|-----------|----------|
| （默认） | `HERO_MOTION` 等 | `live[block][key]` | `payload.blocks[block]` |
| `"css"` | 仍写 `DECK_CSS_VARS` | `live[cssVarsBlock][varName]` | `payload.cssVars` |
| `"array"` | `DFS_BADGE_LAYOUT` | `live[block][i]` | `payload.arrayBlocks[block]` |

#### manip 形态

```js
// 单目标：缩放 + 拖动 CSS 变量
manip: {
  scale: { type: "css", key: "--scale", min: 0.3, max: 5 },
  drag: { type: "css", keys: ["--shift-x", "--shift-y"] },
}

// 多角色（如上下 Panel）
manipByRole: {
  top: { drag: { type: "css", keys: ["--top-x", "--top-y"] } },
  bottom: { drag: { type: "css", keys: ["--bot-x", "--bot-y"] } },
}
// pick 时传 pickRole: "top" | "bottom"

// 数组项（按节点）
manip: { drag: { type: "array", keys: ["shiftX", "shiftY"] } }
// pick 时传 nodeId；block 默认取 group.block
```

### 4.3 tuningBridge.js

```js
import { createDeckTuning } from "@motion-tuning";

export const myDeckTuning = createDeckTuning({
  id: "myDeck",
  cloneConfig: cloneAnimConfig,
  staticConfig: animConfigStatic,
  slideTuning: SLIDE_TUNING,
  applyCssVars: applyDeckCssVars,
  configPath: "src/myDeck/animConfig.js",
  cssVarsBlock: "DECK_CSS_VARS",
  deckTuningClass: "my-deck--tuning",
});
```

### 4.4 Presentation 挂载

```jsx
import {
  MotionTuningShell,
  AnimTuningFocusPanel,
  useTuningDeck,
  useTuningPlayback,
  useTuningPickable,
} from "@motion-tuning";

function MyDeckInner() {
  const { setDeckRef, debug, handleDeckClick, deckTuningAttrs } = useTuningDeck();
  useTuningPlayback({
    slideKey, slideIndex, fragment, maxFragment,
    setFragment, setSlideIndex, setAnimateForward,
  });

  return (
    <div
      ref={setDeckRef}
      className={debug ? "my-deck my-deck--tuning" : "my-deck"}
      {...deckTuningAttrs}
      onClick={debug ? handleDeckClick : undefined}
    >
      {/* slides */}
      {debug && <AnimTuningFocusPanel />}
    </div>
  );
}

export default function MyDeck() {
  return (
    <MotionTuningShell tuning={myDeckTuning}>
      <MyDeckInner />
    </MotionTuningShell>
  );
}
```

### 4.5 useTuningPickable — className 合并（必做）

`useTuningPickable` 返回的 props **含 `className`（含 `md-tuning-pick`）**。若写：

```jsx
<svg className="md-tree-svg" {...pick} />  // ❌ pick 覆盖 className，CSS/pointer-events 失效
```

应合并：

```jsx
const pick = useTuningPickable("summary-tree-motion");
const svgProps = debug
  ? { ...pick, className: `md-tree-svg ${pick.className}`.trim() }
  : { className: "md-tree-svg" };

<svg {...svgProps} />
```

或把语义 class 传入：`useTuningPickable("id", { className: "md-tree-svg" })`，再与额外 class 拼接。

#### pick 可选参数

| 参数 | 用途 |
|------|------|
| `pickRole` | 配合 `manipByRole` |
| `nodeId` | 配合 `kind: "array"` |
| `pickPriority: "low"` | 外层容器低优先级；子元素（如 SVG）承载点击 |

---

## 5. CSS 分工

| 位置 | 内容 |
|------|------|
| `motion-tuning.css` | 调试面板、`html.has-motion-tuning`、`[data-tuning-deck]` 通用选中框 |
| 课件 CSS（如 `max-depth.css`） | pointer-events、z-index、SVG 命中、Panel 与 Badge 嵌套 hover |

### 5.1 嵌套 pick 时父级 hover

子元素有 `data-tuning-target` 时，父级不应因 `:hover` 冒泡而高亮：

```css
[data-tuning-target]:hover:not(:has([data-tuning-target]:hover)) { … }
```

### 5.2 SVG 选中模板（debug）

```css
.my-deck--tuning .diagram-frame { pointer-events: none; }
.my-deck--tuning .diagram-frame svg[data-tuning-target] {
  pointer-events: all;
  cursor: pointer;
}
```

保留 SVG 语义 class（`md-tree-svg` 等），不要只剩 `md-tuning-pick`。

### 5.3 transform 分层

**定位**（translate / left / top / CSS 变量）放 **外层 anchor**；**Motion 动画**（scale / opacity）放 **内层**。同一元素同时 CSS `transform` 与 Motion `scale` 会互相覆盖导致闪烁/位移跳变。

---

## 6. 调试数据流

```
?debug=1
  → MotionTuningShell → AnimTuningProvider(live = cloneConfig())
  → applyCssVars(deck, live[cssVarsBlock])
  → 滑块/Ctrl 手势 → updateCssVar / updateBlockField → live 更新
  → 保存 → buildSlideSavePayload（含 configPath, cssVarsBlock, deckId）
  → anim-tuning-server.mjs patch animConfig.js
  → commitSavedDefaults 更新内存 defaults
```

### 6.1 保存服务

```bash
npm run tuning-server   # 默认 http://127.0.0.1:3847
```

浏览器访问演示页时加 **`?debug=1`**。保存前需服务已启动。

Payload 关键字段：

```json
{
  "slideKey": "summary",
  "deckId": "maxDepth",
  "configPath": "src/maxDepth/animConfig.js",
  "cssVarsBlock": "DECK_CSS_VARS",
  "blocks": { "SUMMARY_TREE_MOTION": { "edgePulseDuration": 0.5 } },
  "cssVars": { "--md-tree-badge-shift-x": "12px" },
  "arrayBlocks": { "DFS_BADGE_LAYOUT": [ … ] }
}
```

### 6.2 交互

| 操作 | 行为 |
|------|------|
| 点击画面元素 | 选中 → 右下角 focus 面板（该 group） |
| 点击空白 | 取消选中 |
| Ctrl + 滚轮 | 对当前选中且有 `manip.scale` 的目标缩放 |
| Ctrl + 拖动 | 对当前选中且有 `manip.drag` 的目标位移 |
| Ctrl + Z | 撤销（最多 5 步） |
| 底部面板 | 当前 slide 全部 group + 节拍 scrubber |
| 保存 | 写回 `configPath`；sessionStorage 暂存 slideIndex/fragment |

---

## 7. 参考实现：maxDepth

| 路径 | 说明 |
|------|------|
| `src/maxDepth/tuningBridge.js` | `createDeckTuning({ id: "maxDepth", … })` |
| `src/maxDepth/animTuningRegistry.js` | 完整 schema + manip 示例 |
| `src/maxDepth/animConfig.js` | 所有 export 块 |
| `src/maxDepth/MaxDepthPresentation.jsx` | Shell + Deck + Playback |
| `src/maxDepth/max-depth.css` | 调试 pointer-events / Badge anchor / SVG |
| `src/maxDepth/components/SummarySlide.jsx` | Badge anchor 分层、多 group pick |
| `src/maxDepth/components/TreeSvg.jsx` | SVG pick + className 合并 |

---

## 8. 常见踩坑（Agent 改代码前对照）

1. **spread pick 覆盖 className** → SVG/容器点不中、样式不生效（见 §4.5）
2. **改 DOM 层级未改 pick 挂载点** → 例如 Badge 定位改到 `.md-tree-badge-anchor`，pick 也要挂 anchor
3. **多个元素共用一个 `group.id`** → 点不同元素弹出同一面板；应按动画职责拆分 group
4. **父 Panel 也有 pick** → hover 冒泡导致父级虚线框；用 `:not(:has(...))`（见 §5.1）
5. **`diagram-frame` 与 SVG 同时 pick** → 应 pick SVG，frame 设 `pointer-events: none`
6. **tuning live 更新触发 Motion 重播** → 入场动画需 `popDone` / settle 态，避免每次滑块改动重播 keyframes
7. **双重动画** → 同一元素不要同时 `motion` 入场 + imperative `animate()`（如 popBadge）
8. **`htmlDocumentClass` 多个 class** → Shell 已支持空格分隔；勿把 `"a b"` 当作单个 token 传给 `classList.add`
9. **只改 CSS 变量名未改 registry** → 滑块与保存写错 key
10. **忘记 `configPath`** → 保存仍落到错误文件

---

## 9. 改完必验证

- [ ] `?debug=1` 能选中目标，focus 面板 **group 标题正确**
- [ ] Ctrl+拖动 / 滑块调整后 **位置不弹回**
- [ ] 保存后 reload，**animConfig.js 已 patch**
- [ ] 非 debug 下演示动画 **正常、无闪烁**
- [ ] `npm run build` 通过

---

## 10. API 速查

| 导出 | 用途 |
|------|------|
| `createDeckTuning` | 课件工厂（manip 编译、field unit、默认 saveUrl） |
| `MotionTuningShell` | Provider + 底部总面板 |
| `AnimTuningFocusPanel` | 右下角单 group 卡片 |
| `useTuningDeck` | deck ref、点击选中、`deckTuningAttrs`（`data-tuning-deck`） |
| `useTuningPlayback` | 注册 slide/fragment（替代手写 `registerPlayback` effect） |
| `useTuningPickable` | `data-tuning-target` + 选中 class |
| `useAnimBlock` / `useDeckCssVars` | 读 live（非 debug 需 static fallback） |
| `SEC` / `MS` / `PX` / `PCT` / `FONT` / `SCALE` | schema 字段预设（含 `unit`） |
| `compileManipRegistry` | 从 schema 编译 manip（通常不必手动调用） |
| `buildSlideSavePayload` / `postTuningSave` | 保存 |
| `isAnimDebugMode` | 是否 `?debug=1` |

---

## 12. 面板布局：布局 Inspector + 动画时间轴

| 面板 | 内容 |
|------|------|
| **右下角 focus** | 仅 `role: "layout"`（或 `kind: css/array`）的非动画参数 |
| **底部** | 当前 **fragment** 的 `timelines[fragment]`：横向 segment，列间 `afterMs`，列内 clip 默认收起 |

课件在 `SLIDE_TUNING[slideKey].timelines` 声明（参考 `src/maxDepth/animTimeline.js`）：

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

选中纯 motion 对象时，focus 提示在底部时间轴调节；`pickGroupId` 用于列出关联 clip 标题。

---

## 13. 改库 vs 改课件

| 需求 | 改哪里 |
|------|--------|
| 新 PPT | 新建课件目录 + `createDeckTuning`，**不要**改库核心 |
| 新可调参数 / pick 目标 | 课件 `animConfig` + `animTuningRegistry` + 组件 pick + 课件 CSS |
| 保存协议、撤销、面板 UI | `src/motion-tuning/` + `tools/anim-tuning-server.mjs` |
| 新手势类型 | 库 `directManip.js` + schema 文档 |
