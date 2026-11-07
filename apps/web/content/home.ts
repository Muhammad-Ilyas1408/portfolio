import { floodAwareChangelog, storyWeaveDevpost } from "./projects";
import { css, gdg, gdsc } from "./roles";
import type { HomeInput } from "./schema";

// Owner-provided in the M3 prompt.
export const home: HomeInput = {
  proof: [
    {
      text: "Flood-Aware — live, 348 backend tests passing",
      status: "verified",
      evidence: {
        kind: "changelog",
        label: "Changelog",
        url: floodAwareChangelog,
      },
    },
    {
      text: "HackVortex Codestorm 5 — 1st place",
      status: "verified",
      evidence: {
        kind: "devpost",
        label: "Devpost project page",
        url: storyWeaveDevpost,
      },
    },
    {
      text: "President, Computing Students Society 2025–26",
      status: "self-reported",
    },
    {
      text: "AI/ML Engineering Intern — LLM fine-tuning and DP-SGD",
      status: "self-reported",
    },
  ],
  // Owner's own words (M8.6 prompt); the copy pass must not rewrite them.
  hero: {
    greeting: "Hello, I'm",
    tagline: ["Engineering Intelligent Systems,", "Creating Real-World Impact"],
  },
  // M8.5 stats row (owner-chosen in the follow-up). Text stats are split
  // out of existing claims (`from` is the exact source text); counted stats
  // must equal a count of published content (checked in content/index.ts).
  // 348 tests and 7 evidence tools stay on the Flood-Aware case study.
  stats: [
    {
      value: "2",
      label: "Live AI projects",
      detail: "Flood-Aware · StoryWeave",
      href: "/projects",
      accent: "signal",
      count: "live-projects",
    },
    {
      value: "1st",
      label: "Place at HackVortex Codestorm 5",
      detail: "StoryWeave, team of 4",
      href: "/projects/storyweave",
      accent: "signal",
      from: "HackVortex Codestorm 5 — 1st place",
      status: "verified",
      evidence: {
        kind: "devpost",
        label: "Devpost project page",
        url: storyWeaveDevpost,
      },
    },
    {
      value: "3",
      label: "Coursera specializations",
      detail: "DeepLearning.AI · IBM",
      href: "/credentials#specializations",
      accent: "signal",
      count: "specializations",
    },
    {
      value: "2025–26",
      label: "President, Computing Students Society",
      detail: "University of Peshawar",
      href: "/leadership",
      accent: "ember",
      from: "President, Computing Students Society 2025–26",
      status: "self-reported",
    },
  ],
  // Owner-provided in the M8.5 prompt; `projects` are slugs.
  capabilities: [
    {
      title: "LLM & agentic systems",
      line: "LangGraph agents with tool use, severity routing and citation validation.",
      projects: ["flood-aware"],
    },
    {
      title: "RAG & retrieval",
      line: "ChromaDB pipelines over domain documents with relevance thresholds.",
      projects: ["flood-aware"],
    },
    {
      title: "Geospatial & data pipelines",
      line: "GeoPandas and Rasterio pipelines with regional extraction and caching.",
      projects: ["flood-aware"],
    },
    {
      title: "Full-stack AI products",
      line: "Next.js front ends, FastAPI back ends, Docker and cloud deployment.",
      projects: ["flood-aware", "storyweave"],
    },
  ],
  leadership: {
    // The /leadership intro line.
    headline: {
      text: "From a GDSC team member to leading the Computing Students Society.",
      accent: "leading the Computing Students Society.",
    },
    // All self-reported, split out of chapter, role and initiative claims.
    stats: [
      {
        value: "18",
        label: "Events and programmes",
        detail: "11 online · 7 on campus",
        href: "/leadership#chapter",
        accent: "ember",
        from: "18 events and programmes (11 online, 7 on campus)",
        status: "self-reported",
      },
      {
        value: "~40",
        label: "Students on the team I led",
        detail: "CSS, 2025–26",
        href: "/leadership#progression",
        accent: "ember",
        from: "Led a team of about 40 students",
        status: "self-reported",
      },
      {
        value: "300+",
        label: "TechRise '26 attendees",
        detail: "9 speakers · 22 Oct 2026",
        href: "/leadership#featured",
        accent: "ember",
        from: "300+ attendees",
        status: "self-reported",
      },
      {
        value: "70+",
        label: "Summer Bootcamp students",
        detail: "CSS Summer Bootcamp 2026, 3 tracks",
        href: "/leadership#featured",
        accent: "ember",
        from: "70+ students across 3 tracks (AI & Data Science, Web Development, Cyber Security)",
        status: "self-reported",
      },
    ],
    photo: { initiative: "TechRise '26", index: 1 },
  },
  // The most significant award photos; not the participation certificate.
  recognition: [
    "Award of Appreciation — President, CSS Chapter 2025–26",
    "Certificate of Recognition — President, CSS (2025–26)",
    "Appreciation Award — Connected Pakistan Conference 2024 (CPC 2024)",
    "Certificate of Recognition — AI & DS Club Lead, CSS (2024–25)",
  ],
  // The existing contact band wording, and the end of the /contact intro.
  contact: {
    headline: {
      text: "Building something with LLMs, or running a tech community? Let's talk.",
      accent: "Let's talk.",
    },
    line: "Send a message and I'll reply by email.",
  },
  // Shown oldest to newest.
  leadershipPath: [
    { org: gdsc, title: "AI/ML Team Member" },
    { org: gdg, title: "Executive Team Member" },
    { org: css, title: "AI/DS Club Lead" },
    { org: css, title: "President" },
  ],
};
