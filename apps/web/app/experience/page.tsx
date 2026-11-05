import type { Metadata } from "next";

import { InternshipCard } from "@/components/experience/InternshipCard";
import { TeachingCard } from "@/components/experience/TeachingCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getDpSgdExplainer,
  getInitiativeByName,
  getInternship,
  getProfile,
} from "@/content";

const title = `Experience — ${getProfile().name}`;
const description =
  "AI/ML engineering internship in LLM fine-tuning and DP-SGD, and teaching two AI bootcamps.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/experience" },
  openGraph: { title, description },
};

// The bootcamps taught, oldest first, with the title shown on this page.
const teaching = [
  { name: "CSS AI Bootcamp 2025" },
  {
    name: "CSS Summer Bootcamp 2026 (3 tracks)",
    title: "CSS Summer Bootcamp 2026 — AI & Data Science track",
  },
];

export default function ExperiencePage() {
  const internship = getInternship();
  const bootcamps = teaching.flatMap(({ name, title }) => {
    const initiative = getInitiativeByName(name);
    return initiative ? [{ initiative, title }] : [];
  });

  return (
    <Container>
      <PageHeader label="Experience" title="Experience" />
      {internship && (
        <Section
          id="industry"
          label="01"
          aria-labelledby="industry-heading"
          heading={<h2 id="industry-heading">Industry</h2>}
        >
          <InternshipCard role={internship} explainer={getDpSgdExplainer()} />
        </Section>
      )}
      {bootcamps.length > 0 && (
        <Section
          id="teaching"
          label={internship ? "02" : "01"}
          aria-labelledby="teaching-heading"
          heading={<h2 id="teaching-heading">Teaching</h2>}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {bootcamps.map(({ initiative, title }) => (
              <TeachingCard
                key={initiative.name}
                initiative={initiative}
                title={title}
              />
            ))}
          </div>
        </Section>
      )}
    </Container>
  );
}
