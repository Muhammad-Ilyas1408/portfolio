import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getFeaturedProjects, getProfile } from "@/content";

import { BrandMark } from "./BrandMark";
import { cvHref, navLinks } from "./nav";

const profile = getProfile();

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
  download?: boolean;
};

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Navigate",
    links: [{ href: "/", label: "Home" }, ...navLinks],
  },
  {
    title: "Work",
    links: getFeaturedProjects().map((project) => ({
      href: `/projects/${project.slug}`,
      label: project.title,
    })),
  },
  {
    title: "Community",
    links: [
      { href: "/leadership", label: "Leadership" },
      { href: "/credentials", label: "Credentials" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: profile.links.email, label: "Email" },
      { href: profile.links.linkedin, label: "LinkedIn", external: true },
      { href: profile.links.github, label: "GitHub", external: true },
      { href: cvHref, label: "Download CV", download: true },
    ],
  },
];

const linkClasses =
  "inline-flex min-h-8 items-center gap-1 rounded-sm text-sm text-text-muted transition-colors duration-150 hover:text-text";

function FooterAnchor({ href, label, external, download }: FooterLink) {
  let content: ReactNode = label;
  if (external) {
    content = (
      <>
        {label}
        <span aria-hidden="true" className="text-xs">
          ↗
        </span>
      </>
    );
  }
  // Internal pages go through next/link; mailto, external and file links don't.
  if (href.startsWith("/") && !download) {
    return (
      <Link
        href={href}
        prefetch={href === "/contact" ? false : undefined}
        className={linkClasses}
      >
        {content}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...(download && { download: true })}
      className={linkClasses}
    >
      {content}
    </a>
  );
}

// Captured in the static shell, so the year updates on each build.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <BrandMark name={profile.name} />
            <p className="mt-4 text-pretty text-text-muted">
              {profile.positioning}
            </p>
          </div>
          <Button
            href="/contact"
            variant="filled"
            prefetch={false}
            className="self-start md:self-auto"
          >
            Contact me
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 md:grid-cols-4">
          {columns
            .filter((column) => column.links.length > 0)
            .map((column) => (
              <nav key={column.title} aria-label={`Footer: ${column.title}`}>
                <p className="font-mono text-xs font-medium tracking-[0.16em] text-text uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <FooterAnchor {...link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p>
            Built with Next.js &amp; FastAPI ·{" "}
            <a
              href={profile.links.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors duration-150 hover:text-text"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
