import type { Metadata } from "next";

import { ContactBand } from "@/components/home/ContactBand";
import { CredentialsRow } from "@/components/home/CredentialsRow";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { LeadershipPreview } from "@/components/home/LeadershipPreview";
import { ProofStrip } from "@/components/home/ProofStrip";
import { Container } from "@/components/ui/Container";
import {
  getFeaturedInitiatives,
  getHomeCredentials,
  getHomeProof,
  getInternship,
  getLeadershipPath,
  getProfile,
  getProject,
} from "@/content";
import { pageMetadata } from "@/lib/seo";

const profile = getProfile();

// Absolute URLs resolve against metadataBase (NEXT_PUBLIC_SITE_URL, root layout).
export const metadata: Metadata = pageMetadata({
  title: `${profile.name} — ${profile.title}`,
  description: profile.positioning,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero profile={profile} />
      <Container>
        <ProofStrip items={getHomeProof()} />
        <FeaturedWork
          lead={getProject("flood-aware")}
          secondary={getProject("storyweave")}
          internship={getInternship()}
        />
        <LeadershipPreview
          roles={getLeadershipPath()}
          initiatives={getFeaturedInitiatives()}
        />
        <CredentialsRow credentials={getHomeCredentials()} />
        <ContactBand email={profile.links.email} />
      </Container>
    </>
  );
}
