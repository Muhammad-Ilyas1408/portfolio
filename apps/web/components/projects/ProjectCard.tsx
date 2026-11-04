import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Chip } from "@/components/ui/Chip";
import { Pill } from "@/components/ui/Pill";
import type { Project } from "@/content/schema";

export const cardClasses =
  "rounded-lg border border-border bg-surface transition duration-150 hover:border-signal/40 hover:bg-surface-raised motion-safe:hover:-translate-y-0.5";

/** Highlighted results in content order, else the first 3 verified ones. */
export function homeResults(project: Project) {
  const highlighted = project.results.filter((result) => result.highlight);
  return highlighted.length > 0
    ? highlighted
    : project.results
        .filter((result) => result.status === "verified")
        .slice(0, 3);
}

export function ProjectCard({
  project,
  size,
  headingLevel = "h3",
}: {
  project: Project;
  size: "large" | "compact";
  headingLevel?: "h2" | "h3";
}) {
  const large = size === "large";
  const Heading = headingLevel;
  const externalLinks = (["live", "repo"] as const).flatMap((kind) =>
    project.links.filter((link) => link.kind === kind),
  );

  return (
    <article className={`${cardClasses} ${large ? "p-6 md:p-8" : "p-6"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading
          className={large ? "font-display text-xl font-bold" : "text-lg"}
        >
          {project.title}
        </Heading>
        <Pill status={project.status} />
      </div>
      <p className={`mt-3 ${large ? "max-w-[68ch] text-lg" : ""}`}>
        {project.summary}
      </p>
      <p className="mt-2 text-sm text-text-muted">{project.role}</p>

      {project.stack.length > 0 && (
        <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 6).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
      )}

      {homeResults(project).length > 0 && (
        <ul
          aria-label="Results"
          className={`mt-6 grid gap-3 ${large ? "md:grid-cols-3" : ""}`}
        >
          {homeResults(project).map((result) => (
            <li
              key={result.text}
              className="flex flex-col items-start gap-2 border-l border-signal/40 pl-3"
            >
              <span className="text-sm">{result.text}</span>
              {result.status === "verified" && result.evidence && (
                <EvidenceChip {...result.evidence} verified />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title} case study`}
          className="inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline"
        >
          Case study <span aria-hidden="true">→</span>
        </Link>
        {externalLinks.map((link) => (
          <EvidenceChip key={link.url} {...link} />
        ))}
      </div>
    </article>
  );
}
