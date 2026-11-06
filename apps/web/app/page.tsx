import type { Metadata } from "next";

import { ContactBand } from "@/components/home/ContactBand";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { HowIWork } from "@/components/home/HowIWork";
import { LeadershipBand } from "@/components/home/LeadershipBand";
import { Recognition } from "@/components/home/Recognition";
import { StatsRow } from "@/components/home/StatsRow";
import { TechStack } from "@/components/home/TechStack";
import { WhatIBuild } from "@/components/home/WhatIBuild";
import { WorkedWith } from "@/components/home/WorkedWith";
import {
  getCapabilities,
  getCaseStudy,
  getFeaturedProjects,
  getHomeContact,
  getHomeHero,
  getHomeLeadership,
  getHomeStats,
  getInitiativeByName,
  getInternship,
  getPrinciples,
  getProfile,
  getRecognition,
  getSiteDescription,
  getSkills,
  getWorkedWith,
} from "@/content";
import { formatEventRange } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

const profile = getProfile();

// Absolute URLs resolve against metadataBase (NEXT_PUBLIC_SITE_URL, root layout).
export const metadata: Metadata = pageMetadata({
  title: `${profile.name} — ${profile.title}`,
  description: getSiteDescription(),
  path: "/",
});

export default function Home() {
  const leadership = getHomeLeadership();
  const leadEvent = getInitiativeByName(leadership.photo.initiative);
  const featured = getFeaturedProjects().map((project) => ({
    project,
    caseStudy: getCaseStudy(project.slug),
  }));

  // Numbered in render order; sections without content are left out.
  const numbered = [
    getCapabilities().length > 0 && "build",
    getSkills().some((group) => group.skills.length > 0) && "stack",
    featured.length > 0 && "work",
    getPrinciples().length > 0 && "principles",
    "leadership",
    getRecognition().length > 0 && "recognition",
  ].filter((key): key is string => !!key);
  const number = (key: string) =>
    String(numbered.indexOf(key) + 1).padStart(2, "0");

  return (
    <>
      <Hero profile={profile} hero={getHomeHero()} />
      <StatsRow stats={getHomeStats()} />
      <WorkedWith orgs={getWorkedWith()} />
      <WhatIBuild capabilities={getCapabilities()} number={number("build")} />
      <TechStack
        groups={getSkills()}
        featured={featured.map(({ project }) => project)}
        number={number("stack")}
      />
      <FeaturedWork
        projects={featured}
        internship={getInternship()}
        number={number("work")}
      />
      <HowIWork principles={getPrinciples()} number={number("principles")} />
      <LeadershipBand
        leadership={leadership}
        photoCaption={
          leadEvent &&
          [leadEvent.venue, formatEventRange(leadEvent.start, leadEvent.end)]
            .filter(Boolean)
            .join(" · ")
        }
        number={number("leadership")}
      />
      <Recognition awards={getRecognition()} number={number("recognition")} />
      <ContactBand contact={getHomeContact()} email={profile.links.email} />
    </>
  );
}
