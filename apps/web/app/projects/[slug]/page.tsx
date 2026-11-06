import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ContactBand } from "@/components/home/ContactBand";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { projectEyebrow } from "@/components/projects/CaseStudyCard";
import {
  AtAGlance,
  BackToProjects,
  CaseStudyActions,
  caseStudyMeta,
  Decisions,
  HardProblems,
  Limitations,
  OnThisPage,
  ProjectPager,
  Results,
  TeamAndCredit,
} from "@/components/projects/CaseStudySections";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { JsonLd } from "@/components/shared/JsonLd";
import { cardClasses } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
import { Pill } from "@/components/ui/Pill";
import {
  getAdjacentProjects,
  getCaseStudy,
  getCaseStudySlugs,
  getHomeContact,
  getProfile,
  getProject,
  getProjects,
} from "@/content";
import { caseStudyJsonLd } from "@/lib/json-ld";
import { caseStudyOgImage, pageMetadata } from "@/lib/seo";

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
  return pageMetadata({
    title: `${project.title} — Case study · ${getProfile().name}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
    image: caseStudyOgImage(project.slug),
  });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const found = load((await params).slug);
  // proxy.ts answers unknown slugs with a real 404 before this streams.
  if (!found) notFound();
  const { project, caseStudy } = found;
  const { previous, next } = getAdjacentProjects(project.slug);
  const profile = getProfile();
  const index =
    getProjects().findIndex((item) => item.slug === project.slug) + 1;

  // Sections with nothing to show are left out, and the rest are numbered.
  // M8.5 B order: the numbers come right after the overview.
  const sections: { id: string; title: string; body: ReactNode }[] = [
    {
      id: "at-a-glance",
      title: "At a glance",
      body: <AtAGlance project={project} caseStudy={caseStudy} />,
    },
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
      id: "architecture",
      title: "Architecture",
      body: (
        <div className={cardClasses({ className: "p-6 md:p-10" })}>
          <ArchitectureDiagram
            title={project.title}
            steps={caseStudy.architecture.steps}
          />
        </div>
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
    ...(caseStudy.limitations.length > 0
      ? [
          {
            id: "next",
            title: "What I'd do next",
            body: <Limitations items={caseStudy.limitations} />,
          },
        ]
      : []),
    {
      id: "team",
      title: "Team & credit",
      body: <TeamAndCredit project={project} />,
    },
  ];

  return (
    <>
      <JsonLd data={caseStudyJsonLd(project, profile)} />
      <article>
        <PageHero
          before={<BackToProjects />}
          eyebrow={projectEyebrow(project)}
          badge={<Pill status={project.status} />}
          title={project.title}
          intro={project.summary}
          meta={caseStudyMeta(project)}
          actions={<CaseStudyActions project={project} />}
          after={
            <ProjectCover
              project={project}
              steps={caseStudy.architecture.steps}
              index={index}
              layout="wide"
              className="min-h-72 rounded-xl border border-border md:min-h-80"
            />
          }
        />
        <Container>
          <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-16">
            <div className="min-w-0">
              {sections.map((section, sectionIndex) => (
                <PageSection
                  key={section.id}
                  id={section.id}
                  number={sectionNumber(sectionIndex)}
                  title={section.title}
                >
                  {section.body}
                </PageSection>
              ))}
            </div>
            <div className="hidden xl:block">
              <OnThisPage sections={sections} />
            </div>
          </div>
        </Container>
      </article>
      <Container>
        <ProjectPager previous={previous} next={next} />
      </Container>
      <ContactBand contact={getHomeContact()} email={profile.links.email} />
    </>
  );
}
