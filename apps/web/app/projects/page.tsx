import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/projects/CaseStudyCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getCaseStudy, getProfile, getProjects } from "@/content";
import { pageMetadata } from "@/lib/seo";

const projectTitles = getProjects().map((project) => project.title);
// The page's existing description doubles as its intro.
const description = `Case studies of ${projectTitles.join(" and ")}: architecture, engineering decisions and results, each linked to its evidence.`;

export const metadata: Metadata = pageMetadata({
  title: `Projects — ${getProfile().name}`,
  description,
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHero eyebrow="Selected work" title="Projects" intro={description} />
      {projects.length > 0 && (
        <Container className="py-14 md:py-20">
          <ul aria-label="Projects" className="grid gap-6 md:gap-8">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <CaseStudyCard
                  project={project}
                  caseStudy={getCaseStudy(project.slug)}
                  index={index + 1}
                  headingLevel="h2"
                />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
