import Image from "next/image";

import { splitAwardName } from "@/components/home/Recognition";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import type { Credential } from "@/content/schema";
import { formatYearMonth } from "@/lib/format";

/** One award with its whole photo, and a link to every award on /credentials. */
export function RecognitionStrip({ award }: { award: Credential }) {
  const photo = award.photos?.[0];
  const { title, detail } = splitAwardName(award.name);

  return (
    <figure
      className={cardClasses({
        className:
          "grid gap-6 p-2.5 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:items-center sm:gap-10",
      })}
    >
      {photo && (
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-raised">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 640px) 256px, 100vw"
            className="object-contain p-3"
          />
        </div>
      )}
      <figcaption className="px-3.5 pb-4 sm:px-0 sm:pr-8 sm:pb-0">
        <span className="block font-display text-xl leading-snug font-semibold tracking-tight">
          {title}
        </span>
        {detail && <span className="mt-1 block text-text-muted">{detail}</span>}
        <span className="mt-3 block text-sm text-text-muted">
          {award.issuer}
          {award.date && (
            <span className="font-mono"> · {formatYearMonth(award.date)}</span>
          )}
        </span>
        {award.note && (
          <span className="mt-3 block max-w-[60ch] text-sm text-text/90">
            {award.note}
          </span>
        )}
        <span className="mt-4 block">
          <ArrowLink href="/credentials#awards" accent="ember">
            See all awards
          </ArrowLink>
        </span>
      </figcaption>
    </figure>
  );
}
