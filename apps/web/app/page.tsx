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

const profile = getProfile();
const title = `${profile.name} — ${profile.title}`;

// TODO: set metadataBase once the production domain is known (M8/M9), so the
// canonical and Open Graph URLs resolve to it instead of localhost.
export const metadata: Metadata = {
  title,
  description: profile.positioning,
  alternates: { canonical: "/" },
  openGraph: { title, description: profile.positioning },
};

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
