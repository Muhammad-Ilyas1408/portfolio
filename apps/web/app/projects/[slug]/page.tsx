import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import {
  AtAGlance,
  CaseStudyHeader,
  Decisions,
  HardProblems,
  Limitations,
  ProjectPager,
  Results,
  TeamAndCredit,
} from "@/components/projects/CaseStudySections";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getAdjacentProjects,
  getCaseStudy,
  getCaseStudySlugs,
  getProfile,
  getProject,
} from "@/content";

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

function load(slug: string) {
  const project = getProject(slug);
  const caseStudy = getCaseStudy(slug);
  return project && caseStudy ? { project, caseStudy } : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const found = load((await params).slug);
  if (!found) return {};
  const { project } = found;
  const title = `${project.title} — Case study · ${getProfile().name}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description: project.summary },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const found = load((await params).slug);
  // proxy.ts answers unknown slugs with a real 404 before this streams.
  if (!found) notFound();
  const { project, caseStudy } = found;
  const { previous, next } = getAdjacentProjects(project.slug);

  // Sections with nothing to show are left out, and the rest are numbered.
  const sections: { id: string; title: string; body: ReactNode }[] = [
    {
      id: "at-a-glance",
      title: "At a glance",
      body: <AtAGlance project={project} caseStudy={caseStudy} />,
    },
    {
      id: "architecture",
      title: "Architecture",
      body: (
        <ArchitectureDiagram
          title={project.title}
          steps={caseStudy.architecture.steps}
        />
      ),
    },
    ...(caseStudy.decisions.length > 0
      ? [
          {
            id: "decisions",
            title: "Key decisions",
            body: <Decisions decisions={caseStudy.decisions} />,
          },
        ]
      : []),
    ...(caseStudy.hardProblems.length > 0
      ? [
          {
            id: "hard-problems",
            title: "Hard problems",
            body: <HardProblems problems={caseStudy.hardProblems} />,
          },
        ]
      : []),
    ...(project.results.length > 0
      ? [
          {
            id: "results",
            title: "Results",
            body: <Results results={project.results} />,
          },
        ]
      : []),
    {
      id: "team",
      title: "Team & credit",
      body: <TeamAndCredit project={project} />,
    },
    ...(caseStudy.limitations.length > 0
      ? [
          {
            id: "next",
            title: "What I'd do next",
            body: <Limitations items={caseStudy.limitations} />,
          },
        ]
      : []),
  ];

  return (
    <Container>
      <article>
        <CaseStudyHeader project={project} />
        {sections.map((section, index) => (
          <Section
            key={section.id}
            label={String(index + 1).padStart(2, "0")}
            aria-labelledby={`${section.id}-heading`}
            heading={<h2 id={`${section.id}-heading`}>{section.title}</h2>}
          >
            {section.body}
          </Section>
        ))}
      </article>
      <ProjectPager previous={previous} next={next} />
    </Container>
  );
}
