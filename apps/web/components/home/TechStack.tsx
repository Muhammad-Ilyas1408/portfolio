import { Reveal } from "@/components/motion/Reveal";
import { DisplaySection } from "@/components/ui/DisplaySection";
import type { Project, SkillGroup } from "@/content/schema";

/** Skill names used in at least one of the given projects. */
export function skillsUsedIn(groups: SkillGroup[], projects: Project[]) {
  const slugs = new Set(projects.map((project) => project.slug));
  return new Set(
    groups.flatMap((group) =>
      group.skills
        .filter((skill) => skill.usedIn.some((id) => slugs.has(id)))
        .map((skill) => skill.name),
    ),
  );
}

/**
 * skills.ts grouped by category as chip groups. Skills used in a featured
 * project carry a small accent dot (and a screen-reader note). No logos,
 * bars or percentages.
 */
export function TechStack({
  groups,
  featured,
  number,
}: {
  groups: SkillGroup[];
  featured: Project[];
  number: string;
}) {
  const visible = groups.filter((group) => group.skills.length > 0);
  if (visible.length === 0) return null;

  const used = skillsUsedIn(visible, featured);
  // Only name the projects that actually mark a skill.
  const marking = featured.filter((project) =>
    visible.some((group) =>
      group.skills.some((skill) => skill.usedIn.includes(project.slug)),
    ),
  );

  return (
    <DisplaySection
      id="tech-stack"
      number={number}
      eyebrow="Tech stack"
      title="Tools I work with"
      revealContent={false}
      intro={
        used.size > 0 && marking.length > 0 ? (
          <p className="flex items-center gap-2 text-base">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-signal"
            />
            Used in {marking.map((project) => project.title).join(" and ")}
          </p>
        ) : undefined
      }
    >
      <Reveal
        stagger
        className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((group, index) => (
          <div key={group.name} className="border-t border-border pt-5">
            <h3
              id={`stack-group-${index}`}
              className="font-mono text-xs font-medium tracking-[0.16em] text-text-muted uppercase"
            >
              {group.name}
            </h3>
            <ul
              aria-labelledby={`stack-group-${index}`}
              className="mt-4 flex flex-wrap gap-2"
            >
              {group.skills.map((skill) => {
                const isUsed = used.has(skill.name);
                return (
                  <li
                    key={skill.name}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                      isUsed
                        ? "border-signal/35 bg-signal-soft text-text"
                        : "border-border bg-surface/60 text-text/85"
                    }`}
                  >
                    {isUsed && (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-signal"
                      />
                    )}
                    {skill.name}
                    {isUsed && (
                      <span className="sr-only">
                        {" "}
                        (used in a featured project)
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </Reveal>
    </DisplaySection>
  );
}
