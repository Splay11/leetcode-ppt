import PreviewFit from "./PreviewFit.jsx";

export default function PreviewFrame({
  title,
  subtitle,
  children,
  controls,
  deckClass = "md-deck",
  compact = false,
}) {
  const stage = (
    <div className={`al-preview-stage ${deckClass}${compact ? " al-preview-stage--compact" : " al-preview-stage--fluid"}`}>
      <div className="al-preview-viewport al-preview-context">
        {compact ? <PreviewFit>{children}</PreviewFit> : children}
      </div>
    </div>
  );

  if (compact) {
    return <div className="al-preview al-preview--compact">{stage}</div>;
  }

  return (
    <div className="al-preview">
      {(subtitle || controls) && (
        <div className="al-preview-meta">
          {subtitle && <p className="al-preview-sub">{subtitle}</p>}
          {controls && <div className="al-preview-controls">{controls}</div>}
        </div>
      )}
      {stage}
      {title && <p className="al-preview-caption">{title}</p>}
    </div>
  );
}
