import type { ComponentProps, ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

import { accentText, type Accent } from "./Eyebrow";

/**
 * An inner-page section: a numbered hairline rule, a display h2, an optional
 * intro, then the content. It sits inside the page's Container.
 */
export function PageSection({
  id,
  number,
  title,
  intro,
  accent = "signal",
  className = "",
  children,
  ...rest
}: Omit<ComponentProps<"section">, "title"> & {
  /** Used for the anchor, the heading id and aria-labelledby. */
  id: string;
  /** "01", "02", … */
  number?: string;
  title: ReactNode;
  intro?: ReactNode;
  accent?: Accent;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`py-12 md:py-16 ${className}`}
      {...rest}
    >
      <Reveal>
        <div className="flex items-center gap-4">
          {number && (
            <span
              aria-hidden="true"
              className={`font-mono text-xs font-medium tracking-[0.16em] ${accentText[accent]}`}
            >
              {number}
            </span>
          )}
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>
        <h2 id={headingId} className="mt-6 text-display-3 text-balance">
          {title}
        </h2>
        {intro && (
          <div className="mt-4 max-w-[64ch] text-text-muted">{intro}</div>
        )}
      </Reveal>
      <Reveal className="mt-8 md:mt-10" delay={80}>
        {children}
      </Reveal>
    </section>
  );
}

/** "01", "02", … */
export const sectionNumber = (index: number) =>
  String(index + 1).padStart(2, "0");
