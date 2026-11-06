import type { Metadata } from "next";

import {
  AwardCard,
  CredentialRow,
  DegreeItem,
  SpecializationCard,
} from "@/components/credentials/CredentialItem";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PageSection, sectionNumber } from "@/components/ui/PageSection";
import { getCredentialGroups, getProfile, getProject } from "@/content";
import type { Credential } from "@/content/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Credentials — ${getProfile().name}`,
  description:
    "Degree, awards, certificates, specializations, courses and training, each linked to its proof where one exists.",
  path: "/credentials",
});

const fyp = getProject("flood-aware");

/** Each group's layout: degree card, image cards, prominent cards or rows. */
function GroupItems({ items }: { items: Credential[] }) {
  switch (items[0]?.kind) {
    case "degree":
      return (
        <ul className="grid gap-4">
          {items.map((credential) => (
            <li key={credential.name}>
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
            </li>
          ))}
        </ul>
      );
    case "award":
    case "certificate": {
      // Photos in a grid of image cards; a lone photo, and items without
      // one, as full-width rows (so no empty cells or stand-in images).
      const withPhoto = items.filter((item) => item.photos?.[0]);
      const rows =
        withPhoto.length === 1
          ? items
          : items.filter((item) => !item.photos?.[0]);
      const grid = withPhoto.length === 1 ? [] : withPhoto;
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((credential) => (
            <li key={credential.name}>
              <AwardCard credential={credential} />
            </li>
          ))}
          {rows.map((credential) => (
            <li key={credential.name} className="sm:col-span-full">
              <AwardCard credential={credential} layout="row" />
            </li>
          ))}
        </ul>
      );
    }
    case "specialization":
      return (
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((credential) => (
            <li key={credential.name}>
              <SpecializationCard credential={credential} />
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <ul className="divide-y divide-border border-y border-border">
          {items.map((credential) => (
            <li key={credential.name}>
              <CredentialRow credential={credential} />
            </li>
          ))}
        </ul>
      );
  }
}

export default function CredentialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Education · Awards · Certificates"
        title="Credentials"
        intro="Certificates link to their issuer's verification page; the degree is shown with my final-year thesis."
      />
      <Container>
        {getCredentialGroups().map((group, index) => (
          <PageSection
            key={group.id}
            id={group.id}
            number={sectionNumber(index)}
            title={group.title}
          >
            <GroupItems items={group.items} />
          </PageSection>
        ))}
      </Container>
    </>
  );
}
