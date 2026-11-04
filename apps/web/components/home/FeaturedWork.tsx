import Link from "next/link";

import { cardClasses, ProjectCard } from "@/components/projects/ProjectCard";
import { Section } from "@/components/ui/Section";
import type { Project, Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

import { MoreLink } from "./MoreLink";

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
