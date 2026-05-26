export default function PlaceholderSlide({ title, hint }) {
  return (
    <div className="ibt-placeholder-stage">
      <p className="ibt-placeholder-eyebrow">开发中</p>
      <h2 className="ibt-placeholder-title">{title}</h2>
      <p className="ibt-placeholder-hint">{hint}</p>
    </div>
  );
}
