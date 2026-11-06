import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { getProfile } from "@/content";
import { pageMetadata } from "@/lib/seo";

const description =
  "This page does not exist. Go back to the home page or see the projects.";

// No canonical: a 404 has no URL of its own to point at. Next.js already
// marks it noindex.
export const metadata: Metadata = pageMetadata({
  title: `Page not found — ${getProfile().name}`,
  description,
});

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHero
        eyebrow="404"
        title="Page not found"
        intro={description}
        actions={
          <>
            <Button href="/" size="lg">
              Home
            </Button>
            <Button href="/projects" variant="outline" size="lg">
              Work
            </Button>
          </>
        }
      />
    </div>
  );
}
