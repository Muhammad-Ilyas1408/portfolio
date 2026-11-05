import type { Metadata } from "next";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProfile, getProjects } from "@/content";
import { pageMetadata } from "@/lib/seo";

const projectTitles = getProjects().map((project) => project.title);

export const metadata: Metadata = pageMetadata({
  title: `Projects — ${getProfile().name}`,
  description: `Case studies of ${projectTitles.join(" and ")}: architecture, engineering decisions and results, each linked to its evidence.`,
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Container>
      <Section
        label="Work"
        accent="signal"
        aria-labelledby="projects-heading"
        heading={<h1 id="projects-heading">Projects</h1>}
      >
        {projects.length > 0 && (
          <ul className="grid gap-6">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} size="large" headingLevel="h2" />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </Container>
  );
}
