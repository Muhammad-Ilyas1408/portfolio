import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/content";

import { BrandMark } from "./BrandMark";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  const profile = getProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <BrandMark name={profile.name} />
        <div className="hidden items-center gap-3 lg:flex">
          <DesktopNav />
          {/* Not prefetched: prefetching /contact loads the form's JS
              (react-hook-form, zod) during start-up on every page (M8). */}
          <Button href="/contact" variant="filled" prefetch={false}>
            Contact
          </Button>
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}
