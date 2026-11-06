import { buttonClasses } from "@/components/ui/Button";
import { initiativeId } from "@/content";
import type { Initiative } from "@/content/schema";
import { formatEventRange } from "@/lib/format";

import { OpenTargetDetails } from "./OpenTargetDetails";
import { PhotoGrid } from "./PhotoGrid";

/** Rows shown before the "Show all" disclosure. */
export const visibleEvents = 8;

const formats: Record<Initiative["format"], string> = {
  online: "Online",
  "on-campus": "On campus",
};

const focuses: Record<Initiative["focus"], string> = {
  technical: "Technical",
  career: "Career",
  community: "Community",
};

const headings = ["Date", "Event", "Format", "Focus", "Attendance", "My role"];

/** Shown before a cell's value only when the table is stacked as cards. */
function CellLabel({ children }: { children: string }) {
  return (
    <span className="font-mono text-xs tracking-wide text-text-muted lg:hidden">
      {children}:{" "}
    </span>
  );
}

const cell =
  "max-lg:block lg:border-t lg:border-border lg:px-4 lg:py-5 lg:align-top lg:first:pl-0";

function EventRow({ initiative }: { initiative: Initiative }) {
  return (
    <tr
      id={initiativeId(initiative)}
      className="scroll-mt-24 target:bg-ember-soft max-lg:grid max-lg:gap-1.5 max-lg:border-t max-lg:border-border max-lg:py-5"
    >
      <td
        className={`${cell} font-mono text-xs tracking-wide whitespace-nowrap text-ember lg:pt-6`}
      >
        {formatEventRange(initiative.start, initiative.end)}
      </td>
      <th scope="row" className={`${cell} font-normal lg:w-[38%]`}>
        <span className="text-base font-semibold text-text">
          {initiative.name}
        </span>
        {initiative.summary && (
          <span className="mt-1 block max-w-[60ch] text-text-muted">
            {initiative.summary}
          </span>
        )}
        {initiative.photos.length > 0 && (
          <details className="mt-2">
            <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-md font-mono text-xs font-medium tracking-wide text-ember uppercase">
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
      <td className={`${cell} lg:whitespace-nowrap`}>
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
  );
}

function Table({
  caption,
  captionClassName,
  initiatives,
}: {
  caption: string;
  captionClassName: string;
  initiatives: Initiative[];
}) {
  return (
    <table className="w-full border-collapse text-left text-sm max-lg:block lg:border-b lg:border-border">
      <caption className={captionClassName}>{caption}</caption>
      <thead className="max-lg:hidden">
        <tr className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
          {headings.map((heading) => (
            <th
              key={heading}
              scope="col"
              className="px-4 pb-3 font-normal first:pl-0"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="max-lg:grid max-lg:border-b max-lg:border-border">
        {initiatives.map((initiative) => (
          <EventRow key={initiativeId(initiative)} initiative={initiative} />
        ))}
      </tbody>
    </table>
  );
}

/**
 * Every initiative, newest first: the 8 newest, then the rest inside a
 * native <details> ("Show all N events"). Below 1024px each row is stacked
 * as a card. Each row's id is its anchor, e.g. /leadership#techrise-26; a
 * hash pointing into the closed disclosure opens it (OpenTargetDetails).
 */
export function EventsTable({ initiatives }: { initiatives: Initiative[] }) {
  if (initiatives.length === 0) return null;
  const shown = initiatives.slice(0, visibleEvents);
  const rest = initiatives.slice(visibleEvents);

  return (
    <div>
      <Table
        caption="Newest first. All figures are self-reported."
        captionClassName="mb-5 text-left font-mono text-xs tracking-wide text-text-muted max-lg:block"
        initiatives={shown}
      />
      {rest.length > 0 && (
        <details id="all-events" className="group/all mt-6">
          <summary
            className={buttonClasses(
              "outline",
              "cursor-pointer list-none [&::-webkit-details-marker]:hidden",
            )}
          >
            Show all {initiatives.length} events
            {/* A CSS chevron, so the summary's text stays "Show all N events". */}
            <span
              aria-hidden="true"
              className="mb-1 size-2 rotate-45 border-r-2 border-b-2 border-ember transition-transform duration-150 group-open/all:mt-1.5 group-open/all:mb-0 group-open/all:rotate-[225deg]"
            />
          </summary>
          <div className="mt-6">
            <Table
              caption="Earlier events, newest first."
              captionClassName="sr-only"
              initiatives={rest}
            />
          </div>
        </details>
      )}
      <OpenTargetDetails />
    </div>
  );
}
