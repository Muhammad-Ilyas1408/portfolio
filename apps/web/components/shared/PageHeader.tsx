import type { ReactNode } from "react";

import type { SectionAccent } from "@/components/ui/Section";

/** The top of an inner page: mono label, h1 and an optional intro. */
export function PageHeader({
  label,
  title,
  accent = "signal",
  children,
}: {
  label: string;
  title: string;
  accent?: SectionAccent;
  children?: ReactNode;
}) {
  return (
    <header className="pt-12 md:pt-16">
      <p
        className={`font-mono text-sm ${accent === "ember" ? "text-ember" : "text-signal"}`}
      >
        {label}
      </p>
      <h1 className="mt-2">{title}</h1>
      {children && <div className="mt-4 max-w-[68ch] text-lg">{children}</div>}
    </header>
  );
}
