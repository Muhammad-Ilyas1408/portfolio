import { ArrowLink } from "@/components/ui/ArrowLink";
import { Card } from "@/components/ui/Card";
import { DisplaySection } from "@/components/ui/DisplaySection";
import type { Principle } from "@/content/schema";

/** The principles as numbered cards, each linking to where it shows. */
export function HowIWork({
  principles,
  number,
}: {
  principles: Principle[];
  number: string;
}) {
  if (principles.length === 0) return null;

  return (
    <DisplaySection
      id="how-i-work"
      number={number}
      eyebrow="Principles"
      title="How I work"
    >
      <ol
        className={`grid gap-4 ${
          principles.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {principles.map((principle, index) => (
          <li key={principle.title} className="flex">
            <Card
              variant="numbered"
              number={String(index + 1).padStart(2, "0")}
              interactive
              className="flex w-full flex-col md:min-h-72 md:p-8"
            >
              <h3 className="mt-12 font-display text-xl leading-tight font-semibold tracking-tight text-balance">
                {principle.title}
              </h3>
              <div className="mt-auto pt-8">
                <div className="border-t border-border pt-5">
                  <p className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
                    In practice
                  </p>
                  <div className="mt-1">
                    <ArrowLink href={principle.href}>
                      {principle.linkLabel}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </DisplaySection>
  );
}
