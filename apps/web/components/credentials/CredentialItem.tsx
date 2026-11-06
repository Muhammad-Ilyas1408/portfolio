import Image from "next/image";
import type { ReactNode } from "react";

import { TextLink } from "@/components/shared/TextLink";
import type { Credential } from "@/content/schema";
import { formatMonthRange, formatYearMonth, monthsInRange } from "@/lib/format";

/** "Jan 2024 – Aug 2024 · 8 months", "2022–2026 · Completed Nov 2026", "Oct 2026". */
export function credentialWhen(credential: Credential) {
  if (credential.period) {
    const { start, end } = credential.period;
    const months = monthsInRange(start, end);
    return `${formatMonthRange(start, end)} · ${months} month${months === 1 ? "" : "s"}`;
  }
  if (credential.kind === "degree" && credential.years) {
    return credential.date
      ? `${credential.years} · Completed ${formatYearMonth(credential.date)}`
      : credential.years;
  }
  return (
    credential.years ?? (credential.date && formatYearMonth(credential.date))
  );
}

function Thumbnail({ photo }: { photo: NonNullable<Credential["photos"]>[0] }) {
  return (
    <a
      href={photo.src}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-border bg-surface-raised transition-colors duration-150 hover:border-signal/60 sm:w-40"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 640px) 160px, 100vw"
        className="object-contain"
      />
      <span className="sr-only"> (opens the full image in a new tab)</span>
    </a>
  );
}

export function CredentialItem({
  credential,
  children,
}: {
  credential: Credential;
  children?: ReactNode;
}) {
  const when = credentialWhen(credential);
  const [thumbnail, ...morePhotos] = credential.photos ?? [];

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row">
      {thumbnail && <Thumbnail photo={thumbnail} />}
      <div className="flex min-w-0 flex-col">
        <h3 className="text-base">{credential.name}</h3>
        <p className="mt-1 text-sm text-text-muted">
          {credential.issuer}
          {when && <span className="font-mono"> · {when}</span>}
        </p>
        {credential.note && <p className="mt-1 text-sm">{credential.note}</p>}
        {morePhotos.map((photo) => (
          <a
            key={photo.src}
            href={photo.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center self-start rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline"
          >
            Photo: {photo.alt}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
        {credential.verifyUrl && (
          <a
            href={credential.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify: ${credential.name} (opens in a new tab)`}
            className="inline-flex min-h-11 items-center self-start rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline"
          >
            Verify <span aria-hidden="true">&nbsp;↗</span>
          </a>
        )}
        {children}
      </div>
    </article>
  );
}

/** The degree, with a link to the final-year project it was earned with. */
export function DegreeItem({
  credential,
  fyp,
}: {
  credential: Credential;
  fyp?: { title: string; href: string; supervisor?: string };
}) {
  return (
    <CredentialItem credential={credential}>
      {fyp && (
        <>
          <p className="mt-3 text-sm">
            Final-year project: {fyp.title}
            {fyp.supervisor && (
              <span className="text-text-muted">
                {" "}
                · Supervised by {fyp.supervisor}
              </span>
            )}
          </p>
          <TextLink
            href={fyp.href}
            aria-label={`${fyp.title} case study`}
            className="self-start"
          >
            Case study <span aria-hidden="true">→</span>
          </TextLink>
        </>
      )}
    </CredentialItem>
  );
}
