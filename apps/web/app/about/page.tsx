import type { Metadata } from "next";
import Image from "next/image";

import { SkillGroups, type UsedInTarget } from "@/components/about/SkillGroups";
import { DegreeItem } from "@/components/credentials/CredentialItem";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
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

/** The framed portrait, as on the home hero. */
function Portrait() {
  const { portrait } = profile;
  if (!portrait) return null;
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:mr-0 lg:max-w-[360px]">
      <div
        aria-hidden="true"
        className="portrait-glow absolute -inset-10 -z-10"
      />
      <div className="edge-highlight rounded-2xl border border-border bg-surface p-2.5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-raised">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            preload
            sizes="(min-width: 1024px) 340px, 300px"
            className="object-cover"
          />
        </div>
        <p className="flex items-center justify-between px-2 pt-3 pb-1 font-mono text-xs text-text-muted">
          <span>{profile.title}</span>
          <span>{profile.location}</span>
        </p>
      </div>
    </div>
  );
}

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
          <p className="text-lg leading-relaxed text-text/85">
            {profile.about}
          </p>
        }
        aside={<Portrait />}
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
