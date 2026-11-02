import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: `Page not found — ${profile.name}`,
};

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
