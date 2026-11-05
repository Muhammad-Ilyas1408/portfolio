import { StatChips } from "@/components/shared/StatChips";
import { TextLink } from "@/components/shared/TextLink";
import { initiativeId } from "@/content";
import type { Initiative } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

/** A bootcamp on /experience, linking to its row on /leadership. */
export function TeachingCard({
  initiative,
  title = initiative.name,
}: {
  initiative: Initiative;
  title?: string;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6">
      <p className="font-mono text-sm text-text-muted">
        {formatEventRange(initiative.start, initiative.end)}
      </p>
      <h3 className="mt-1">{title}</h3>
      <p className="mt-1 text-sm text-signal">{initiative.myRole}</p>
      <div className="mt-4">
        <StatChips stats={initiative.stats} accent="signal" />
      </div>
      {initiative.summary && <p className="mt-4">{initiative.summary}</p>}
      <div className="mt-auto pt-4">
        <TextLink
          href={`/leadership#${initiativeId(initiative)}`}
          aria-label={`${initiative.name} on the Leadership page`}
        >
          On the Leadership page <span aria-hidden="true">→</span>
        </TextLink>
      </div>
    </article>
  );
}
