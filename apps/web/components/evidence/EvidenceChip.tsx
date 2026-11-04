export type EvidenceKind =
  | "repo"
  | "live"
  | "devpost"
  | "cert"
  | "changelog"
  | "thesis"
  | "post"
  | "photo";

/** "REPO: README (opens in a new tab)": the visible kind always starts the name (WCAG 2.5.3). */
export function evidenceChipName(kind: EvidenceKind, label: string) {
  return `${kind.toUpperCase()}: ${label} (opens in a new tab)`;
}

type EvidenceChipProps = {
  kind: EvidenceKind;
  label: string;
  url: string;
  verified?: boolean;
};

export function EvidenceChip({
  kind,
  label,
  url,
  verified = false,
}: EvidenceChipProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={evidenceChipName(kind, label)}
      data-verified={verified || undefined}
      className="inline-flex min-h-7 items-center gap-2 rounded-md bg-signal-soft px-2 py-0.5 text-sm transition-colors duration-150 hover:bg-surface-raised"
    >
      {verified && (
        <span aria-hidden="true" className="size-2 rounded-full bg-verified" />
      )}
      <span className="font-mono font-medium text-signal uppercase">
        {kind}
      </span>
    </a>
  );
}
