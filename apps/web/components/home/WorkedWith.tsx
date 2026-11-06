import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Organizations where the owner held a role, as plain text wordmarks between hairlines. */
export function WorkedWith({ orgs }: { orgs: string[] }) {
  if (orgs.length === 0) return null;

  return (
    <section
      aria-labelledby="worked-with-heading"
      className="border-b border-border py-12 md:py-14"
    >
      <Container>
        <Eyebrow as="h2" id="worked-with-heading">
          Where I&apos;ve worked and led
        </Eyebrow>
        {/* gap-px over a border-colored list draws the hairlines between cells. */}
        <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
          {orgs.map((org, index) => (
            <li
              key={org}
              className={`flex min-h-24 items-center justify-center bg-bg px-4 py-5 text-center font-display text-base leading-snug font-semibold tracking-tight text-text-muted md:text-lg ${
                // An odd last cell spans the row on phones.
                index === orgs.length - 1 && orgs.length % 2 === 1
                  ? "max-md:col-span-2"
                  : ""
              }`}
            >
              {org}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
