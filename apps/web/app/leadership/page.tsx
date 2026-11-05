import type { Metadata } from "next";

import { ChapterStats } from "@/components/leadership/ChapterStats";
import { EventsTable } from "@/components/leadership/EventsTable";
import {
  BootcampCard,
  LeadInitiative,
} from "@/components/leadership/FeaturedInitiatives";
import { RecognitionStrip } from "@/components/leadership/RecognitionStrip";
import { Timeline } from "@/components/leadership/Timeline";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getChapter,
  getCommunityRoles,
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

  // Sections are numbered in the order they render.
  const sections = [
    roles.length > 0 && {
      id: "progression",
      title: "Progression",
      body: <Timeline roles={roles} />,
    },
    {
      id: "chapter",
      title: "Chapter 2 in numbers",
      body: <ChapterStats chapter={getChapter()} />,
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
    <Container>
      <PageHeader label="Leadership" title="Leadership" accent="ember">
        <p>
          From a GDSC team member to leading the Computing Students Society.
        </p>
      </PageHeader>
      {sections.map((section, index) => (
        <Section
          key={section.id}
          id={section.id}
          accent="ember"
          className="scroll-mt-20"
          label={String(index + 1).padStart(2, "0")}
          aria-labelledby={`${section.id}-heading`}
          heading={<h2 id={`${section.id}-heading`}>{section.title}</h2>}
        >
          {section.body}
        </Section>
      ))}
    </Container>
  );
}
