import type { Explainer, Role } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

/** The full internship card on /experience, with the DP-SGD explainer. */
export function InternshipCard({
  role,
  explainer,
}: {
  role: Role;
  explainer?: Explainer;
}) {
  return (
    <article
      aria-labelledby="internship-heading"
      className="rounded-lg border border-border bg-surface p-6 md:p-8"
    >
      <h3 id="internship-heading">{role.title}</h3>
      <p className="mt-1">{role.org}</p>
      <p className="mt-1 font-mono text-sm text-text-muted">
        {formatMonthRange(role.start, role.end)}
      </p>
      {role.summary && <p className="mt-4 max-w-[68ch]">{role.summary}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)]">
        {role.myContributions.length > 0 && (
          <div>
            <h4 className="font-mono text-sm text-signal">What I did</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-signal">
              {role.myContributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {explainer && (
          <aside
            aria-labelledby="explainer-heading"
            className="self-start rounded-lg border border-signal/40 bg-signal-soft p-5"
          >
            <h4
              id="explainer-heading"
              className="font-mono text-sm text-signal"
            >
              {explainer.title}
            </h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm marker:font-mono marker:text-signal">
              {explainer.sentences.map((sentence) => (
                <li key={sentence}>{sentence}</li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </article>
  );
}
