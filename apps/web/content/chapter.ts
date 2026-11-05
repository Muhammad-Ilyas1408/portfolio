import type { ChapterInput } from "./schema";

// Owner-provided in the M5 prompt. Every figure is self-reported; the report
// has no public URL, so the source is named but not linked.
export const chapter: ChapterInput = {
  title: "CSS Chapter 2 (2025–26) in numbers",
  source: {
    label: "CSS Chapter 2 Progress Report 2025–26 (submitted Sep 2026)",
  },
  stats: [
    {
      text: "18 events and programmes (11 online, 7 on campus)",
      status: "self-reported",
    },
    { text: "2,200+ total attendances (cumulative)", status: "self-reported" },
    { text: "14 guest speakers", status: "self-reported" },
    {
      text: "4 partner organizations: Supabase Peshawar, TechKhwa, SMIT and SheTech",
      status: "self-reported",
    },
    {
      text: "~300 freshers reached through class-to-class visits",
      status: "self-reported",
    },
  ],
};
