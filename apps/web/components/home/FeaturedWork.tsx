import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Chip } from "@/components/ui/Chip";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import type { Project, Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

import { MoreLink } from "./MoreLink";

const cardClasses =
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

function ProjectCard({
  project,
  size,
}: {
  project: Project;
  size: "large" | "compact";
}) {
  const large = size === "large";
  const externalLinks = (["live", "repo"] as const).flatMap((kind) =>
    project.links.filter((link) => link.kind === kind),
  );

  return (
    <article className={`${cardClasses} ${large ? "p-6 md:p-8" : "p-6"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={large ? "font-display text-xl font-bold" : undefined}>
          {project.title}
        </h3>
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

function InternshipCard({ role }: { role: Role }) {
  return (
    <article className={`${cardClasses} p-6`}>
      <h3>{role.title}</h3>
      <p className="mt-1 text-sm">{role.org}</p>
      <p className="mt-1 font-mono text-sm text-text-muted">
        {formatMonthRange(role.start, role.end)}
      </p>
      {role.myContributions.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm marker:text-signal">
          {role.myContributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link
          href="/experience"
          aria-label={`${role.title} experience`}
          className="inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-signal underline-offset-4 hover:underline"
        >
          Experience <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function FeaturedWork({
  lead,
  secondary,
  internship,
}: {
  lead?: Project;
  secondary?: Project;
  internship?: Role;
}) {
  if (!lead && !secondary && !internship) return null;

  return (
    <Section
      label="01 — Work"
      accent="signal"
      aria-labelledby="work-heading"
      heading={<h2 id="work-heading">Featured work</h2>}
    >
      <div className="grid gap-6">
        {lead && <ProjectCard project={lead} size="large" />}
        {(secondary || internship) && (
          <div className="grid gap-6 md:grid-cols-2">
            {secondary && <ProjectCard project={secondary} size="compact" />}
            {internship && <InternshipCard role={internship} />}
          </div>
        )}
      </div>
      <div className="mt-6">
        <MoreLink href="/projects">All projects</MoreLink>
      </div>
    </Section>
  );
}
