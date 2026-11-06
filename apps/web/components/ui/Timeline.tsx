import type { ReactNode } from "react";

import type { Accent } from "./Eyebrow";

export type TimelineItem = {
  key: string;
  /** Optional anchor on the item. */
  id?: string;
  /** The mono date shown left of the spine (above the card on phones). */
  date: string;
  /** Filled dot for the current or newest item. */
  current?: boolean;
  children: ReactNode;
};

const dotClasses: Record<Accent, { filled: string; hollow: string }> = {
  signal: {
    filled: "border-signal bg-signal",
    hollow: "border-signal bg-bg",
  },
  ember: {
    filled: "border-ember bg-ember",
    hollow: "border-ember bg-bg",
  },
};

const dateClasses: Record<Accent, string> = {
  signal: "text-signal",
  ember: "text-ember",
};

/**
 * A static vertical timeline: mono dates on the left (desktop), a hairline
 * spine with a dot per item, and the item's content (usually a Card) on the
 * right. On phones the date sits above each card and the spine runs down the
 * left edge.
 */
export function Timeline({
  items,
  accent = "signal",
  label,
}: {
  items: TimelineItem[];
  accent?: Accent;
  /** The list's accessible name, e.g. "Leadership roles, newest first". */
  label?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ol aria-label={label} className="grid">
      {items.map((item, index) => {
        const first = index === 0;
        const last = index === items.length - 1;
        return (
          <li
            key={item.key}
            id={item.id}
            className="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6 lg:grid-cols-[11.5rem_1rem_minmax(0,1fr)] lg:gap-x-8"
          >
            <p
              className={`col-start-2 row-start-1 pb-3 font-mono text-xs font-medium tracking-[0.12em] uppercase lg:col-start-1 lg:pt-7 lg:pb-0 lg:text-right lg:whitespace-nowrap ${dateClasses[accent]}`}
            >
              {item.date}
            </p>
            <div
              aria-hidden="true"
              className="relative col-start-1 row-span-2 row-start-1 lg:col-start-2 lg:row-span-1"
            >
              {items.length > 1 && (
                <span
                  className={`absolute left-1/2 w-px -translate-x-1/2 bg-border ${
                    first ? "top-1.5 lg:top-8" : "top-0"
                  } ${last ? "h-1.5 lg:h-8" : "bottom-0"}`}
                />
              )}
              <span
                className={`absolute top-0.5 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 lg:top-[1.6rem] ${
                  item.current
                    ? dotClasses[accent].filled
                    : dotClasses[accent].hollow
                }`}
              />
            </div>
            <div
              className={`col-start-2 row-start-2 min-w-0 lg:col-start-3 lg:row-start-1 ${
                last ? "" : "pb-8 lg:pb-10"
              }`}
            >
              {item.children}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
