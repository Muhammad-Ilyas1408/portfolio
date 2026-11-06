import Image from "next/image";

import { StatChips } from "@/components/shared/StatChips";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Initiative, Photo } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

function Frame({
  photo,
  sizes,
  preload = false,
}: {
  photo: Photo;
  sizes: string;
  preload?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface-raised">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}

/** The lead event: summary, stats and its photos, the first one large. */
export function LeadInitiative({ initiative }: { initiative: Initiative }) {
  const [main, ...rest] = initiative.photos;

  return (
    <article
      className={cardClasses({
        className:
          "grid gap-8 overflow-hidden p-6 md:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:p-10",
      })}
    >
      <div className="flex min-w-0 flex-col">
        <Eyebrow accent="ember">
          {formatEventRange(initiative.start, initiative.end)}
        </Eyebrow>
        <h3 className="mt-5 font-display text-display-3 font-bold">
          {initiative.name}
        </h3>
        {initiative.venue && (
          <p className="mt-2 text-text-muted">{initiative.venue}</p>
        )}
        <p className="mt-4 text-sm font-medium text-ember">
          {initiative.myRole}
        </p>
        {initiative.summary && (
          <p className="mt-5 max-w-[60ch] text-text/90">{initiative.summary}</p>
        )}
        <div className="mt-6 border-t border-border pt-5 lg:mt-auto">
          <StatChips stats={initiative.stats} />
        </div>
      </div>
      {main && (
        <div className="grid min-w-0 content-start gap-3">
          <Frame photo={main} sizes="(min-width: 1024px) 620px, 100vw" />
          {rest.length > 0 && (
            <ul className="grid grid-cols-3 gap-3">
              {rest.map((photo) => (
                <li key={photo.src}>
                  <Frame
                    photo={photo}
                    sizes="(min-width: 1024px) 200px, 33vw"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

/** A bootcamp card that points to the teaching detail on /experience. */
export function BootcampCard({ initiative }: { initiative: Initiative }) {
  return (
    <article
      className={cardClasses({
        interactive: true,
        className: "flex flex-col p-6 md:p-8",
      })}
    >
      <Eyebrow accent="ember">
        {formatEventRange(initiative.start, initiative.end)}
      </Eyebrow>
      <h3 className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight text-balance">
        {initiative.name}
      </h3>
      <p className="mt-2 text-sm font-medium text-ember">{initiative.myRole}</p>
      <div className="mt-5">
        <StatChips stats={initiative.stats} />
      </div>
      <div className="mt-auto pt-6">
        <div className="border-t border-border pt-4">
          <ArrowLink
            href="/experience#teaching"
            accent="ember"
            aria-label={`What I taught at ${initiative.name}`}
          >
            What I taught
          </ArrowLink>
        </div>
      </div>
    </article>
  );
}
