import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import type { Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

/** Community roles, newest first, as a static vertical timeline. */
export function Timeline({ roles }: { roles: Role[] }) {
  if (roles.length === 0) return null;

  return (
    <ol aria-label="Leadership roles, newest first" className="grid">
      {roles.map((role, index) => {
        const last = index === roles.length - 1;
        return (
          <li
            key={`${role.org}-${role.title}`}
            className="relative pb-10 pl-8 last:pb-0"
          >
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-4 bottom-0 left-[5px] w-px bg-ember/40"
              />
            )}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-3 rounded-full border border-ember ${
                index === 0 ? "bg-ember" : "bg-bg"
              }`}
            />
            <p className="font-mono text-sm text-ember">
              {formatMonthRange(role.start, role.end)}
            </p>
            <h3 className="mt-1">{role.title}</h3>
            <p className="mt-1 text-sm text-text-muted">{role.org}</p>
            {role.myContributions.length > 0 && (
              <ul className="mt-3 max-w-[68ch] list-disc space-y-1 pl-5 marker:text-ember">
                {role.myContributions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {role.evidence.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {role.evidence.map((item) => (
                  <li key={item.url}>
                    <EvidenceChip {...item} verified />
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
