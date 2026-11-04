import type { Metadata } from "next";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProfile, getProjects } from "@/content";

const title = `Projects — ${getProfile().name}`;
const description = getProfile().positioning;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title, description },
};

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
