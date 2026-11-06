import { cardClasses } from "@/components/ui/Card";
import type { Explainer, Role } from "@/content/schema";

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
      className={cardClasses({ className: "p-6 md:p-8" })}
    >
      <h3
        id="internship-heading"
        className="font-display text-display-3 font-bold text-balance"
      >
        {role.title}
      </h3>
      <p className="mt-2 text-lg text-text-muted">{role.org}</p>
      {role.summary && (
        <p className="mt-5 max-w-[68ch] text-text/90">{role.summary}</p>
      )}
      <div className="mt-8 grid gap-8 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {role.myContributions.length > 0 && (
          <div>
            <h4 className="font-mono text-xs font-medium tracking-[0.16em] text-signal uppercase">
              What I did
            </h4>
            <ul className="mt-4 grid gap-3">
              {role.myContributions.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-signal"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {explainer && (
          <aside
            aria-labelledby="explainer-heading"
            className="self-start rounded-lg border border-signal/30 bg-signal-soft p-5 md:p-6"
          >
            <h4
              id="explainer-heading"
              className="font-mono text-xs font-medium tracking-[0.16em] text-signal uppercase"
            >
              {explainer.title}
            </h4>
            <ol className="mt-4 grid gap-3 text-sm">
              {explainer.sentences.map((sentence, index) => (
                <li key={sentence} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs leading-[1.6rem] text-signal"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{sentence}</span>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </article>
  );
}
