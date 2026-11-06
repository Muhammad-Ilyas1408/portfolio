import type { Metadata } from "next";

import { ChapterStats } from "@/components/leadership/ChapterStats";
import { EventsTable } from "@/components/leadership/EventsTable";
import {
  BootcampCard,
  LeadInitiative,
} from "@/components/leadership/FeaturedInitiatives";
import { RecognitionStrip } from "@/components/leadership/RecognitionStrip";
import { Timeline } from "@/components/leadership/Timeline";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
import {
  getChapter,
  getCommunityRoles,
  getHomeLeadership,
  getInitiativeByName,
  getInitiatives,
  getProfile,
  getPublishedCredentials,
} from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Leadership — ${getProfile().name}`,
  description:
    "From a GDSC team member to leading the Computing Students Society: roles, events and recognition.",
  path: "/leadership",
});

const leadEvent = "TechRise '26";
const bootcampNames = [
  "CSS Summer Bootcamp 2026 (3 tracks)",
  "CSS AI Bootcamp 2025",
];
const recognitionAward =
  "Award of Appreciation — President, CSS Chapter 2025–26";

export default function LeadershipPage() {
  const roles = getCommunityRoles();
  const initiatives = getInitiatives();
  const lead = getInitiativeByName(leadEvent);
  const bootcamps = bootcampNames.flatMap((name) => {
    const initiative = getInitiativeByName(name);
    return initiative ? [initiative] : [];
  });
  const award = getPublishedCredentials("award").find(
    (credential) => credential.name === recognitionAward,
  );

  const chapter = getChapter();
  const { headline } = getHomeLeadership();

  // Sections are numbered in the order they render (M8.5 B: the numbers
  // first, then the roles).
  const sections = [
    {
      id: "chapter",
      title: chapter.title,
      intro: chapter.intro,
      body: <ChapterStats chapter={chapter} />,
    },
    roles.length > 0 && {
      id: "progression",
      title: "Progression",
      body: <Timeline roles={roles} />,
    },
    (lead || bootcamps.length > 0) && {
      id: "featured",
      title: "Featured initiatives",
      body: (
        <div className="grid gap-6">
          {lead && <LeadInitiative initiative={lead} />}
          {bootcamps.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {bootcamps.map((initiative) => (
                <BootcampCard key={initiative.name} initiative={initiative} />
              ))}
            </div>
          )}
        </div>
      ),
    },
    initiatives.length > 0 && {
      id: "events",
      title: "All events and programmes",
      body: <EventsTable initiatives={initiatives} />,
    },
    award && {
      id: "recognition",
      title: "Recognition",
      body: <RecognitionStrip award={award} />,
    },
  ].filter((section) => !!section);

  return (
    <div className="spot-ember">
      <PageHero
        eyebrow="Leadership & community"
        accent="ember"
        title={headline.text}
        accentPhrase={headline.accent}
      />
      <Container>
        {sections.map((section, index) => (
          <PageSection
            key={section.id}
            id={section.id}
            accent="ember"
            number={sectionNumber(index)}
            title={section.title}
            intro={"intro" in section ? section.intro : undefined}
          >
            {section.body}
          </PageSection>
        ))}
      </Container>
    </div>
  );
}
