import { StatGrid } from "@/components/ui/StatGrid";
import type { Chapter } from "@/content/schema";

/** The presidency figures as an ember stat grid, with their unlinked source. */
export function ChapterStats({ chapter }: { chapter: Chapter }) {
  return (
    <>
      <StatGrid
        claims={chapter.stats}
        accent="ember"
        columns={5}
        groupNote
        label={chapter.title}
      />
      <div className="mt-5 grid gap-1.5">
        <p className="font-mono text-xs tracking-wide text-text-muted">
          Source: {chapter.source.label} · Self-reported
        </p>
        {chapter.note && (
          <p className="text-sm text-text-muted">
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
      </div>
    </>
  );
}
