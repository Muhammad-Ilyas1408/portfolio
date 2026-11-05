import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/content";
import { pageMetadata } from "@/lib/seo";

// No canonical: a 404 has no URL of its own to point at. Next.js already
// marks it noindex.
export const metadata: Metadata = pageMetadata({
  title: `Page not found — ${getProfile().name}`,
  description:
    "This page does not exist. Go back to the home page or see the projects.",
});

export default function NotFound() {
  return (
    <Container className="py-16">
      <p className="font-mono text-sm text-signal">404</p>
      <h1 className="mt-2">Page not found</h1>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button href="/">Home</Button>
        <Button href="/projects" variant="outline">
          Work
        </Button>
      </div>
    </Container>
  );
}
