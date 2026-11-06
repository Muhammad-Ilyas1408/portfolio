import { FlowLines } from "@/components/motion/FlowLines";
import { AccentText } from "@/components/ui/AccentText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Home } from "@/content/schema";

/** The final CTA band, on a signal glow and the FlowLines band variant. */
export function ContactBand({
  contact,
  email,
}: {
  contact: Home["contact"];
  email: string;
}) {
  const address = email.replace(/^mailto:/, "");

  return (
    <section
      aria-labelledby="contact-heading"
      className="glow-signal relative isolate overflow-hidden border-t border-border py-20 md:py-28 lg:py-32"
    >
      <FlowLines variant="band" className="-z-10" />
      <Container className="flex flex-col items-center text-center">
        <Eyebrow>Contact</Eyebrow>
        <h2
          id="contact-heading"
          className="mt-6 max-w-[22ch] text-display-2 text-balance"
        >
          <AccentText
            text={contact.headline.text}
            phrase={contact.headline.accent}
          />
        </h2>
        <p className="mt-6 text-lg text-balance text-text-muted">
          {contact.line}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Button href="/contact" variant="filled" size="lg" prefetch={false}>
            Contact me
          </Button>
          <a
            href={email}
            className="inline-flex min-h-11 items-center rounded-md font-mono text-sm text-text underline underline-offset-4 transition-colors duration-150 hover:text-signal"
          >
            {address}
          </a>
        </div>
      </Container>
    </section>
  );
}
