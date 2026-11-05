import type { Metadata } from "next";

import {
  CredentialItem,
  DegreeItem,
} from "@/components/credentials/CredentialItem";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCredentialGroups, getProfile, getProject } from "@/content";

const title = `Credentials — ${getProfile().name}`;
const description =
  "Degree, awards, specializations, courses and training, each linked to its proof where one exists.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/credentials" },
  openGraph: { title, description },
};

export default function CredentialsPage() {
  const groups = getCredentialGroups();
  const fyp = getProject("flood-aware");

  return (
    <Container>
      <PageHeader label="Credentials" title="Credentials">
        <p className="text-base text-text-muted">
          Certificates link to their issuer&apos;s verification page; the degree
          is shown with my final-year thesis.
        </p>
      </PageHeader>
      {groups.map((group, index) => (
        <Section
          key={group.id}
          id={group.id}
          className="scroll-mt-20"
          label={String(index + 1).padStart(2, "0")}
          aria-labelledby={`${group.id}-heading`}
          heading={<h2 id={`${group.id}-heading`}>{group.title}</h2>}
        >
          <ul className="grid gap-4 lg:grid-cols-2">
            {group.items.map((credential) => (
              <li key={credential.name}>
                {credential.kind === "degree" ? (
                  <DegreeItem
                    credential={credential}
                    fyp={
                      fyp && {
                        title: fyp.title,
                        href: `/projects/${fyp.slug}`,
                        supervisor: fyp.supervisor,
                      }
                    }
                  />
                ) : (
                  <CredentialItem credential={credential} />
                )}
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </Container>
  );
}
