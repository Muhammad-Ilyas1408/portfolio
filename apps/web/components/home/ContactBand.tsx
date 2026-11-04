import { Button } from "@/components/ui/Button";

export function ContactBand({ email }: { email: string }) {
  return (
    <section
      aria-labelledby="contact-heading"
      className="my-12 rounded-lg border border-border bg-surface px-6 py-10 md:my-16 md:px-10"
    >
      <h2 id="contact-heading" className="max-w-[28ch]">
        Building something with LLMs, or running a tech community? Let&apos;s
        talk.
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={email} variant="filled" prefetch={false}>
          Email me
        </Button>
        <Button href="/contact" variant="outline">
          Contact form
        </Button>
      </div>
    </section>
  );
}
