import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Arrow, arrowLinkClasses } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import type { CaseStudy, Project } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

import { ProjectCover } from "./ProjectCover";

// PLAN.md section 5 (Projects): the planned filter names.
const tagLabels: Record<Project["tags"][number], string> = {
  "agentic-rag": "Agentic / RAG",
  "full-stack": "Full-stack",
  ml: "ML",
  fundamentals: "Fundamentals",
};

export function projectEyebrow(project: Project) {
  const period =
    project.period?.start &&
    formatEventRange(project.period.start, project.period.end);
  return [project.tags.map((tag) => tagLabels[tag]).join(" · "), period]
    .filter(Boolean)
    .join(" · ");
}

export type FeaturedProject = { project: Project; caseStudy?: CaseStudy };

/**
 * A case-study card: cover (generated or the real image), eyebrow, title,
 * summary, role, stack, status and links. Used on home and /projects.
 * Covers alternate sides on wide screens.
 */
export function CaseStudyCard({
  project,
  caseStudy,
  index,
  headingLevel: Heading = "h3",
}: FeaturedProject & { index: number; headingLevel?: "h2" | "h3" }) {
  const reversed = index % 2 === 0;
  const externalLinks = (["live", "repo"] as const).flatMap((kind) =>
    project.links.filter((link) => link.kind === kind),
  );

  return (
    <article
      className={cardClasses({
        interactive: true,
        className: "grid overflow-hidden lg:grid-cols-2",
      })}
    >
      <ProjectCover
        project={project}
        steps={caseStudy?.architecture.steps ?? []}
        index={index}
        className={`min-h-72 border-b border-border lg:min-h-[30rem] lg:border-b-0 ${
          reversed ? "lg:order-last lg:border-l" : "lg:border-r"
        }`}
      />
      <div className="flex flex-col p-6 sm:p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>{projectEyebrow(project)}</Eyebrow>
          <Pill status={project.status} />
        </div>
        <Heading className="mt-6 font-display text-display-3 font-bold">
          {project.title}
        </Heading>
        <p className="mt-4 text-lg text-text/85">{project.summary}</p>
        <p className="mt-3 text-sm text-text-muted">{project.role}</p>
        {project.stack.length > 0 && (
          <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
            {project.stack.slice(0, 6).map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-8">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`Read case study: ${project.title}`}
            className={arrowLinkClasses("signal", "text-base")}
          >
            Read case study
            <Arrow />
          </Link>
          {externalLinks.map((link) => (
            <EvidenceChip key={link.url} {...link} />
          ))}
        </div>
      </div>
    </article>
  );
}
