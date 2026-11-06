import { StatChips } from "@/components/shared/StatChips";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { initiativeId } from "@/content";
import type { Initiative } from "@/content/schema";

/** A bootcamp on /experience, linking to its row on /leadership. */
export function TeachingCard({
  initiative,
  title = initiative.name,
}: {
  initiative: Initiative;
  title?: string;
}) {
  return (
    <article
      className={cardClasses({
        interactive: true,
        className: "flex flex-col p-6 md:p-8",
      })}
    >
      <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-balance">
        {title}
      </h3>
      <p className="mt-2 text-sm font-medium text-signal">
        {initiative.myRole}
      </p>
      {initiative.summary && (
        <p className="mt-4 max-w-[68ch] text-text/90">{initiative.summary}</p>
      )}
      <div className="mt-5">
        <StatChips stats={initiative.stats} accent="signal" />
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <ArrowLink
          href={`/leadership#${initiativeId(initiative)}`}
          aria-label={`${initiative.name} on the Leadership page`}
        >
          On the Leadership page
        </ArrowLink>
      </div>
    </article>
  );
}
