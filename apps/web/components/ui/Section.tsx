import type { ComponentProps, ReactNode } from "react";

export type SectionAccent = "signal" | "ember";

const accentClasses: Record<SectionAccent, string> = {
  signal: "text-signal",
  ember: "text-ember",
};

type SectionProps = ComponentProps<"section"> & {
  label: string;
  heading?: ReactNode;
  accent?: SectionAccent;
};

export function Section({
  label,
  heading,
  accent = "signal",
  className = "",
  children,
  ...rest
}: SectionProps) {
  return (
    <section {...rest} className={`py-12 md:py-16 ${className}`}>
      <p className={`font-mono text-sm ${accentClasses[accent]}`}>{label}</p>
      {heading && <div className="mt-2">{heading}</div>}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
