import Image from "next/image";

import type { CaseStudy, Project } from "@/content/schema";

/**
 * The visual at the top of a case-study card: the project's screenshot when
 * one exists, else its first architecture steps drawn as connected nodes over
 * a faint grid, with the stack as tiny mono labels. The generated cover is
 * decorative: the card's title and text carry the meaning.
 */
export function ProjectCover({
  project,
  steps,
  index,
  className = "",
}: {
  project: Project;
  steps: CaseStudy["architecture"]["steps"];
  index: number;
  className?: string;
}) {
  if (project.cover) {
    return (
      <div
        className={`relative overflow-hidden bg-surface-raised ${className}`}
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const shown = steps.slice(0, 4);
  const stack = project.stack.slice(0, 6);

  return (
    <div
      aria-hidden="true"
      className={`cover-surface relative flex flex-col justify-between gap-8 overflow-hidden p-6 sm:p-8 md:p-10 ${className}`}
    >
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        <span>Architecture</span>
        <span className="text-signal">{String(index).padStart(2, "0")}</span>
      </div>

      {shown.length > 0 && (
        <ol className="mx-auto flex w-full max-w-xs flex-col items-stretch">
          {shown.map((step, i) => {
            const last = i === shown.length - 1;
            return (
              <li key={step.id} className="flex flex-col items-center">
                <div
                  className={`edge-highlight flex w-full items-center gap-3 rounded-lg border bg-bg/90 px-3 py-2.5 ${
                    last ? "border-signal/60" : "border-border"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs ${
                      last
                        ? "border-signal/60 bg-signal-soft text-signal"
                        : "border-border text-signal"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-sm text-text">
                    {step.label}
                  </span>
                </div>
                {!last && (
                  // Hairline connector with a small node dot.
                  <span className="relative h-6 w-px bg-border">
                    <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/70" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {stack.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] tracking-wider text-text-muted uppercase">
          {stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
