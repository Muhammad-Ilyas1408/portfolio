import type { CredentialInput } from "./schema";

const css = "Computing Students Society (CSS), University of Peshawar";

export const credentials: CredentialInput[] = [
  {
    // TODO: conferral status, conferred or results pending (open item 9).
    name: "BS Computer Science",
    issuer: "University of Peshawar",
    years: "2022–2026",
    kind: "degree",
    published: true,
  },
  {
    name: "HackVortex Codestorm 5 — 1st place (team, StoryWeave)",
    issuer: "HackVortex Codestorm 5",
    // Self-reported by the owner.
    date: "2025-10",
    kind: "award",
    verifyUrl: "https://devpost.com/software/story-weave",
    published: true,
  },

  // Everything below stays hidden until its proof arrives.
  {
    // TODO: verify link and date (open item 3).
    name: "Machine Learning Specialization",
    issuer: "DeepLearning.AI",
    kind: "specialization",
    published: false,
  },
  {
    // TODO: verify link and date (open item 3).
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    kind: "specialization",
    published: false,
  },
  {
    // TODO: verify link and date (open item 3).
    name: "Generative AI Engineering with LLMs Specialization",
    issuer: "IBM",
    kind: "specialization",
    published: false,
  },
  {
    // TODO: verify link and date (open item 3).
    name: "Generative AI and LLMs: Architecture and Data Preparation",
    issuer: "IBM",
    kind: "course",
    published: false,
  },
  {
    // TODO: verify link and date (open item 3).
    name: "Generative AI Essentials",
    issuer: "University of Michigan",
    kind: "course",
    published: false,
  },
  {
    // TODO: Kaggle certificate link and date (open item 3).
    name: "Intro to Machine Learning",
    issuer: "Kaggle",
    kind: "course",
    published: false,
  },
  {
    // TODO: certificate image and date (open item 3).
    name: "Python for AI & Data Science",
    issuer: "SMIT/Saylani",
    kind: "training",
    published: false,
  },
  {
    // TODO: certificate image and date (open item 3).
    name: "CSS AI/ML Club Lead Award",
    issuer: css,
    kind: "award",
    published: false,
  },
  {
    // TODO: certificate image and date (open item 3).
    name: "CSS Certificate of Excellence",
    issuer: css,
    kind: "award",
    published: false,
  },
];
