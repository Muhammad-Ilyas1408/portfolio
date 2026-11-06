import type { Metadata } from "next";

import { InternshipCard } from "@/components/experience/InternshipCard";
import { TeachingCard } from "@/components/experience/TeachingCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
import { Timeline } from "@/components/ui/Timeline";
import {
  getDpSgdExplainer,
  getInitiativeByName,
  getInternship,
  getProfile,
} from "@/content";
import {
  formatDuration,
  formatEventRange,
  formatMonthRange,
} from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

// The page's existing description doubles as its intro.
const description =
  "My AI/ML engineering internship, where I worked on LLM fine-tuning and DP-SGD, and the two AI bootcamps I taught.";

export const metadata: Metadata = pageMetadata({
  title: `Experience — ${getProfile().name}`,
  description,
  path: "/experience",
});

// The bootcamps taught, newest first, with the title shown on this page.
const teaching = [
  {
    name: "CSS Summer Bootcamp 2026 (3 tracks)",
    title: "CSS Summer Bootcamp 2026 — AI & Data Science track",
  },
  { name: "CSS AI Bootcamp 2025" },
];

export default function ExperiencePage() {
  const internship = getInternship();
  const bootcamps = teaching.flatMap(({ name, title }) => {
    const initiative = getInitiativeByName(name);
    return initiative ? [{ initiative, title }] : [];
  });

  const sections = [
    internship && {
      id: "industry",
      title: "Industry",
      body: (
        <Timeline
          label="Industry roles"
          items={[
            {
              key: internship.title,
              date: formatMonthRange(internship.start, internship.end),
              duration: formatDuration(internship.start, internship.end),
              current: true,
              children: (
                <InternshipCard
                  role={internship}
                  explainer={getDpSgdExplainer()}
                />
              ),
            },
          ]}
        />
      ),
    },
    bootcamps.length > 0 && {
      id: "teaching",
      title: "Teaching",
      body: (
        <Timeline
          label="Bootcamps taught, newest first"
          items={bootcamps.map(({ initiative, title }, index) => ({
            key: initiative.name,
            date: formatEventRange(initiative.start, initiative.end),
            current: index === 0,
            children: <TeachingCard initiative={initiative} title={title} />,
          }))}
        />
      ),
    },
  ].filter((section) => !!section);

  return (
    <>
      <PageHero
        eyebrow="Industry · Teaching"
        title="Experience"
        intro={description}
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
