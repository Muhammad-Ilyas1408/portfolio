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
      evidence: { kind: "devpost", label: "Devpost", url: storyWeaveDevpost },
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
  // Shown oldest to newest.
  leadershipPath: [
    { org: gdsc, title: "AI/ML Team Member" },
    { org: gdg, title: "Executive Team Member" },
    { org: css, title: "AI/DS Club Lead" },
    { org: css, title: "President" },
  ],
};
