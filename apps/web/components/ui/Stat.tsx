import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import type { Evidence } from "@/content/schema";

import { Arrow } from "./ArrowLink";
import { accentText, type Accent } from "./Eyebrow";

export type StatProps = {
  value: string;
  label: string;
  detail?: string;
  accent?: Accent;
  /** Internal page or anchor the number comes from. */
  href?: string;
  /** Verified numbers carry their evidence; others say "Self-reported". */
  status?: "verified" | "self-reported";
  evidence?: Evidence;
  className?: string;
};

const NBSP = " ";

/** A large display numeral, its label, an optional detail and its source. */
export function Stat({
  value,
  label,
  detail,
  accent = "signal",
  href,
  status,
  evidence,
  className = "",
}: StatProps) {
  const split = label.lastIndexOf(" ") + 1;
  const firstWords = label.slice(0, split);
  const lastWord = label.slice(split);

  const body = (
    <>
      <span
        className={`block font-display text-stat font-semibold whitespace-nowrap ${accentText[accent]}`}
      >
        {value}
      </span>{" "}
      <span className="mt-3 block text-base font-medium text-text underline-offset-4 group-hover/arrow:underline">
        {href ? (
          <>
            {/* Plain text nodes keep the spaces in the accessible name; the
                last word and the arrow never split across lines. */}
            {firstWords}
            <span className="whitespace-nowrap">
              {lastWord}
              {NBSP}
              <Arrow />
            </span>
          </>
        ) : (
          label
        )}
      </span>
    </>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {href ? (
        <Link href={href} className="group/arrow -m-1 block rounded-md p-1">
          {body}
        </Link>
      ) : (
        <p>{body}</p>
      )}
      {detail && <p className="mt-1 text-sm text-text-muted">{detail}</p>}
      {status === "verified" && evidence ? (
        <div className="mt-4">
          <EvidenceChip {...evidence} verified />
        </div>
      ) : status === "self-reported" ? (
        <p className="mt-4 font-mono text-xs tracking-wide text-text-muted">
          Self-reported
        </p>
      ) : null}
    </div>
  );
}
