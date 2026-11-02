import type { RoleInput } from "./schema";

const css = "Computing Students Society (CSS), University of Peshawar";
const gdg = "GDG on Campus University of Peshawar";
const connectedPakistan = "Connected Pakistan";

export const roles: RoleInput[] = [
  {
    org: "DeepCognishann Software Services",
    title: "AI/ML Engineering Intern",
    start: "2025-01",
    end: "2025-04",
    track: "industry",
    // Self-reported, from the CV.
    myContributions: [
      "Fine-tuned TinyLlama with Unsloth using LoRA and QLoRA on limited GPU resources",
      "Built privacy-preserving training pipelines with Opacus and DP-SGD",
      "Applied gradient clipping and noise injection during training",
    ],
    published: true,
  },
  {
    org: css,
    title: "President",
    start: "2025-10",
    end: "2026-09",
    track: "community",
    myContributions: [], // TODO: owner to provide (open items 2 and 4).
    teamOutcomes: [], // TODO: owner to provide (open items 2 and 4).
    published: true,
  },
  {
    org: css,
    title: "AI/DS Club Lead",
    start: "2024-12",
    end: "2025-09",
    track: "community",
    myContributions: [], // TODO: owner to provide (open item 5).
    teamOutcomes: [], // TODO: owner to provide (open item 5).
    published: true,
  },
  {
    org: gdg,
    title: "Executive Team Member",
    start: "2024-10",
    end: "2025-05",
    track: "community",
    myContributions: [], // TODO: owner to provide (open item 5).
    teamOutcomes: [], // TODO: owner to provide (open item 5).
    published: true,
  },
  {
    org: gdg,
    title: "AI/ML Team Lead",
    start: "2023-09",
    end: "2024-05",
    track: "community",
    myContributions: [], // TODO: owner to provide (open item 5).
    teamOutcomes: [], // TODO: owner to provide (open item 5).
    published: true,
  },
  {
    org: connectedPakistan,
    title: "Ambassador",
    start: "2024-10",
    end: "2024-12",
    track: "community",
    myContributions: [], // TODO: owner to provide (open item 5).
    teamOutcomes: [], // TODO: owner to provide (open item 5).
    published: true,
  },
  {
    org: connectedPakistan,
    title: "Team Member",
    start: "2024-12",
    end: "2025-01",
    track: "community",
    myContributions: [], // TODO: owner to provide (open item 5).
    teamOutcomes: [], // TODO: owner to provide (open item 5).
    published: true,
  },
];
