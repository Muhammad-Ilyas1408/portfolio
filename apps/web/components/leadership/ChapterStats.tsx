import type { Chapter } from "@/content/schema";

/** The chapter's self-reported figures, with their unlinked source. */
export function ChapterStats({ chapter }: { chapter: Chapter }) {
  return (
    <>
      {chapter.intro && (
        <p className="mb-6 max-w-[68ch] text-text-muted">{chapter.intro}</p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {chapter.stats.map((stat) => (
          <li
            key={stat.text}
            className="rounded-lg border border-border bg-surface p-4 text-sm"
          >
            <span
              className="mb-2 block h-0.5 w-6 bg-ember"
              aria-hidden="true"
            />
            {stat.text}
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-sm text-text-muted">
        Source: {chapter.source.label} · Self-reported
      </p>
      {chapter.note && (
        <p className="mt-1 text-sm text-text-muted">
          {chapter.note.before}
          <a
            href={chapter.note.link.href}
            className="rounded-sm text-ember underline underline-offset-4 transition-colors duration-150 hover:text-text"
          >
            {chapter.note.link.label}
          </a>
          {chapter.note.after}
        </p>
      )}
    </>
  );
}
