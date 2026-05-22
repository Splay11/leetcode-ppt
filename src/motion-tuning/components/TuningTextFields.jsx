import TuningTextRow from "./TuningTextRow.jsx";

/** 组内可编辑文案（DECK_TEXT 等字符串块） */
export default function TuningTextFields({ ctx, group, gesture }) {
  if (!group?.textBlock || !group?.textFields) return null;

  const block = group.textBlock;
  const data = ctx.live[block] ?? {};

  return Object.entries(group.textFields).map(([key, label]) => (
    <TuningTextRow
      key={key}
      label={label}
      value={data[key] ?? ""}
      onChange={(value) => ctx.updateBlockField(block, key, value)}
      onGestureStart={gesture.start}
      onGestureEnd={gesture.end}
    />
  ));
}
