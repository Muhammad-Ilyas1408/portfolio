/** A hairline, with an optional centered mono label. */
export function Divider({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  if (!label) {
    return <hr className={`border-0 border-t border-border ${className}`} />;
  }

  return (
    <div
      role="separator"
      aria-label={label}
      className={`flex items-center gap-4 ${className}`}
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span
        aria-hidden="true"
        className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase"
      >
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}
