import Link from "next/link";

import { cardClasses } from "@/components/ui/Card";
import type { SkillGroup } from "@/content/schema";

export type UsedInTarget = { label: string; href: string };

/** Skills by area. A skill with `usedIn` links to where it was used. */
export function SkillGroups({
  groups,
  targets,
}: {
  groups: SkillGroup[];
  // usedIn value → link, e.g. "flood-aware" → Flood-Aware case study.
  targets: Record<string, UsedInTarget>;
}) {
  const visible = groups.filter((group) => group.skills.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visible.map((group, index) => (
        <section
          key={group.name}
          aria-labelledby={`skills-group-${index}`}
          className={cardClasses({ className: "p-6 md:p-7" })}
        >
          <h3
            id={`skills-group-${index}`}
            className="border-b border-border pb-4 font-mono text-xs font-medium tracking-[0.16em] text-signal uppercase"
          >
            {group.name}
          </h3>
          <ul className="mt-4 grid gap-3">
            {group.skills.map((skill) => {
              const links = skill.usedIn.flatMap((id) =>
                targets[id] ? [targets[id]] : [],
              );
              return (
                <li key={skill.name}>
                  <span className="font-semibold">{skill.name}</span>
                  {links.length > 0 && (
                    <span className="block text-sm text-text-muted">
                      Used in:{" "}
                      {links.map((link, index) => (
                        <span key={link.href}>
                          {index > 0 && ", "}
                          <Link
                            href={link.href}
                            className="rounded-sm text-signal underline-offset-4 hover:underline"
                          >
                            {link.label}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
