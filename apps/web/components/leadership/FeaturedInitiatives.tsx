import { StatChips } from "@/components/shared/StatChips";
import { TextLink } from "@/components/shared/TextLink";
import type { Initiative } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

import { PhotoGrid } from "./PhotoGrid";

/** The lead event: summary, stats and its photo gallery. */
export function LeadInitiative({ initiative }: { initiative: Initiative }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 md:p-8">
      <p className="font-mono text-sm text-ember">
        {formatEventRange(initiative.start, initiative.end)}
        {initiative.venue && ` · ${initiative.venue}`}
      </p>
      <h3 className="mt-1 text-xl">{initiative.name}</h3>
      <p className="mt-2 text-sm text-text-muted">{initiative.myRole}</p>
      {initiative.summary && (
        <p className="mt-4 max-w-[68ch]">{initiative.summary}</p>
      )}
      <div className="mt-4">
        <StatChips stats={initiative.stats} />
      </div>
      {initiative.photos.length > 0 && (
        <div className="mt-6">
          <PhotoGrid photos={initiative.photos} />
        </div>
      )}
    </article>
  );
}

/** A short bootcamp card that points to the teaching detail on /experience. */
export function BootcampCard({ initiative }: { initiative: Initiative }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6">
      <p className="font-mono text-sm text-ember">
        {formatEventRange(initiative.start, initiative.end)}
      </p>
      <h3 className="mt-1">{initiative.name}</h3>
      <p className="mt-2 text-sm text-text-muted">{initiative.myRole}</p>
      <div className="mt-4">
        <StatChips stats={initiative.stats} />
      </div>
      <div className="mt-auto pt-4">
        <TextLink
          href="/experience#teaching"
          accent="ember"
          aria-label={`What I taught at ${initiative.name}`}
        >
          What I taught <span aria-hidden="true">→</span>
        </TextLink>
      </div>
    </article>
  );
}
