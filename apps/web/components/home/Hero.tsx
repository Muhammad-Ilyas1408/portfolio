import { cvHref } from "@/components/layout/nav";
import { FlowLines } from "@/components/motion/FlowLines";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import type { Home, Profile } from "@/content/schema";

/** The headline segments after the title: the hero's focus tags. */
export function headlineTags(headline: string) {
  return headline.split(" | ").slice(1);
}

/**
 * The home hero, in the owner's words. Hierarchy: the name (h1) and the
 * two-line tagline are the largest; the role line is a clear second; the
 * paragraphs, tags and buttons are calm. The text is server-rendered and
 * paints first; the FlowLines canvas starts after it.
 */
export function Hero({
  profile,
  hero,
}: {
  profile: Profile;
  hero: Home["hero"];
}) {
  const { portrait } = profile;
  const tags = headlineTags(profile.headline);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="hero-backdrop pointer-events-none absolute inset-0 -z-10"
      />
      <FlowLines variant="hero" className="-z-10" />
      {/* Keeps the paragraphs readable where the lines pass behind them. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0 -z-10"
      />
      <Container
        className={`pt-10 pb-14 md:pt-14 md:pb-20 lg:pt-16 ${
          portrait
            ? "grid items-center gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16"
            : ""
        }`}
      >
        <div className="min-w-0">
          <p className="font-mono text-sm tracking-[0.08em] text-text-muted">
            {hero.greeting}
          </p>
          <h1 id="hero-heading" className="mt-3 text-display-1 text-balance">
            {profile.name}
          </h1>
          <p className="mt-3 font-display text-role font-semibold text-signal">
            {profile.title}
          </p>
          <p className="mt-7 font-display text-tagline font-semibold text-balance md:mt-8">
            <span className="block">{hero.tagline[0]}</span>
            {/* From 1024px a block, so the gradient spans the text column
                exactly as in the palette A preview; below that inline, so
                each wrapped line gets the full violet-to-lime run. */}
            <span className="block">
              <span className="text-gradient lg:block">
                <KeepHyphenated text={hero.tagline[1]} />
              </span>
            </span>
          </p>
          <p className="mt-6 max-w-[60ch] text-text/85 md:mt-7">
            {profile.intro}
          </p>
          {tags.length > 0 && (
            <ul aria-label="Focus areas" className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-xs text-text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3">
            <Button href="/projects" variant="filled" size="lg">
              View projects
            </Button>
            <Button
              href={cvHref}
              variant="outline"
              size="lg"
              download
              prefetch={false}
            >
              Download CV
            </Button>
            <ArrowLink
              href="/leadership"
              accent="ember"
              className="ml-2 text-base"
            >
              Leadership &amp; community
            </ArrowLink>
          </div>
        </div>
        {portrait && (
          <Portrait
            portrait={portrait}
            sizes="(min-width: 1024px) 320px, 280px"
          />
        )}
      </Container>
    </section>
  );
}

/**
 * Keeps hyphenated words such as "Real-World" on one line (a phone otherwise
 * breaks after "Real-"). The text itself is unchanged.
 */
function KeepHyphenated({ text }: { text: string }) {
  return text.split(/(\S+-\S+)/).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
