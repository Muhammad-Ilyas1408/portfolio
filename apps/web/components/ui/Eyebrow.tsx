import type { ReactNode } from "react";

export type Accent = "signal" | "ember";

export const accentText: Record<Accent, string> = {
  signal: "text-signal",
  ember: "text-ember",
};

const dots: Record<Accent, string> = {
  signal: "bg-signal",
  ember: "bg-ember",
};

/** Small tracked mono label with a 6px accent dot, above a section title. */
export function Eyebrow({
  accent = "signal",
  number,
  as: Tag = "p",
  id,
  className = "",
  children,
}: {
  accent?: Accent;
  /** A section number such as "01", shown before the label. */
  number?: string;
  as?: "p" | "h2" | "span";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.16em] text-text-muted uppercase ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${dots[accent]}`}
      />
      {number && (
        <>
          <span className={accentText[accent]}>{number}</span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
        </>
      )}
      <span>{children}</span>
    </Tag>
  );
}
