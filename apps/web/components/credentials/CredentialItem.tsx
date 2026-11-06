import Image from "next/image";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

const textLinkClasses =
  "group/arrow inline-flex min-h-11 items-center gap-1.5 self-start rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline";

/** "Verify ↗", opening the issuer's verification page in a new tab. */
export function VerifyLink({ credential }: { credential: Credential }) {
  if (!credential.verifyUrl) return null;
  return (
    <a
      href={credential.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Verify: ${credential.name} (opens in a new tab)`}
      className={textLinkClasses}
    >
      Verify
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5"
      >
        ↗
      </span>
    </a>
  );
}

function ExtraPhotos({
  photos,
}: {
  photos: NonNullable<Credential["photos"]>;
}) {
  return photos.map((photo) => (
    <a
      key={photo.src}
      href={photo.src}
      target="_blank"
      rel="noopener noreferrer"
      className={textLinkClasses}
    >
      Photo: {photo.alt}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ));
}

/**
 * An award or certificate: its whole image (never cropped), linking to the
 * full file, then title, issuer, date and note. "row" puts the image beside
 * the text, for a lone item or one without a photo.
 */
export function AwardCard({
  credential,
  layout = "card",
}: {
  credential: Credential;
  layout?: "card" | "row";
}) {
  const when = credentialWhen(credential);
  const [thumbnail, ...morePhotos] = credential.photos ?? [];
  const row = layout === "row";

  return (
    <article
      className={cardClasses({
        className: row
          ? `grid h-full gap-2 p-2.5 ${thumbnail ? "sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-center sm:gap-8" : ""}`
          : "flex h-full flex-col p-2.5",
      })}
    >
      {thumbnail && (
        <a
          href={thumbnail.src}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[5/4] overflow-hidden rounded-lg bg-surface-raised transition-colors duration-150 hover:bg-bg"
        >
          <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-3"
          />
          <span className="sr-only"> (opens the full image in a new tab)</span>
        </a>
      )}
      <div
        className={`flex flex-1 flex-col ${
          row
            ? thumbnail
              ? "px-3.5 pt-3 pb-3 sm:px-0 sm:py-4 sm:pr-6"
              : "p-3.5 sm:p-5"
            : "px-3.5 pt-5 pb-3"
        }`}
      >
        <h3
          className={
            row
              ? "font-display text-xl leading-snug font-semibold tracking-tight text-balance"
              : "text-base leading-snug font-semibold"
          }
        >
          {credential.name}
        </h3>
        <p className="mt-1.5 text-sm text-text-muted">
          {credential.issuer}
          {when && <span className="font-mono"> · {when}</span>}
        </p>
        {credential.note && (
          <p className="mt-3 max-w-[60ch] text-sm text-text/90">
            {credential.note}
          </p>
        )}
        <ExtraPhotos photos={morePhotos} />
        <VerifyLink credential={credential} />
      </div>
    </article>
  );
}

/** A specialization: issuer, title, date and "Verify ↗". */
export function SpecializationCard({ credential }: { credential: Credential }) {
  const when = credentialWhen(credential);
  return (
    <article
      className={cardClasses({
        interactive: true,
        className: "flex h-full flex-col p-6 md:p-7",
      })}
    >
      {credential.issuer && <Eyebrow>{credential.issuer}</Eyebrow>}
      <h3 className="mt-5 font-display text-xl leading-snug font-semibold tracking-tight text-balance">
        {credential.name}
      </h3>
      {when && <p className="mt-2 font-mono text-sm text-text-muted">{when}</p>}
      {credential.note && (
        <p className="mt-3 text-sm text-text/90">{credential.note}</p>
      )}
      <div className="mt-auto pt-6">
        <div className="border-t border-border pt-2">
          <VerifyLink credential={credential} />
        </div>
      </div>
    </article>
  );
}

/** A course or training: one hairline row with its verify link on the right. */
export function CredentialRow({ credential }: { credential: Credential }) {
  const when = credentialWhen(credential);
  return (
    <article className="flex flex-col gap-x-8 gap-y-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-base leading-snug font-semibold">
          {credential.name}
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          {credential.issuer}
          {when && <span className="font-mono"> · {when}</span>}
        </p>
        {credential.note && (
          <p className="mt-1 text-sm text-text/90">{credential.note}</p>
        )}
      </div>
      <div className="shrink-0">
        <VerifyLink credential={credential} />
      </div>
    </article>
  );
}

/** The degree, with the final-year project it was earned with. */
export function DegreeItem({
  credential,
  fyp,
}: {
  credential: Credential;
  fyp?: { title: string; href: string; supervisor?: string };
}) {
  const when = credentialWhen(credential);
  return (
    <article
      className={cardClasses({
        className:
          "grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:p-8",
      })}
    >
      <div className="flex min-w-0 flex-col">
        {credential.issuer && <Eyebrow>{credential.issuer}</Eyebrow>}
        <h3 className="mt-5 font-display text-display-3 font-bold">
          {credential.name}
        </h3>
        {when && (
          <p className="mt-3 font-mono text-sm text-text-muted">{when}</p>
        )}
        {credential.note && (
          <p className="mt-3 text-sm text-text/90">{credential.note}</p>
        )}
        <VerifyLink credential={credential} />
      </div>
      {fyp && (
        <div className="flex min-w-0 flex-col border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <p className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
            Final-year project
          </p>
          <p className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight">
            {fyp.title}
          </p>
          {fyp.supervisor && (
            <p className="mt-1 text-sm text-text-muted">
              Supervised by {fyp.supervisor}
            </p>
          )}
          <ArrowLink
            href={fyp.href}
            aria-label={`${fyp.title} case study`}
            className="mt-2 self-start"
          >
            Case study
          </ArrowLink>
        </div>
      )}
    </article>
  );
}
