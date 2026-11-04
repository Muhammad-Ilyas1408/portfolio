import type { ProjectInput } from "./schema";

export const floodAwareChangelog =
  "https://github.com/Muhammad-Ilyas1408/flood-aware/blob/main/docs/CHANGELOG.md";
export const storyWeaveDevpost = "https://devpost.com/software/story-weave";

export const projects: ProjectInput[] = [
  {
    slug: "flood-aware",
    title: "Flood-Aware",
    summary: "Grounded flood decision-support system for the Swat River Basin.",
    role: "BS CS Final Year Project (team of 2)",
    // Abdullah's role was not given, so it stays empty.
    team: [{ name: "Muhammad Ilyas" }, { name: "Abdullah Ahmad" }],
    supervisor: "Dr. Asim Jalal",
    // Self-reported by the owner.
    period: { start: "2026-06", end: "2026-08" },
    status: "live",
    tags: ["agentic-rag", "full-stack"],
    stack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "LangGraph",
      "LangChain",
      "ChromaDB",
      "OpenAI API",
      "GeoPandas",
      "Rasterio",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Railway",
      "Vercel",
    ],
    // Self-reported by the owner: the owner's own work only.
    myContributions: [
      "Designed and built the LangGraph decision agent with severity-based tool routing and citation validation",
      "Built the GIS analysis pipeline (GeoPandas, Rasterio) for population and infrastructure exposure, including regional data extraction and in-memory caching",
      "Built the ChromaDB RAG pipeline over PDMA/NDMP disaster-management documents with relevance-thresholded retrieval",
      "Built the Next.js production frontend: Flood Guide, Policy Advisor and Situation Room",
      "Deployed the FastAPI backend to Railway and the frontend to Vercel, including production CORS hardening",
      "Wrote the backend test suite and the real-API golden-set evaluation",
    ],
    teamOutcomes: ["Complete and deployed"],
    results: [
      // Highlighted results show on the home card, in this order.
      {
        text: "348 backend tests passing (53 skipped) in the latest recorded run",
        status: "verified",
        highlight: true,
        evidence: {
          kind: "changelog",
          label: "Changelog",
          url: floodAwareChangelog,
        },
      },
      {
        text: "Production GIS warm-up takes about 2 s on Railway",
        status: "verified",
        highlight: true,
        evidence: {
          kind: "changelog",
          label: "Changelog, Sprint 16.1",
          url: floodAwareChangelog,
        },
      },
      {
        text: "7 evidence tools",
        status: "verified",
        highlight: true,
        evidence: {
          kind: "changelog",
          label: "Changelog",
          url: floodAwareChangelog,
        },
      },
      {
        text: "150 villages and 51 shelters",
        status: "verified",
        evidence: {
          kind: "changelog",
          label: "Changelog",
          url: floodAwareChangelog,
        },
      },
      {
        text: "Golden-set evaluation with real API calls",
        status: "verified",
        evidence: {
          kind: "repo",
          label: "README",
          url: "https://github.com/Muhammad-Ilyas1408/flood-aware",
        },
      },
      {
        text: "Per-request GIS collection went from about 90 s–4 min to about 30 s, by caching the parsed data at startup",
        status: "verified",
        evidence: {
          kind: "changelog",
          label: "Changelog, Sprint 14.1.5",
          url: floodAwareChangelog,
        },
      },
      {
        text: "Regional data extraction shrank the OSM file from 147.2 MiB to 4.2 MiB and the WorldPop raster from 134.9 MiB to 2.0 MiB; local startup dropped from 5–6 min to 39 s, with analysis results bit-for-bit identical",
        status: "verified",
        evidence: {
          kind: "changelog",
          label: "Changelog, Hotfix 14.4",
          url: floodAwareChangelog,
        },
      },
    ],
    links: [
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/Muhammad-Ilyas1408/flood-aware",
      },
      { kind: "live", label: "Live", url: "https://flood-aware.vercel.app" },
      { kind: "changelog", label: "Changelog", url: floodAwareChangelog },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "storyweave",
    title: "StoryWeave",
    // Describes the project per its README, not the owner's personal work.
    summary:
      "Multimodal wellness-story generator: a six-stage LangGraph pipeline turns a single prompt into a personalized, narrated story with background music (Gemini, ElevenLabs, FFmpeg).",
    role: "Full-Stack Developer — Docker, deployment, infrastructure (team of 4)",
    team: [
      { name: "Muhammad Jawad", role: "AI Engineer" },
      { name: "Hamad Khan", role: "AI Engineer" },
      { name: "Ali Ahmad", role: "Full-Stack Developer" },
      { name: "Muhammad Ilyas", role: "Full-Stack Developer" },
    ],
    // Self-reported by the owner: HackVortex Codestorm 5 ran 8–17 October 2025.
    period: { start: "2025-10", end: "2025-10" },
    status: "complete",
    tags: ["agentic-rag", "full-stack"],
    stack: [
      "LangGraph",
      "Gemini",
      "ElevenLabs",
      "FFmpeg",
      "Docker",
      "DigitalOcean",
    ],
    // Follows the repo README; confirmed by the owner.
    myContributions: ["Docker containerization, deployment and infrastructure"],
    results: [
      {
        text: "1st place, HackVortex Codestorm 5",
        status: "verified",
        evidence: { kind: "devpost", label: "Devpost", url: storyWeaveDevpost },
      },
    ],
    links: [
      {
        kind: "repo",
        label: "Repo",
        url: "https://github.com/JawadGigyani/StoryWeave",
      },
      { kind: "devpost", label: "Devpost", url: storyWeaveDevpost },
      {
        kind: "live",
        label: "Live",
        url: "https://story-weave-pi.vercel.app",
      },
    ],
    featured: true,
    order: 2,
  },
];
