import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import type { Claim } from "@/content/schema";

const tints = {
  signal: "bg-signal-soft",
  ember: "bg-ember-soft",
} as const;

/** Claims as tinted chips; verified ones carry their evidence, others a note. */
export function StatChips({
  stats,
  accent = "ember",
}: {
  stats: Claim[];
  accent?: keyof typeof tints;
}) {
  if (stats.length === 0) return null;
  const hasSelfReported = stats.some((stat) => stat.status === "self-reported");

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {stats.map((stat) => (
          <li key={stat.text} className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-sm ${tints[accent]}`}>
              {stat.text}
            </span>
            {stat.status === "verified" && stat.evidence && (
              <EvidenceChip {...stat.evidence} verified />
            )}
          </li>
        ))}
      </ul>
      {hasSelfReported && (
        <p className="mt-2 font-mono text-sm text-text-muted">Self-reported</p>
      )}
    </div>
  );
}
