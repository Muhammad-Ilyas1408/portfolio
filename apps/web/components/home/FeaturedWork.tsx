import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { Arrow, arrowLinkClasses } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DisplaySection } from "@/components/ui/DisplaySection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import type { CaseStudy, Project, Role } from "@/content/schema";
import { formatEventRange, formatMonthRange } from "@/lib/format";

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

function CaseStudyCard({
  project,
  caseStudy,
  index,
}: FeaturedProject & { index: number }) {
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
        <h3 className="mt-6 font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-tight font-bold tracking-[-0.02em]">
          {project.title}
        </h3>
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

function InternshipRow({ role }: { role: Role }) {
  return (
    <article
      className={cardClasses({
        interactive: true,
        className:
          "flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10",
      })}
    >
      <div className="min-w-0">
        <Eyebrow>Industry · {formatMonthRange(role.start, role.end)}</Eyebrow>
        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
          {role.title}
        </h3>
        <p className="mt-1 text-text-muted">{role.org}</p>
        {role.myContributions[0] && (
          <p className="mt-3 max-w-[70ch] text-sm text-text/85">
            {role.myContributions[0]}
          </p>
        )}
      </div>
      <Link
        href="/experience"
        aria-label={`${role.title} experience`}
        className={arrowLinkClasses("signal", "shrink-0")}
      >
        Experience
        <Arrow />
      </Link>
    </article>
  );
}

export function FeaturedWork({
  projects,
  internship,
  number,
}: {
  projects: FeaturedProject[];
  internship?: Role;
  number: string;
}) {
  if (projects.length === 0 && !internship) return null;

  return (
    <DisplaySection
      id="work"
      number={number}
      eyebrow="Selected work"
      title="Featured work"
      viewAll={{ href: "/projects", label: "All projects" }}
    >
      <div className="grid gap-6">
        {projects.map((featured, index) => (
          <CaseStudyCard
            key={featured.project.slug}
            {...featured}
            index={index + 1}
          />
        ))}
        {internship && <InternshipRow role={internship} />}
      </div>
    </DisplaySection>
  );
}
