import Image from "next/image";

import { cvHref } from "@/components/layout/nav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/content/schema";

/** Drops the first headline segment (the title) and joins the rest with " · ". */
export function roleLine(headline: string) {
  return headline.split(" | ").slice(1).join(" · ");
}

export function Hero({ profile }: { profile: Profile }) {
  const { portrait } = profile;

  return (
    <section aria-labelledby="hero-heading" className="dot-grid">
      <Container
        className={`py-12 md:py-20 ${
          portrait
            ? "flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12"
            : ""
        }`}
      >
        <div className="min-w-0">
          <p className="font-mono text-sm text-signal">
            {profile.title.toUpperCase()}
          </p>
          <h1 id="hero-heading" className="mt-3 md:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-mono text-sm text-text-muted">
            {roleLine(profile.headline)}
          </p>
          <p className="mt-6 max-w-[68ch] text-lg">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects" variant="filled">
              View work
            </Button>
            <Button href={cvHref} variant="outline" download prefetch={false}>
              Download CV
            </Button>
            {/* Not prefetched: on a phone this link is in the first viewport,
                and prefetching /contact loads the form's JS (react-hook-form,
                zod) during start-up, which cost about 0.5 s of blocking time
                in Lighthouse. The page itself is static and loads fast. */}
            <Button href="/contact" variant="ghost" prefetch={false}>
              Contact
            </Button>
          </div>
        </div>
        {portrait && (
          <div className="relative order-first size-32 shrink-0 overflow-hidden rounded-2xl border border-signal bg-surface md:order-none md:size-72 lg:size-80">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              preload
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 288px, 128px"
              className="object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
