import type { ComponentProps, ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

import { ArrowLink } from "./ArrowLink";
import { Container } from "./Container";
import { Eyebrow, type Accent } from "./Eyebrow";

type DisplaySectionProps = Omit<ComponentProps<"section">, "title"> & {
  /** Used for the heading id and aria-labelledby. */
  id: string;
  eyebrow: string;
  accent?: Accent;
  /** "01", "02", … */
  number?: string;
  title: ReactNode;
  intro?: ReactNode;
  viewAll?: { href: string; label: string };
  /** Off when the content reveals itself (a staggered card grid). */
  revealContent?: boolean;
};

/** Home section primitive: eyebrow, number, display h2, intro and a "View all →" link. */
export function DisplaySection({
  id,
  eyebrow,
  accent = "signal",
  number,
  title,
  intro,
  viewAll,
  revealContent = true,
  className = "",
  children,
  ...rest
}: DisplaySectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`py-16 md:py-20 lg:py-24 ${className}`}
      {...rest}
    >
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-3xl">
            <Eyebrow accent={accent} number={number}>
              {eyebrow}
            </Eyebrow>
            <h2 id={headingId} className="mt-5 text-display-2 text-balance">
              {title}
            </h2>
            {intro && (
              <div className="mt-5 max-w-[60ch] text-lg text-text-muted">
                {intro}
              </div>
            )}
          </div>
          {viewAll && (
            <ArrowLink
              href={viewAll.href}
              accent={accent}
              className="shrink-0 md:mb-1"
            >
              {viewAll.label}
            </ArrowLink>
          )}
        </Reveal>
        {revealContent ? (
          <Reveal className="mt-10 md:mt-14" delay={80}>
            {children}
          </Reveal>
        ) : (
          <div className="mt-10 md:mt-14">{children}</div>
        )}
      </Container>
    </section>
  );
}
