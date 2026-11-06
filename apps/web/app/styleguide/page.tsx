import type { Metadata } from "next";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { AccentText } from "@/components/ui/AccentText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Pill, type PillStatus } from "@/components/ui/Pill";
import { DisplaySection } from "@/components/ui/DisplaySection";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { getCaseStudy, getProfile, getProject } from "@/content";

export const metadata: Metadata = {
  title: `Styleguide — ${getProfile().name}`,
  robots: { index: false, follow: false },
};

const tokens = [
  "bg",
  "surface",
  "surface-raised",
  "surface-warm",
  "border",
  "text",
  "text-muted",
  "signal",
  "signal-soft",
  "ember",
  "ember-soft",
  "verified",
  "danger",
  "danger-soft",
];

const typeScale = [
  { size: "13px", className: "text-xs" },
  { size: "14px", className: "text-sm" },
  { size: "17px", className: "text-base" },
  { size: "20px", className: "text-lg" },
  { size: "28px", className: "text-xl" },
  { size: "40px", className: "text-2xl" },
  { size: "64px", className: "text-3xl" },
];

// M8.5 fluid display sizes (Bricolage, tight tracking).
const displayScale = [
  { size: "display-1 · 40–76px", className: "text-display-1" },
  { size: "display-2 · 32–52px", className: "text-display-2" },
  { size: "stat · 36–56px", className: "text-stat" },
];

const sampleEvidence = {
  kind: "repo",
  label: "Verified sample",
  url: "https://example.com",
} as const;

const statuses: PillStatus[] = [
  "live",
  "complete",
  "in-progress",
  "experiment",
  "concept",
];

const project = getProject("flood-aware");

export default function Styleguide() {
  return (
    <Container className="py-16">
      <h1>Styleguide</h1>

      <Section label="Tokens" heading={<h2>Colors</h2>}>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {tokens.map((token) => (
            <li key={token}>
              <div
                className="h-16 rounded-md border border-border"
                style={{ background: `var(--${token})` }}
              />
              <p className="mt-2 font-mono text-sm">{token}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Tokens" heading={<h2>Type scale</h2>}>
        <ul className="space-y-4">
          {typeScale.map(({ size, className }) => (
            <li key={size} className={className}>
              {size}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Tokens" heading={<h2>Display type</h2>}>
        <ul className="space-y-6">
          {displayScale.map(({ size, className }) => (
            <li key={size}>
              <p className="font-mono text-sm text-text-muted">{size}</p>
              <p className={`font-display font-bold ${className}`}>
                Display sample
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Components" heading={<h2>Eyebrow and accent phrase</h2>}>
        <div className="space-y-6">
          <Eyebrow>Signal eyebrow</Eyebrow>
          <Eyebrow accent="ember" number="04">
            Ember eyebrow with number
          </Eyebrow>
          <p className="font-display text-display-2 font-bold">
            <AccentText text="One phrase in signal" phrase="in signal" />
          </p>
          <p className="font-display text-display-2 font-bold">
            <AccentText
              text="One phrase in ember"
              phrase="in ember"
              accent="ember"
            />
          </p>
        </div>
      </Section>

      <Section label="Components" heading={<h2>Button and arrow link</h2>}>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">Primary large</Button>
          <Button variant="outline" size="lg">
            Secondary large
          </Button>
          <ArrowLink href="/">Signal text link</ArrowLink>
          <ArrowLink href="/" accent="ember">
            Ember text link
          </ArrowLink>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button>Filled</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button href="/">Filled link</Button>
          <Button href="/" variant="outline">
            Outline link
          </Button>
          <Button href="/" variant="ghost">
            Ghost link
          </Button>
        </div>
      </Section>

      <Section label="Components" heading={<h2>Chip</h2>}>
        <Chip>Sample label</Chip>
      </Section>

      <Section label="Components" heading={<h2>Pill</h2>}>
        <div className="flex flex-wrap gap-4">
          {statuses.map((status) => (
            <Pill key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section label="Components" heading={<h2>Card</h2>}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>Default card</Card>
          <Card variant="numbered" number="01" interactive>
            <p className="mt-6">Numbered, interactive card</p>
          </Card>
          <Card variant="stat">
            <Stat
              value="18"
              label="Stat in a card"
              detail="Optional muted detail"
              accent="ember"
              status="self-reported"
            />
          </Card>
        </div>
      </Section>

      <Section label="Components" heading={<h2>Stat</h2>}>
        <div className="grid gap-8 sm:grid-cols-2">
          <Stat
            value="348"
            label="Linked stat with evidence"
            detail="Detail line"
            href="/styleguide"
            status="verified"
            evidence={sampleEvidence}
          />
          <Stat
            value="~40"
            label="Ember stat"
            accent="ember"
            status="self-reported"
          />
        </div>
      </Section>

      <Section label="Components" heading={<h2>Divider</h2>}>
        <div className="space-y-8">
          <Divider />
          <Divider label="Labelled divider" />
        </div>
      </Section>

      <Section label="Components" heading={<h2>Backgrounds</h2>}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative h-40 overflow-hidden rounded-xl border border-border">
            <div
              aria-hidden="true"
              className="hero-backdrop absolute inset-0"
            />
            <p className="relative p-4 font-mono text-sm">hero-backdrop</p>
          </div>
          <div className="glow-signal h-40 rounded-xl border border-border p-4 font-mono text-sm">
            glow-signal
          </div>
          <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-surface-warm">
            <div aria-hidden="true" className="ember-glow absolute inset-0" />
            <p className="relative p-4 font-mono text-sm">
              surface-warm + ember-glow
            </p>
          </div>
        </div>
      </Section>

      <Section label="Components" heading={<h2>Project cover</h2>}>
        {project && (
          <ProjectCover
            project={project}
            steps={getCaseStudy(project.slug)?.architecture.steps ?? []}
            index={1}
            className="min-h-80 rounded-xl border border-border"
          />
        )}
      </Section>

      <DisplaySection
        id="display-section-sample"
        number="01"
        eyebrow="DisplaySection"
        title="Display section with view-all link"
        intro="Eyebrow, optional number, display h2, optional intro and a right-aligned link. Used on the home page."
        viewAll={{ href: "/styleguide", label: "View all" }}
        className="-mx-5 sm:-mx-6 lg:-mx-8"
      >
        <Card>Section content</Card>
      </DisplaySection>

      <Section label="Components" heading={<h2>Section</h2>}>
        <Section label="01 — Signal" heading={<h3>Signal accent</h3>} />
        <Section
          label="02 — Ember"
          heading={<h3>Ember accent</h3>}
          accent="ember"
        />
      </Section>

      <Section label="Components" heading={<h2>EvidenceChip</h2>}>
        <div className="flex flex-wrap gap-4">
          <EvidenceChip {...sampleEvidence} verified />
          <EvidenceChip
            kind="repo"
            label="Unverified sample"
            url="https://example.com"
          />
        </div>
      </Section>
    </Container>
  );
}
