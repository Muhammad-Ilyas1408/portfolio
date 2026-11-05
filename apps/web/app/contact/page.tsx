import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { cvHref } from "@/components/layout/nav";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/content";
import { pageMetadata } from "@/lib/seo";

const profile = getProfile();
const intro =
  "Building something with LLMs, or running a tech community? Send a message — I'll reply by email.";

export const metadata: Metadata = pageMetadata({
  title: `Contact · ${profile.name}`,
  // The page's own intro line, so the description is unique to /contact.
  description: intro,
  path: "/contact",
});

const linkClasses =
  "inline-flex min-h-11 items-center gap-1 rounded-md font-semibold text-signal underline-offset-4 transition-colors duration-150 hover:underline";

export default function ContactPage() {
  const { links } = profile;
  const address = links.email.replace(/^mailto:/, "");

  return (
    <Container>
      <PageHeader label="Contact" title="Contact">
        <p>{intro}</p>
      </PageHeader>

      <div className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <ContactForm email={links.email} />
        </div>

        <aside aria-labelledby="direct-heading" className="min-w-0">
          <h2 id="direct-heading" className="text-lg">
            Direct links
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface px-4">
            <li className="py-2">
              <span className="block font-mono text-sm text-text-muted">
                Email
              </span>
              <a href={links.email} className={`${linkClasses} break-all`}>
                {address}
              </a>
            </li>
            <li className="py-2">
              <span className="block font-mono text-sm text-text-muted">
                LinkedIn
              </span>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                LinkedIn profile
                <span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li className="py-2">
              <span className="block font-mono text-sm text-text-muted">
                GitHub
              </span>
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                GitHub profile
                <span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li className="py-2">
              <span className="block font-mono text-sm text-text-muted">
                CV
              </span>
              <a href={cvHref} download className={linkClasses}>
                Download CV
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}
