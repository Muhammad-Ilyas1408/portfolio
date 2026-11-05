import { initiativeId } from "@/content";
import type { Initiative } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

import { PhotoGrid } from "./PhotoGrid";

const formats: Record<Initiative["format"], string> = {
  online: "Online",
  "on-campus": "On campus",
};

const focuses: Record<Initiative["focus"], string> = {
  technical: "Technical",
  career: "Career",
  community: "Community",
};

/** Shown before a cell's value only when the table is stacked as cards. */
function CellLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-sm text-text-muted lg:hidden">
      {children}:{" "}
    </span>
  );
}

const cell =
  "max-lg:block lg:border-t lg:border-border lg:px-3 lg:py-4 lg:align-top";

/**
 * Every initiative, newest first. Below 1024px each row is stacked as a card.
 * Each row's id is its anchor, e.g. /leadership#techrise-26.
 */
export function EventsTable({ initiatives }: { initiatives: Initiative[] }) {
  if (initiatives.length === 0) return null;

  return (
    <table className="w-full border-collapse text-left text-sm max-lg:block">
      <caption className="mb-3 text-left font-mono text-sm text-text-muted max-lg:block">
        Newest first. All figures are self-reported.
      </caption>
      <thead className="max-lg:hidden">
        <tr className="font-mono text-text-muted">
          {["Date", "Event", "Format", "Focus", "Attendance", "My role"].map(
            (heading) => (
              <th key={heading} scope="col" className="px-3 pb-2 font-normal">
                {heading}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody className="max-lg:grid max-lg:gap-3">
        {initiatives.map((initiative) => (
          <tr
            key={initiativeId(initiative)}
            id={initiativeId(initiative)}
            className="scroll-mt-20 target:bg-ember-soft max-lg:grid max-lg:gap-1 max-lg:rounded-lg max-lg:border max-lg:border-border max-lg:bg-surface max-lg:p-4"
          >
            <td className={`${cell} font-mono whitespace-nowrap text-ember`}>
              {formatEventRange(initiative.start, initiative.end)}
            </td>
            <th scope="row" className={`${cell} font-normal lg:min-w-56`}>
              <span className="text-base font-semibold">{initiative.name}</span>
              {initiative.summary && (
                <span className="mt-1 block text-text-muted">
                  {initiative.summary}
                </span>
              )}
              {initiative.photos.length > 0 && (
                <details className="mt-2">
                  <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-md font-semibold text-ember">
                    Photos ({initiative.photos.length})
                  </summary>
                  <div className="mt-2 max-w-xl">
                    <PhotoGrid
                      photos={initiative.photos}
                      columns="grid-cols-2"
                      sizes="(min-width: 1024px) 288px, 50vw"
                    />
                  </div>
                </details>
              )}
            </th>
            <td className={cell}>
              <CellLabel>Format</CellLabel>
              {formats[initiative.format]}
            </td>
            <td className={cell}>
              <CellLabel>Focus</CellLabel>
              {focuses[initiative.focus]}
            </td>
            <td className={cell}>
              <CellLabel>Attendance</CellLabel>
              {initiative.stats.map((stat) => stat.text).join("; ")}
            </td>
            <td className={cell}>
              <CellLabel>My role</CellLabel>
              {initiative.myRole}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
