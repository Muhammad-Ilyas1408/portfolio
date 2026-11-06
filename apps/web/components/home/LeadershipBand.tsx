import Image from "next/image";

import { AccentText } from "@/components/ui/AccentText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import type { Home, Photo } from "@/content/schema";

type Leadership = Omit<Home["leadership"], "photo"> & {
  photo: Photo & { initiative: string };
};

/** Full-width ember band on the warm surface. */
export function LeadershipBand({
  leadership,
  photoCaption,
  number,
}: {
  leadership: Leadership;
  photoCaption?: string;
  number: string;
}) {
  const { headline, stats, photo } = leadership;
  const selfReported = stats.some((stat) => stat.status === "self-reported");

  return (
    <section
      id="leadership"
      aria-labelledby="leadership-heading"
      className="relative isolate overflow-hidden border-y border-border bg-surface-warm py-16 md:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="ember-glow pointer-events-none absolute inset-0 -z-10"
      />
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <Eyebrow accent="ember" number={number}>
            Leadership &amp; community
          </Eyebrow>
          <h2
            id="leadership-heading"
            className="mt-5 text-display-2 text-balance"
          >
            <AccentText
              text={headline.text}
              phrase={headline.accent}
              accent="ember"
            />
          </h2>
          {stats.length > 0 && (
            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ember/25 pt-10 md:gap-x-10">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <Stat
                    {...stat}
                    // One "Figures self-reported" note for the group, below.
                    status={stat.status === "verified" ? "verified" : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <ArrowLink href="/leadership" accent="ember" className="text-base">
              Leadership &amp; community
            </ArrowLink>
            {selfReported && (
              <p className="font-mono text-xs tracking-wide text-text-muted">
                Figures self-reported
              </p>
            )}
          </div>
        </div>
        <figure className="edge-highlight rounded-2xl border border-ember/25 bg-bg/60 p-2.5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-raised">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 pt-3 pb-1 font-mono text-xs text-text-muted">
            <span className="text-ember">{photo.initiative}</span>
            {photoCaption && <span>{photoCaption}</span>}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
