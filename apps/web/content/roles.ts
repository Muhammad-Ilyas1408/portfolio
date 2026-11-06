import type { RoleInput } from "./schema";

export const css = "Computing Students Society (CSS), University of Peshawar";
export const gdg = "GDG on Campus University of Peshawar";
// The program's name before it became GDG on Campus.
export const gdsc =
  "Google Developer Student Clubs (GDSC), University of Peshawar";
export const connectedPakistan = "Connected Pakistan";

// Lists CSS office-bearers by chapter; supplied by the owner in M5.
const cssAlumniPage = {
  kind: "website",
  label: "CSS alumni page",
  url: "https://cssuop.org/alumni",
} as const;

// Community myContributions are self-reported by the owner.
export const roles: RoleInput[] = [
  {
    org: "DeepCognishann Software Services",
    title: "AI/ML Engineering Intern",
    start: "2025-01",
    end: "2025-04",
    track: "industry",
    // Owner-provided in the M5 prompt (self-reported).
    summary:
      "Worked on low-resource language model adaptation through parameter-efficient fine-tuning using LoRA and QLoRA, and explored privacy-preserving machine learning by implementing Differential Privacy (DP-SGD) with Opacus, focusing on the trade-offs between model performance, training stability and privacy.",
    // Self-reported, from the CV.
    myContributions: [
      "Fine-tuned TinyLlama with Unsloth using LoRA and QLoRA on limited GPU resources.",
      "Built privacy-preserving training pipelines with Opacus and DP-SGD.",
      "Applied gradient clipping and noise injection during training.",
    ],
    published: true,
  },
  {
    org: css,
    title: "President",
    start: "2025-10",
    end: "2026-09",
    track: "community",
    myContributions: [
      "Led a team of about 40 students: the presidential council (President, Male Vice President and Female Vice President), the cabinet (Chief Secretary, Information Secretary and Creative Lead), four clubs (AI & DS, Cyber Security, Software Engineering, Literary), and the PR, media, content & graphics and management teams.",
      "Led the CSS executive team and the Department of Computer Science's student activities as president of the department's official society.",
      "Organized 18 events during the term — technical, career and community sessions, online and on campus — from the Supabase Meetup Peshawar (Nov 2025) to a Pentesting Masterclass (Sep 2026).",
      "Initiated and planned TechRise '26 (held 22 Oct 2026, 300+ attendees).",
    ],
    teamOutcomes: [],
    evidence: [cssAlumniPage],
    published: true,
  },
  {
    org: css,
    title: "AI/DS Club Lead",
    // Start and end confirmed by the owner.
    start: "2024-12",
    end: "2025-09",
    track: "community",
    myContributions: [
      "Delivered a three-part AI session series: foundations of AI, Machine Learning and Deep Learning.",
      "Co-led a GitHub session for students.",
      "Co-led and taught the CSS AI Bootcamp 2025 (Jun–Aug 2025).",
    ],
    teamOutcomes: [],
    evidence: [cssAlumniPage],
    published: true,
  },
  {
    org: gdg,
    title: "Executive Team Member",
    start: "2024-10",
    end: "2025-05",
    track: "community",
    myContributions: [
      "Co-led a career guidance and LinkedIn session.",
      "Co-led a New Year session.",
      "Hosted the Cyber Security and Virtualization session.",
      "Hosted the Hult Prize 2025: Turning Ideas into Impact session.",
    ],
    teamOutcomes: [],
    published: true,
  },
  {
    org: gdsc,
    title: "AI/ML Team Member",
    start: "2023-09",
    end: "2024-05",
    track: "community",
    myContributions: [
      "Co-led a LinkedIn session and the GDSC Solution Challenge event.",
    ],
    teamOutcomes: [],
    published: true,
  },
  {
    // One role since the owner's update: Ambassador, then Team Member.
    org: connectedPakistan,
    title: "Team Member",
    start: "2024-10",
    end: "2025-01",
    track: "community",
    myContributions: [
      "Selected as a Connected Pakistan Ambassador, then joined the Connected Pakistan team as a Team Member for the Connected Pakistan Conference 2024 (CPC 2024).",
    ],
    teamOutcomes: [],
    published: true,
  },
];
