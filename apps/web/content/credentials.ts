import { storyWeaveDevpost } from "./projects";
import { connectedPakistan } from "./roles";
import type { CredentialInput } from "./schema";

// Owner-provided in the M5 prompt. Dates and awards are self-reported unless
// a verifyUrl is given.
const cssAndDepartment =
  "Computing Students Society & Department of Computer Science, University of Peshawar";

/** A CSS certificate whose only photo is the certificate itself. */
const cssCertificate = (name: string, src: string): CredentialInput => ({
  name,
  issuer: cssAndDepartment,
  kind: "award",
  photos: [{ src, alt: name }],
  published: true,
});

export const credentials: CredentialInput[] = [
  // Degree
  {
    name: "BS Computer Science",
    issuer: "University of Peshawar",
    years: "2022–2026",
    // Completed Nov 2026 (self-reported).
    date: "2026-11",
    kind: "degree",
    published: true,
  },

  // Awards
  {
    name: "Award of Appreciation — President, CSS Chapter 2025–26",
    issuer: cssAndDepartment,
    date: "2026-10",
    note: "Presented at TechRise '26",
    kind: "award",
    photos: [
      {
        src: "/images/awards/appreciation-shield-2025-26.jpg",
        alt: "Award of Appreciation shield, President, CSS Chapter 2025–26",
      },
      {
        src: "/images/awards/appreciation-presented-techrise-26.jpg",
        alt: "Receiving the Award of Appreciation at TechRise '26",
      },
    ],
    published: true,
  },
  cssCertificate(
    "Certificate of Recognition — President, CSS (2025–26)",
    "/images/awards/recognition-president-2025-26.jpg",
  ),
  cssCertificate(
    "Certificate of Excellence — CSS (2025–26)",
    "/images/awards/excellence-2025-26.jpg",
  ),
  cssCertificate(
    "Certificate of Recognition — AI & DS Club Lead, CSS (2024–25)",
    "/images/awards/recognition-ai-ds-lead-2024-25.jpg",
  ),
  cssCertificate(
    "Certificate of Excellence — CSS (2024–25)",
    "/images/awards/excellence-2024-25.jpg",
  ),
  {
    name: "Appreciation Award — Connected Pakistan Conference 2024 (CPC 2024)",
    issuer: connectedPakistan,
    // The certificate shows no date, so none is given.
    note: "Presented by Connected Pakistan in appreciation of contributions to shaping Pakistan's tech industry.",
    kind: "award",
    photos: [
      {
        src: "/images/awards/connected-pakistan-cpc-2024.jpg",
        alt: "Framed Connected Pakistan Conference 2024 appreciation award presented to Muhammad Ilyas, signed by the Founder CEO of Connected Pakistan.",
      },
    ],
    published: true,
  },
  {
    name: "HackVortex Codestorm 5 — 1st place (team, StoryWeave)",
    issuer: "HackVortex Codestorm 5",
    // Self-reported by the owner.
    date: "2025-10",
    kind: "award",
    verifyUrl: storyWeaveDevpost,
    published: true,
  },

  // Certificates
  {
    name: "Certificate of Participation — HackVortex Codestorm #5",
    issuer: "HackVortex",
    // Same month as the StoryWeave project period (self-reported).
    date: "2025-10",
    // The certificate's own wording. It does not say 1st place; that claim
    // rests on the Devpost evidence.
    note: "Presented for an outstanding project in HackVortex Codestorm #5.",
    kind: "certificate",
    photos: [
      {
        src: "/images/certificates/hackvortex-codestorm-5.jpg",
        alt: "HackVortex Codestorm #5 certificate of participation presented to Muhammad Ilyas for an outstanding project.",
      },
    ],
    published: true,
  },

  // Specializations
  {
    name: "Machine Learning Specialization",
    issuer: "DeepLearning.AI & Stanford University",
    kind: "specialization",
    verifyUrl: "https://coursera.org/share/6a8972fae946064d9d5010b4e94c8196",
    published: true,
  },
  {
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    kind: "specialization",
    verifyUrl: "https://coursera.org/share/260e335b087f9a2584540926fa06e4e2",
    published: true,
  },
  {
    name: "Generative AI Engineering with LLMs Specialization",
    issuer: "IBM",
    kind: "specialization",
    verifyUrl: "https://coursera.org/share/04f6964c57f67db4b994c0fbe80ce0b0",
    published: true,
  },

  // Courses
  {
    name: "Generative AI Essentials: Overview and Impact",
    issuer: "University of Michigan",
    kind: "course",
    verifyUrl: "https://coursera.org/share/50a2946400e264aed5351678e36ca422",
    published: true,
  },
  {
    name: "AI For Everyone",
    issuer: "DeepLearning.AI",
    kind: "course",
    verifyUrl: "https://coursera.org/share/e862bac22c67c5aeddf9e03ac71b1973",
    published: true,
  },
  {
    name: "Python Basics",
    issuer: "University of Michigan",
    kind: "course",
    verifyUrl: "https://coursera.org/share/88f8d91255e75d82e31fd626393e8947",
    published: true,
  },
  {
    name: "Python Functions, Files, and Dictionaries",
    issuer: "University of Michigan",
    kind: "course",
    verifyUrl: "https://coursera.org/share/e8435175d8d47ca51fc779f1a7623cc1",
    published: true,
  },
  {
    name: "Foundations of Data Science",
    issuer: "Google",
    kind: "course",
    verifyUrl: "https://coursera.org/share/52599be52886e46ea88d4d03d826d544",
    published: true,
  },
  {
    name: "AI for Brainstorming and Planning",
    issuer: "Google",
    kind: "course",
    verifyUrl: "https://coursera.org/share/25eeb624318c431eb2bb9be0c681e79d",
    published: true,
  },
  {
    name: "AI Foundations: How Artificial Intelligence Works",
    issuer: "IBM",
    kind: "course",
    verifyUrl: "https://coursera.org/share/ab671767dd7396d70de3a6acf10c12da",
    published: true,
  },
  {
    name: "Data Science Foundations: Tools, Careers & Real-World Applications",
    issuer: "IBM",
    kind: "course",
    verifyUrl: "https://coursera.org/share/f0282661c77c467d3abc64c13a077168",
    published: true,
  },
  {
    name: "Python for Data Science & AI: Hands-On Development",
    issuer: "IBM",
    kind: "course",
    verifyUrl: "https://coursera.org/share/9349d0ddea719d277c0d53aa4833aef9",
    published: true,
  },

  // Training (no certificate link or image).
  {
    name: "Python Programming (Batch-01)",
    issuer:
      "Saylani Mass IT Training (SMIT), Saylani Welfare International Trust",
    period: { start: "2024-01", end: "2024-08" },
    kind: "training",
    published: true,
  },
];
