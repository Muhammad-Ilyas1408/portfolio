import Image from "next/image";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Section } from "@/components/ui/Section";
import type { Initiative, Role } from "@/content/schema";
import { formatEventRange, formatYearSpan } from "@/lib/format";

import { MoreLink } from "./MoreLink";

function Progression({ roles }: { roles: Role[] }) {
  return (
    <ol
      aria-label="Leadership progression, oldest first"
      className="grid gap-0 md:grid-cols-4"
    >
      {roles.map((role, index) => {
        const last = index === roles.length - 1;
        return (
          <li
            key={`${role.org}-${role.title}`}
            className="relative pb-8 pl-8 md:pt-8 md:pr-6 md:pb-0 md:pl-0"
          >
            {/* Connector: vertical on mobile, horizontal on desktop. */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-3 bottom-0 left-[5px] w-px bg-ember/40 md:top-[5px] md:right-0 md:bottom-auto md:left-3 md:h-px md:w-auto"
              />
            )}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-3 rounded-full border border-ember md:top-0 ${
                last ? "bg-ember" : "bg-bg"
              }`}
            />
            <p className="font-mono text-sm text-ember">
              {formatYearSpan(role.start, role.end)}
            </p>
            <h3 className="mt-1 text-base">{role.title}</h3>
            <p className="mt-1 text-sm text-text-muted">{role.org}</p>
          </li>
        );
      })}
    </ol>
  );
}

function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const cover = initiative.photos[0];
  const hasSelfReported = initiative.stats.some(
    (stat) => stat.status === "self-reported",
  );

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface">
      {cover && (
        <div className="relative aspect-[16/9] border-b border-border bg-surface-raised">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1200px) 384px, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <p className="font-mono text-sm text-ember">
          {formatEventRange(initiative.start, initiative.end)}
        </p>
        <h3 className="mt-1">{initiative.name}</h3>
        <p className="mt-2 text-sm text-text-muted">{initiative.myRole}</p>
        {initiative.stats.length > 0 && (
          <>
            <ul className="mt-4 flex flex-wrap gap-2">
              {initiative.stats.map((stat) => (
                <li
                  key={stat.text}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="rounded-md bg-ember-soft px-2 py-0.5 text-sm">
                    {stat.text}
                  </span>
                  {stat.status === "verified" && stat.evidence && (
                    <EvidenceChip {...stat.evidence} verified />
                  )}
                </li>
              ))}
            </ul>
            {hasSelfReported && (
              <p className="mt-2 font-mono text-sm text-text-muted">
                Self-reported
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export function LeadershipPreview({
  roles,
  initiatives,
}: {
  roles: Role[];
  initiatives: Initiative[];
}) {
  if (roles.length === 0 && initiatives.length === 0) return null;

  return (
    <Section
      label="02 — Leadership"
      accent="ember"
      aria-labelledby="leadership-heading"
      heading={<h2 id="leadership-heading">Leadership</h2>}
    >
      {roles.length > 0 && <Progression roles={roles} />}
      {initiatives.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {initiatives.map((initiative) => (
            <InitiativeCard
              key={`${initiative.name}-${initiative.start}`}
              initiative={initiative}
            />
          ))}
        </div>
      )}
      <div className="mt-6">
        <MoreLink href="/leadership" accent="ember">
          See the full story
        </MoreLink>
      </div>
    </Section>
  );
}
