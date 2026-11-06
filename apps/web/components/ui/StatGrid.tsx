import type { StatClaim } from "@/content/schema";

import type { Accent } from "./Eyebrow";
import { Stat } from "./Stat";

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
} as const;

/**
 * Claims with a stat split, as big numerals in a framed hairline grid. Each
 * cell keeps its claim's evidence chip; self-reported cells say so unless
 * `groupNote` covers the whole grid.
 */
export function StatGrid({
  claims,
  accent = "signal",
  columns = 3,
  label,
  groupNote = false,
}: {
  claims: StatClaim[];
  accent?: Accent;
  columns?: keyof typeof columnClasses;
  label?: string;
  /** True when one "Self-reported" note below the grid covers every cell. */
  groupNote?: boolean;
}) {
  const shown = claims.filter((claim) => claim.stat);
  if (shown.length === 0) return null;
  // Never more columns than cells, so no empty cells show.
  const cols = Math.min(columns, shown.length) as keyof typeof columnClasses;

  return (
    <div
      className={`edge-highlight overflow-hidden rounded-xl border border-border bg-surface ${
        cols === 1 ? "max-w-md" : ""
      }`}
    >
      {/* -mt-px/-ml-px hide the outer hairlines, so any count lines up. */}
      <ul
        aria-label={label}
        className={`-mt-px -ml-px grid ${columnClasses[cols]}`}
      >
        {shown.map((claim) => {
          const stat = claim.stat!;
          return (
            <li
              key={claim.text}
              className="min-w-0 border-t border-l border-border p-4 max-lg:odd:last:col-span-2 sm:p-6 md:p-7"
            >
              <Stat
                value={stat.value}
                label={stat.label}
                detail={stat.detail}
                accent={accent}
                status={
                  claim.status === "verified"
                    ? "verified"
                    : groupNote
                      ? undefined
                      : "self-reported"
                }
                evidence={claim.evidence}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
