import { z } from "zod";

const HttpsUrl = z.url({ protocol: /^https$/ });

// "YYYY-MM". A date whose month is unknown stays empty rather than guessed.
const YearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'dates must be "YYYY-MM"');

export const Evidence = z.object({
  kind: z.enum([
    "repo",
    "live",
    "devpost",
    "cert",
    "changelog",
    "thesis",
    "post",
    "photo",
  ]),
  label: z.string().min(1),
  url: HttpsUrl,
});

// Any number or result shown on the site.
export const Claim = z
  .object({
    text: z.string().min(1),
    status: z.enum(["verified", "self-reported"]),
    evidence: Evidence.optional(),
  })
  .refine((claim) => claim.status !== "verified" || !!claim.evidence, {
    error: "verified claims need evidence",
  });

export const Profile = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  positioning: z.string().min(1),
  location: z.string().min(1),
  availability: z.string().min(1).optional(),
  links: z.object({
    email: z.string().regex(/^mailto:[^@\s]+@[^@\s]+$/),
    github: HttpsUrl,
    linkedin: HttpsUrl,
    kaggle: HttpsUrl,
    source: HttpsUrl,
  }),
});

export const Project = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  team: z
    .array(
      z.object({ name: z.string().min(1), role: z.string().min(1).optional() }),
    )
    .default([]),
  supervisor: z.string().min(1).optional(),
  period: z
    .object({ start: YearMonth.optional(), end: YearMonth.optional() })
    .optional(),
  status: z.enum(["live", "complete", "in-progress", "experiment", "concept"]),
  tags: z.array(z.enum(["agentic-rag", "full-stack", "ml", "fundamentals"])),
  stack: z.array(z.string().min(1)),
  myContributions: z.array(z.string().min(1)).default([]),
  teamOutcomes: z.array(z.string().min(1)).default([]),
  results: z.array(Claim).default([]),
  links: z.array(Evidence).default([]),
  featured: z.boolean(),
  order: z.number().int(),
  caseStudy: z.string().optional(),
});

export const ProjectList = z.array(Project).superRefine((projects, ctx) => {
  const seenSlugs = new Set<string>();
  const seenOrders = new Set<number>();

  projects.forEach(({ slug, order }, index) => {
    if (seenSlugs.has(slug)) {
      ctx.addIssue({
        code: "custom",
        message: `duplicate slug "${slug}"`,
        path: [index, "slug"],
      });
    }
    if (seenOrders.has(order)) {
      ctx.addIssue({
        code: "custom",
        message: `duplicate order ${order}`,
        path: [index, "order"],
      });
    }
    seenSlugs.add(slug);
    seenOrders.add(order);
  });
});

export const Role = z.object({
  org: z.string().min(1),
  title: z.string().min(1),
  start: YearMonth,
  end: YearMonth.optional(),
  track: z.enum(["community", "industry"]),
  myContributions: z.array(z.string().min(1)).default([]),
  teamOutcomes: z.array(z.string().min(1)).default([]),
  evidence: z.array(Evidence).default([]),
  published: z.boolean(),
});

export const Initiative = z.object({
  name: z.string().min(1),
  date: YearMonth.optional(),
  myRole: z.string().min(1),
  scale: Claim.optional(),
  summary: z.string().min(1),
  photos: z.array(z.string()).default([]),
  evidence: z.array(Evidence).default([]),
  published: z.boolean(),
});

export const Credential = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: YearMonth.optional(),
  // For a span known only in whole years, e.g. "2022–2026".
  years: z
    .string()
    .regex(/^\d{4}–\d{4}$/)
    .optional(),
  kind: z.enum(["degree", "specialization", "course", "training", "award"]),
  verifyUrl: HttpsUrl.optional(),
  published: z.boolean(),
});

export const Skill = z.object({
  name: z.string().min(1),
  // Project slugs, or "internship".
  usedIn: z.array(z.string().min(1)).default([]),
});

export const SkillGroup = z.object({
  name: z.enum([
    "ML/DL",
    "GenAI & LLMs",
    "Backend",
    "Frontend",
    "Data & vector stores",
    "Tools & platforms",
  ]),
  skills: z.array(Skill),
});

export type Evidence = z.output<typeof Evidence>;
export type Claim = z.output<typeof Claim>;
export type Profile = z.output<typeof Profile>;
export type Project = z.output<typeof Project>;
export type Role = z.output<typeof Role>;
export type Initiative = z.output<typeof Initiative>;
export type Credential = z.output<typeof Credential>;
export type Skill = z.output<typeof Skill>;
export type SkillGroup = z.output<typeof SkillGroup>;

export type ProfileInput = z.input<typeof Profile>;
export type ProjectInput = z.input<typeof Project>;
export type RoleInput = z.input<typeof Role>;
export type InitiativeInput = z.input<typeof Initiative>;
export type CredentialInput = z.input<typeof Credential>;
export type SkillGroupInput = z.input<typeof SkillGroup>;
