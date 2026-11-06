import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import type { HomeStat } from "@/content/schema";

/** Big-numeral facts directly under the hero, between hairlines. */
export function StatsRow({ stats }: { stats: HomeStat[] }) {
  if (stats.length === 0) return null;

  return (
    <section
      aria-labelledby="highlights-heading"
      className="border-y border-border"
    >
      <h2 id="highlights-heading" className="sr-only">
        Highlights
      </h2>
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <li
              key={stat.label}
              className={`border-border py-8 md:py-12 ${
                index % 2 === 1 ? "border-l pl-5 sm:pl-8" : "pr-5 sm:pr-8"
              } ${index >= 2 ? "max-lg:border-t" : ""} lg:px-8 lg:first:pl-0 ${
                index > 0 ? "lg:border-l" : ""
              }`}
            >
              <Stat {...stat} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
