import type { InitiativeInput } from "./schema";

export const initiatives: InitiativeInput[] = [
  {
    name: "TechRise '26",
    date: "2026-10",
    // TODO: role during the October event, after the term ended (open item 2).
    myRole: "Led planning as CSS President",
    // TODO: scale, venue, photos and the official post link (open item 2).
    summary: "Planned Aug–Sep 2026 under the CSS presidency; held Oct 2026.",
    published: false,
  },
  {
    name: "Summer Bootcamp 2026",
    // TODO: exact date, topic taught and number of sessions (open item 4).
    myRole: "Instructor",
    // TODO: source of the 70+ figure (open item 4).
    scale: { text: "70+ participants", status: "self-reported" },
    summary: "CSS bootcamp, summer 2026.",
    published: false,
  },
];
