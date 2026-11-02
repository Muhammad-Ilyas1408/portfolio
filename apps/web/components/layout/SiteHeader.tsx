import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { cvHref } from "./nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-border">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-semibold">
          {profile.name}
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <DesktopNav />
          <Button href={cvHref} variant="outline" download prefetch={false}>
            Download CV
          </Button>
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}
