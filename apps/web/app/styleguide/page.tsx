import type { Metadata } from "next";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Pill, type PillStatus } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { getProfile } from "@/content";

export const metadata: Metadata = {
  title: `Styleguide — ${getProfile().name}`,
  robots: { index: false, follow: false },
};

const tokens = [
  "bg",
  "surface",
  "surface-raised",
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
  { size: "14px", className: "text-sm" },
  { size: "17px", className: "text-base" },
  { size: "20px", className: "text-lg" },
  { size: "28px", className: "text-xl" },
  { size: "40px", className: "text-2xl" },
  { size: "64px", className: "text-3xl" },
];

const statuses: PillStatus[] = [
  "live",
  "complete",
  "in-progress",
  "experiment",
  "concept",
];

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

      <Section label="Components" heading={<h2>Button</h2>}>
        <div className="flex flex-wrap gap-4">
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
        <Card>Sample card</Card>
      </Section>

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
          <EvidenceChip
            kind="repo"
            label="Verified sample"
            url="https://example.com"
            verified
          />
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
