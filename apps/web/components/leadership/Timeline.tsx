import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { cardClasses } from "@/components/ui/Card";
import { Timeline as TimelineList } from "@/components/ui/Timeline";
import type { Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

/** Community roles, newest first, on the shared timeline (ember). */
export function Timeline({ roles }: { roles: Role[] }) {
  if (roles.length === 0) return null;

  return (
    <TimelineList
      accent="ember"
      label="Leadership roles, newest first"
      items={roles.map((role, index) => ({
        key: `${role.org}-${role.title}`,
        date: formatMonthRange(role.start, role.end),
        current: index === 0,
        children: (
          <article className={cardClasses({ className: "p-6 md:p-7" })}>
            <h3 className="font-display text-xl leading-snug font-semibold tracking-tight">
              {role.title}
            </h3>
            <p className="mt-1 text-text-muted">{role.org}</p>
            {role.myContributions.length > 0 && (
              <ul className="mt-5 grid gap-2.5 border-t border-border pt-5">
                {role.myContributions.map((item) => (
                  <li key={item} className="flex max-w-[72ch] gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ember"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {role.evidence.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {role.evidence.map((item) => (
                  <li key={item.url}>
                    <EvidenceChip {...item} verified />
                  </li>
                ))}
              </ul>
            )}
          </article>
        ),
      }))}
    />
  );
}
