import Link from "next/link";

import {
  CaseStudyCard,
  type FeaturedProject,
} from "@/components/projects/CaseStudyCard";
import { Arrow, arrowLinkClasses } from "@/components/ui/ArrowLink";
import { cardClasses } from "@/components/ui/Card";
import { DisplaySection } from "@/components/ui/DisplaySection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

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
