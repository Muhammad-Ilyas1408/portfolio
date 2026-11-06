import type { ChapterInput } from "./schema";

// Owner-provided in the M5 prompt. Every figure is self-reported; the report
// has no public URL, so the source is named but not linked.
export const chapter: ChapterInput = {
  // Owner-provided wording, so visitors need not know what "Chapter 2" means.
  title: "My presidency in numbers (2025–26)",
  intro:
    "Computing Students Society, University of Peshawar, during my term as President (Oct 2025 – Sep 2026).",
  source: {
    label: "CSS Progress Report 2025–26 (submitted Sep 2026)",
  },
  // Owner-provided: why the events table has 20 rows and the report 18.
  note: {
    before: "The ",
    link: { label: "All events and programmes", href: "#events" },
    after:
      " section below also includes the CSS AI Bootcamp 2025 (before my term) and TechRise '26 (after the report).",
  },
  stats: [
    {
      text: "18 events and programmes (11 online, 7 on campus)",
      // M8.5 B: stat splits; each value comes from the claim's own text.
      stat: {
        value: "18",
        label: "Events and programmes",
        detail: "11 online · 7 on campus",
      },
      status: "self-reported",
    },
    {
      text: "2,200+ total attendances (cumulative)",
      stat: {
        value: "2,200+",
        label: "Total attendances",
        detail: "Cumulative",
      },
      status: "self-reported",
    },
    {
      text: "14 guest speakers",
      stat: { value: "14", label: "Guest speakers" },
      status: "self-reported",
    },
    {
      text: "4 partner organizations: Supabase Peshawar, TechKhwa, SMIT and SheTech",
      stat: {
        value: "4",
        label: "Partner organizations",
        detail: "Supabase Peshawar, TechKhwa, SMIT and SheTech",
      },
      status: "self-reported",
    },
    {
      text: "~300 freshers reached through class-to-class visits",
      stat: {
        value: "~300",
        label: "Freshers reached",
        detail: "Through class-to-class visits",
      },
      status: "self-reported",
    },
  ],
};
