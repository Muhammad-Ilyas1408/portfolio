import type { Metadata } from "next";

import { SkillGroups, type UsedInTarget } from "@/components/about/SkillGroups";
import { DegreeItem } from "@/components/credentials/CredentialItem";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
import { Portrait } from "@/components/ui/Portrait";
import {
  getPrinciples,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  getSkills,
} from "@/content";
import { pageMetadata } from "@/lib/seo";

const profile = getProfile();

export const metadata: Metadata = pageMetadata({
  title: `About — ${profile.name}`,
  description: `About ${profile.name}: how I got into AI, my engineering principles, skills and education.`,
  path: "/about",
});

const usedInTargets: Record<string, UsedInTarget> = {
  ...Object.fromEntries(
    getProjects().map((project) => [
      project.slug,
      { label: project.title, href: `/projects/${project.slug}` },
    ]),
  ),
  internship: { label: "Internship", href: "/experience#industry" },
};

export default function AboutPage() {
  const principles = getPrinciples();
  const degree = getPublishedCredentials("degree")[0];
  const fyp = getProject("flood-aware");

  const sections = [
    principles.length > 0 && {
      id: "principles",
      title: "Engineering principles",
      body: (
        <ol
          className={`grid gap-4 ${
            principles.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {principles.map((principle, index) => (
            <li key={principle.title} className="flex">
              <Card
                variant="numbered"
                number={sectionNumber(index)}
                interactive
                className="flex w-full flex-col md:min-h-64 md:p-8"
              >
                <h3 className="mt-10 font-display text-xl leading-tight font-semibold tracking-tight text-balance">
                  {principle.title}
                </h3>
                <div className="mt-auto pt-8">
                  <div className="border-t border-border pt-5">
                    <p className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
                      In practice
                    </p>
                    <div className="mt-1">
                      <ArrowLink href={principle.href}>
                        {principle.linkLabel}
                      </ArrowLink>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: "skills",
      title: "Skills",
      body: <SkillGroups groups={getSkills()} targets={usedInTargets} />,
    },
    degree && {
      id: "education",
      title: "Education",
      body: (
        <DegreeItem
          credential={degree}
          fyp={
            fyp && {
              title: fyp.title,
              href: `/projects/${fyp.slug}`,
              supervisor: fyp.supervisor,
            }
          }
        />
      ),
    },
  ].filter((section) => !!section);

  return (
    <>
      <PageHero
        eyebrow="About"
        title={profile.name}
        intro={
          <div className="space-y-4 text-lg leading-relaxed text-text/85">
            <p>{profile.about}</p>
            {profile.aboutLeadership && <p>{profile.aboutLeadership}</p>}
          </div>
        }
        aside={
          profile.portrait && (
            <Portrait
              portrait={profile.portrait}
              sizes="(min-width: 1024px) 320px, 280px"
            />
          )
        }
      />
      <Container>
        {sections.map((section, index) => (
          <PageSection
            key={section.id}
            id={section.id}
            number={sectionNumber(index)}
            title={section.title}
          >
            {section.body}
          </PageSection>
        ))}
      </Container>
    </>
  );
}
