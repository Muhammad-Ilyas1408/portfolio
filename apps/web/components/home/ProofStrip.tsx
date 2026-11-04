import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import type { Claim } from "@/content/schema";

export function ProofStrip({ items }: { items: Claim[] }) {
  return (
    <section aria-labelledby="proof-heading" className="py-8">
      <h2 id="proof-heading" className="sr-only">
        Highlights
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.text}
            className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-surface p-4"
          >
            <p className="text-sm">{item.text}</p>
            {item.status === "verified" && item.evidence && (
              <div>
                <EvidenceChip {...item.evidence} verified />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
