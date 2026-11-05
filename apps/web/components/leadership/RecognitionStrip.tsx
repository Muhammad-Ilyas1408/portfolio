import Image from "next/image";

import { TextLink } from "@/components/shared/TextLink";
import type { Credential } from "@/content/schema";
import { formatYearMonth } from "@/lib/format";

/** One award with its photo, and a link to every award on /credentials. */
export function RecognitionStrip({ award }: { award: Credential }) {
  const photo = award.photos?.[0];

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center">
      {photo && (
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-surface-raised sm:w-56">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 640px) 224px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div>
        <h3>{award.name}</h3>
        <p className="mt-1 text-sm text-text-muted">
          {award.issuer}
          {award.date && (
            <span className="font-mono"> · {formatYearMonth(award.date)}</span>
          )}
        </p>
        {award.note && <p className="mt-1 text-sm">{award.note}</p>}
        <div className="mt-2">
          <TextLink href="/credentials#awards" accent="ember">
            See all awards <span aria-hidden="true">→</span>
          </TextLink>
        </div>
      </div>
    </div>
  );
}
