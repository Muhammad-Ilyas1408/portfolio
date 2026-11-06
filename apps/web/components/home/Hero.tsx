import Image from "next/image";

import { cvHref } from "@/components/layout/nav";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Home, Profile } from "@/content/schema";

/** The headline segments after the first two (the title and the h1's subject). */
export function headlineTags(headline: string) {
  return headline.split(" | ").slice(2);
}

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
      <Container
        className={`pt-14 pb-16 md:pt-24 md:pb-24 lg:pt-28 ${
          portrait
            ? "grid items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16"
            : ""
        }`}
      >
        <div className="min-w-0">
          <Eyebrow accent="signal">
            {profile.name} · {profile.title}
          </Eyebrow>
          <h1
            id="hero-heading"
            className="mt-6 max-w-[14ch] text-display-1 text-balance"
          >
            <AccentText text={hero.text} phrase={hero.accent} />
          </h1>
          <p className="mt-7 max-w-[60ch] text-lg text-text/85 md:text-xl md:leading-relaxed">
            {profile.intro}
          </p>
          {tags.length > 0 && (
            <ul aria-label="Focus areas" className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
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
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:mr-0 lg:max-w-[420px]">
            <div
              aria-hidden="true"
              className="portrait-glow absolute -inset-10 -z-10"
            />
            <div className="edge-highlight rounded-2xl border border-border bg-surface p-2.5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-raised">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 400px, 320px"
                  className="object-cover"
                />
              </div>
              <p className="flex items-center justify-between px-2 pt-3 pb-1 font-mono text-xs text-text-muted">
                <span>{profile.name}</span>
                <span>{profile.location}</span>
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
