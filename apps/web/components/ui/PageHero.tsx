import type { ReactNode } from "react";

import { AccentText } from "./AccentText";
import { Container } from "./Container";
import { Eyebrow, type Accent } from "./Eyebrow";

export type PageHeroMeta = { label: string; value: ReactNode };

const introClasses =
  "mt-6 max-w-[62ch] text-lg text-text/85 md:mt-7 md:text-xl md:leading-relaxed";

const backdrops: Record<Accent, string> = {
  signal: "page-backdrop",
  ember: "page-backdrop-ember",
};

/**
 * The top of every inner page: eyebrow, display h1 (with an optional accent
 * phrase taken from the title), intro, a meta row of small mono labels and
 * actions. `before` sits above the eyebrow (a back link); `aside` is a second
 * column on wide screens (a portrait); `after` runs full width below (a cover).
 */
export function PageHero({
  eyebrow,
  title,
  accentPhrase,
  accent = "signal",
  intro,
  meta = [],
  actions,
  before,
  aside,
  after,
  headingLevel: Heading = "h1",
  badge,
}: {
  eyebrow: ReactNode;
  title: string;
  accentPhrase?: string;
  accent?: Accent;
  intro?: ReactNode;
  meta?: PageHeroMeta[];
  actions?: ReactNode;
  before?: ReactNode;
  aside?: ReactNode;
  after?: ReactNode;
  /** h1 on every page; lower only for the styleguide sample. */
  headingLevel?: "h1" | "h2" | "h3";
  /** Shown after the eyebrow, e.g. a status pill. */
  badge?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className={`${backdrops[accent]} pointer-events-none absolute inset-0 -z-10`}
      />
      <Container className="pt-10 pb-14 md:pt-16 md:pb-20">
        {before && <div className="mb-8 md:mb-10">{before}</div>}
        <div
          className={
            aside
              ? "grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16"
              : ""
          }
        >
          <div className="min-w-0">
            {badge ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
                {badge}
              </div>
            ) : (
              <Eyebrow accent={accent}>{eyebrow}</Eyebrow>
            )}
            <Heading className="mt-6 max-w-[22ch] text-display-page text-balance">
              <AccentText text={title} phrase={accentPhrase} accent={accent} />
            </Heading>
            {typeof intro === "string" ? (
              <p className={introClasses}>{intro}</p>
            ) : (
              intro && <div className={introClasses}>{intro}</div>
            )}
            {meta.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-border pt-6 md:mt-10">
                {meta.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-text">{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                {actions}
              </div>
            )}
          </div>
          {aside}
        </div>
        {after && <div className="mt-12 md:mt-16">{after}</div>}
      </Container>
    </header>
  );
}
