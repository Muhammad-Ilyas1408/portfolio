import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { cvHref } from "@/components/layout/nav";
import { buttonClasses } from "@/components/ui/Button";
import { cardClasses } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getHomeContact, getProfile } from "@/content";
import { formatPhone } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

const profile = getProfile();
// The home contact band's headline and line; together they are the
// /contact intro used since M7.
const contact = getHomeContact();
const intro =
  "Building something with LLMs, or running a tech community? Send a message and I'll reply by email.";

export const metadata: Metadata = pageMetadata({
  title: `Contact · ${profile.name}`,
  // The page's own intro line, so the description is unique to /contact.
  description: intro,
  path: "/contact",
});

const linkClasses =
  "group/arrow inline-flex min-h-11 items-center gap-1.5 rounded-md font-semibold text-text underline-offset-4 transition-colors duration-150 hover:text-signal hover:underline";

function DirectLink({
  label,
  href,
  text,
  external = false,
  download = false,
  mono = false,
}: {
  label: string;
  href: string;
  text: string;
  external?: boolean;
  download?: boolean;
  mono?: boolean;
}) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <span className="block font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        {label}
      </span>
      <a
        href={href}
        download={download || undefined}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className={`${linkClasses} ${mono ? "font-mono text-sm font-medium break-all" : ""}`}
      >
        {text}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
        <span
          aria-hidden="true"
          className="inline-block text-signal transition-transform duration-150 group-hover/arrow:translate-x-0.5"
        >
          {external ? "↗" : download ? "↓" : "→"}
        </span>
      </a>
    </li>
  );
}

function WhatsAppLink({ href }: { href: string }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <span className="block font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        WhatsApp
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message on WhatsApp (opens in a new tab)"
        className={buttonClasses("outline", "group/arrow mt-2 w-full", "md")}
      >
        Message on WhatsApp
        <span
          aria-hidden="true"
          className="inline-block text-signal transition-transform duration-150 group-hover/arrow:translate-x-0.5"
        >
          ↗
        </span>
      </a>
    </li>
  );
}

export default function ContactPage() {
  const { links } = profile;
  const address = links.email.replace(/^mailto:/, "");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={contact.headline.text}
        accentPhrase={contact.headline.accent}
        intro={contact.line}
      />
      <Container className="py-14 md:py-20">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
          <div className={cardClasses({ className: "min-w-0 p-6 md:p-10" })}>
            <ContactForm email={links.email} />
          </div>

          <aside
            aria-labelledby="direct-heading"
            className={cardClasses({ className: "min-w-0 p-6 md:p-8" })}
          >
            <h2
              id="direct-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Direct links
            </h2>
            <ul className="mt-6 divide-y divide-border border-t border-border pt-4">
              <DirectLink
                label="Email"
                href={links.email}
                text={address}
                mono
              />
              {links.whatsapp && <WhatsAppLink href={links.whatsapp} />}
              {links.phone && (
                <DirectLink
                  label="Phone"
                  href={links.phone}
                  text={formatPhone(links.phone)}
                  mono
                />
              )}
              <DirectLink
                label="LinkedIn"
                href={links.linkedin}
                text="LinkedIn profile"
                external
              />
              <DirectLink
                label="GitHub"
                href={links.github}
                text="GitHub profile"
                external
              />
              <DirectLink
                label="CV"
                href={cvHref}
                text="Download CV"
                download
              />
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}
