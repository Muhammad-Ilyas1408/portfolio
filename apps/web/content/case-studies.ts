import type { CaseStudyInput } from "./schema";
import { floodAwareChangelog } from "./projects";

const floodAwareRepo = "https://github.com/Muhammad-Ilyas1408/flood-aware";

// Sources: the public Flood-Aware README and docs/CHANGELOG.md, and the
// StoryWeave README. Each decision and hard problem names its source in its
// evidence label; the comment above it names any second source it draws on.
export const caseStudies: CaseStudyInput[] = [
  {
    slug: "flood-aware",
    // README: "Why This Is Different From a Generic AI Chatbot".
    problem:
      "Most LLM tools answer confidently whether or not they have the evidence, and in disaster response a system that invents shelter capacity or flood-zone specifics is a safety risk.",
    // README: "Overview" and "System Architecture".
    approach:
      "A LangGraph decision agent routes by flood severity to real evidence tools (weather, GloFAS forecasts, GIS exposure, village and shelter records, PDMA/NDMP documents) and checks every citation against that evidence.",
    // README: "Project Status".
    outcome:
      "Complete and deployed on Railway and Vercel, tested with unit, integration and real-API golden-set evaluation.",
    // README: "System Architecture" (the Mermaid diagram), in its order and names.
    architecture: {
      steps: [
        {
          id: "frontend",
          label: "Next.js Frontend",
          description:
            "The production web app on Vercel: Flood Guide, Policy Advisor and Situation Room.",
        },
        {
          id: "backend",
          label: "FastAPI Backend",
          description: "The API on Railway that receives each request.",
        },
        {
          id: "decision-agent",
          label: "LangGraph Decision Agent",
          description:
            "Severity-based routing: evidence sources run only when relevant to the assessed flood severity.",
        },
        {
          id: "evidence-tools",
          label: "Evidence tools",
          description:
            "Weather Tool (OpenWeatherMap), Forecast Tool (GloFAS / Copernicus), GIS Analysis (rasterio, geopandas) and the RAG Knowledge Tool (ChromaDB).",
        },
        {
          id: "aggregation",
          label: "Evidence Aggregation + Grounding Validation",
          description:
            "Combines the evidence; every citation is checked against this evidence bundle, and hallucinated citations are rejected.",
        },
        {
          id: "records",
          label: "Village / Shelter / Dataset Tools",
          description:
            "Checked-in village and shelter records and dataset provenance.",
        },
        {
          id: "openai-agent",
          label: "OpenAI Decision Agent",
          description: "Structured, schema-validated output.",
        },
        {
          id: "recommendation",
          label: "Grounded Recommendation",
          description: "Citations, missing evidence and confidence.",
        },
      ],
    },
    decisions: [
      // Trade-off: CHANGELOG Sprint 14.1.4 (Notes), confirming Sprint 12.1.
      {
        decision:
          "Route evidence tools by forecast severity, deterministically",
        why: "The agent's seven evidence sources are invoked only when they are relevant to the assessed flood severity.",
        tradeoff:
          "A user's question cannot itself trigger GIS, village or shelter collection when the computed severity would not; the changelog records this as deferred future work.",
        evidence: {
          kind: "repo",
          label: "README: Grounded Multi-Tool Reasoning",
          url: `${floodAwareRepo}#grounded-multi-tool-reasoning`,
        },
      },
      // Why: README "Why This Is Different From a Generic AI Chatbot".
      {
        decision:
          "Validate every citation against the evidence bundle and reject unsupported ones",
        why: "For a disaster-response tool, a system that invents shelter capacity or flood-zone specifics is worse than one that admits it doesn't know.",
        tradeoff:
          "Strict checking caused false-positive rejections when absent evidence categories were mistaken for citable references, which needed clearer prompt instructions; a rejected decision is retried within the existing retry budget.",
        evidence: {
          kind: "changelog",
          label: "Sprint 11.1",
          url: floodAwareChangelog,
        },
      },
      {
        decision:
          "Cite policy passages only when they clear a relevance threshold",
        why: "Without a floor, retrieval always returned the raw top 5 matches, and live testing cited a repeated PDF title page as government policy guidance.",
        tradeoff:
          'When nothing clears the empirically derived threshold, the user gets an honest "no sufficiently relevant guidance found" result instead of an answer.',
        evidence: {
          kind: "changelog",
          label: "Sprint 14.2.3",
          url: floodAwareChangelog,
        },
      },
      {
        decision:
          "Parse the GIS data once at startup, then cut it down to the Swat region",
        why: "GDAL's OSM driver has no persistent spatial index, so every fresh-evidence turn re-parsed the whole dataset: about 90 s to 4 min of GIS collection per request.",
        tradeoff:
          "Startup took on the one-time parse (5–6 min locally) until regional extracts cut it to 39 s; the extracts are extra files kept beside the Pakistan-wide originals and were checked against them for identical results.",
        evidence: {
          kind: "changelog",
          label: "Sprint 14.1.5 and Hotfix 14.4",
          url: floodAwareChangelog,
        },
      },
      // Why: CHANGELOG Hotfix 20 (Notes).
      {
        decision:
          "Evaluate the decision agent on a golden set with real OpenAI calls",
        why: "Mocked and real-API checks catch different bugs: three prompt regressions were caught only by real-API reruns, and the evidence-reuse regression only by live testing.",
        tradeoff:
          "Real calls cost money, so the suite runs only when RUN_GOLDEN_SET=1 is set, and LLM wording variance required structural, keyword-tolerant assertions instead of exact matches.",
        evidence: {
          kind: "changelog",
          label: "Sprint 11.2 and Hotfix 20",
          url: floodAwareChangelog,
        },
      },
    ],
    hardProblems: [
      {
        title: "Evidence-reuse regression",
        symptom:
          "Right after a capability or clarification turn, a genuine follow-up produced a decision starved of evidence: missing evidence named every category and citations were empty, although a village stayed selected.",
        rootCause:
          "requires_new_evidence() only checks whether the location changed between turns. The new capability and clarification outcomes recorded turns with an unchanged location but an empty evidence bundle, so the next turn reused that empty evidence.",
        fix: "In the orchestrator's _turn_request(), a turn with an empty evidence bundle now counts as no previous turn, forcing a fresh graph run. The broken two-turn sequence then produced fresh forecast and weather evidence in 5 of 5 live reruns.",
        evidence: {
          kind: "changelog",
          label: "Hotfix 20",
          url: floodAwareChangelog,
        },
      },
      // Found and deferred in Hotfix 20 (Known Issues); fixed in Hotfix 21.
      {
        title: "Missing forecast-discharge mapping",
        symptom:
          "The forecast discharge figure, with its severity, source and date, was empty on every real request for every village, and the system never reported the forecast as missing.",
        rootCause:
          "ForecastNode copied only the snapshot-staleness fields onto the evidence the decision layer reads. Because those fields were always set, the absence check (exact equality with an empty forecast) never fired.",
        fix: "ForecastNode now maps the peak-discharge point (the same point used to classify severity) with its severity, source, forecast date and lead time in one atomic update, and a dedicated check tests each factual field for absence. Return period stays empty, because no return-period data exists.",
        evidence: {
          kind: "changelog",
          label: "Hotfix 21",
          url: floodAwareChangelog,
        },
      },
      {
        title: "Shelter-proximity matching",
        symptom:
          'A question about Mingora returned "shelter data is currently unavailable", although Government Degree College Mingora is in the checked-in shelter data.',
        rootCause:
          "No shelter-matching step existed: the tool returned every shelter's bare name with no distance signal, so the model correctly declined to cite any. The Operational/Closed status was also dropped when the data was loaded.",
        fix: "The shelter mapper now measures distance from the request's coordinates and keeps Operational shelters within 5 km, nearest first; restoring the status field keeps closed relief camps out.",
        evidence: {
          kind: "changelog",
          label: "Hotfix 22",
          url: floodAwareChangelog,
        },
      },
    ],
    limitations: [
      // CHANGELOG Sprint 12.1, Sprint 14.1.4 (Notes); still open in Hotfix 20.
      "Evidence tools are chosen by flood severity, not by the question, so asking about shelters cannot trigger shelter, village or GIS collection when severity alone would not.",
      // CHANGELOG Sprint 14.1.4 (Notes).
      "Forecasts come from a locally ingested GloFAS snapshot; scheduled automatic refresh is still a deferred follow-up.",
      // CHANGELOG Hotfix 22.
      "Shelter matching needs coordinates: a typed custom village name still gets the full, unfiltered shelter list.",
      // CHANGELOG Hotfix 20.
      "The intent classifier can still time out on a rare slow OpenAI call; it then falls through safely to the existing pipeline.",
    ],
  },
  {
    slug: "storyweave",
    // README: "Overview" and "Key Features".
    problem:
      "Personalized wellness support: a therapeutic story with narration and music, tailored to a need such as stress relief, motivation or sleep.",
    // README: "How It Works". The pipeline is the team's system.
    approach:
      "The team built a six-stage LangGraph pipeline: Gemini writes the story and a music prompt, ElevenLabs narrates it and generates matching music, and FFmpeg mixes the two.",
    // README title and "Tech Stack" (Infrastructure).
    outcome:
      "Won 1st place at HackVortex Codestorm 5; the app is containerized with Docker and hosted on DigitalOcean.",
    // README: "How It Works" (Workflow Details).
    architecture: {
      steps: [
        {
          id: "story",
          label: "Story Generation",
          description:
            "Gemini creates a personalized therapeutic story from the user's input.",
        },
        {
          id: "music-prompt",
          label: "Music Prompt Creation",
          description:
            "Gemini analyzes the story's emotional tone and writes a music description.",
        },
        {
          id: "speech",
          label: "Text-to-Speech Synthesis",
          description:
            "ElevenLabs converts the story text into natural-sounding speech.",
        },
        {
          id: "duration",
          label: "Audio Duration Calculation",
          description: "FFprobe calculates the exact speech duration.",
        },
        {
          id: "music",
          label: "Background Music Generation",
          description:
            "ElevenLabs generates instrumental music matching the story length.",
        },
        {
          id: "mixing",
          label: "Audio Mixing",
          description:
            "FFmpeg blends speech and music (music at 15% volume) into the final audio.",
        },
      ],
    },
    // The README names Docker and DigitalOcean but gives no reasons or
    // trade-offs, and documents no debugging story or limits.
    decisions: [],
    hardProblems: [],
    limitations: [],
  },
];
