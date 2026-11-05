import type { Metadata } from "next";
import Image from "next/image";

import { SkillGroups, type UsedInTarget } from "@/components/about/SkillGroups";
import { DegreeItem } from "@/components/credentials/CredentialItem";
import { TextLink } from "@/components/shared/TextLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getPrinciples,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  getSkills,
} from "@/content";

const profile = getProfile();
const title = `About — ${profile.name}`;
const description = profile.positioning;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description },
};

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
  const { portrait } = profile;
  const principles = getPrinciples();
  const degree = getPublishedCredentials("degree")[0];
  const fyp = getProject("flood-aware");

  return (
    <Container>
      <header className="flex flex-col gap-8 pt-12 md:flex-row md:items-start md:gap-12 md:pt-16">
        {portrait && (
          <div className="relative size-32 shrink-0 overflow-hidden rounded-2xl border border-signal bg-surface md:size-64">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              preload
              sizes="(min-width: 768px) 256px, 128px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-sm text-signal">About</p>
          <h1 className="mt-2">{profile.name}</h1>
          <p className="mt-4 max-w-[68ch] text-lg">{profile.about}</p>
        </div>
      </header>

      {principles.length > 0 && (
        <Section
          id="principles"
          label="01"
          aria-labelledby="principles-heading"
          heading={<h2 id="principles-heading">Engineering principles</h2>}
        >
          <ul className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="flex flex-col rounded-lg border border-border bg-surface p-6"
              >
                <h3>{principle.title}</h3>
                <div className="mt-auto pt-4">
                  <TextLink href={principle.href}>
                    {principle.linkLabel} <span aria-hidden="true">→</span>
                  </TextLink>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id="skills"
        label={principles.length > 0 ? "02" : "01"}
        aria-labelledby="skills-heading"
        heading={<h2 id="skills-heading">Skills</h2>}
      >
        <SkillGroups groups={getSkills()} targets={usedInTargets} />
      </Section>

      {degree && (
        <Section
          id="education"
          label={principles.length > 0 ? "03" : "02"}
          aria-labelledby="education-heading"
          heading={<h2 id="education-heading">Education</h2>}
        >
          <div className="max-w-2xl">
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
          </div>
        </Section>
      )}
    </Container>
  );
}
