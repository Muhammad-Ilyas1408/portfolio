import { Section } from "@/components/ui/Section";
import type { Credential } from "@/content/schema";
import { formatYearMonth } from "@/lib/format";

import { MoreLink } from "./MoreLink";

export function CredentialsRow({ credentials }: { credentials: Credential[] }) {
  if (credentials.length === 0) return null;

  return (
    <Section
      label="03 — Credentials"
      aria-labelledby="credentials-heading"
      heading={<h2 id="credentials-heading">Credentials</h2>}
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {credentials.map((credential) => {
          const when =
            credential.years ??
            (credential.date && formatYearMonth(credential.date));
          return (
            <li
              key={credential.name}
              className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="text-base">{credential.name}</h3>
              <p className="text-sm text-text-muted">
                {credential.issuer}
                {when && <span className="font-mono"> · {when}</span>}
              </p>
              {credential.verifyUrl && (
                <a
                  href={credential.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify: ${credential.name}`}
                  className="inline-flex min-h-11 items-center self-start rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline"
                >
                  Verify <span aria-hidden="true">&nbsp;↗</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <MoreLink href="/credentials">All credentials</MoreLink>
      </div>
    </Section>
  );
}
