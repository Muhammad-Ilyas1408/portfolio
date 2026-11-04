import { z } from "zod";

const HttpsUrl = z.url({ protocol: /^https$/ });

// "YYYY-MM". A date whose month is unknown stays empty rather than guessed.
const YearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'dates must be "YYYY-MM"');

// "YYYY-MM-DD" when the day is known, otherwise "YYYY-MM".
const EventDate = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/,
    'dates must be "YYYY-MM-DD" or "YYYY-MM"',
  )
  .refine(
    (value) => {
      const [year, month, day] = value.split("-").map(Number);
      return (
        day === undefined ||
        day <= new Date(Date.UTC(year, month, 0)).getUTCDate()
      );
    },
    { error: "day does not exist in that month" },
  );

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
  headline: z.string().min(1),
  intro: z.string().min(1),
  // Used for page metadata.
  positioning: z.string().min(1),
  location: z.string().min(1),
  // `src` is a path under apps/web/public.
  portrait: z
    .object({ src: z.string().regex(/^\/[^\s]+$/), alt: z.string().min(1) })
    .optional(),
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
  // `highlight: true` marks the results shown on the home card, in this order.
  results: z
    .array(
      z.intersection(Claim, z.object({ highlight: z.boolean().optional() })),
    )
    .default([]),
  links: z.array(Evidence).default([]),
  featured: z.boolean(),
  order: z.number().int(),
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

// A case study's structured content, matched to its project by `slug`.
// Every decision and hard problem cites the README section or CHANGELOG entry
// it comes from; its evidence label names that section or entry.
export const CaseStudy = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  // One sentence each, for "At a glance".
  problem: z.string().min(1),
  approach: z.string().min(1),
  outcome: z.string().min(1),
  architecture: z.object({
    // Ordered pipeline stages.
    steps: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
          label: z.string().min(1),
          description: z.string().min(1),
        }),
      )
      .min(4)
      .max(8)
      .refine(
        (steps) => new Set(steps.map((s) => s.id)).size === steps.length,
        {
          error: "architecture step ids must be unique",
        },
      ),
  }),
  // None, or 3–5. An empty list renders nothing.
  decisions: z
    .array(
      z.object({
        decision: z.string().min(1),
        why: z.string().min(1),
        tradeoff: z.string().min(1),
        evidence: Evidence,
      }),
    )
    .refine(
      (list) => list.length === 0 || (list.length >= 3 && list.length <= 5),
      {
        error: "a case study has no decisions, or 3–5",
      },
    ),
  hardProblems: z
    .array(
      z.object({
        title: z.string().min(1),
        symptom: z.string().min(1),
        rootCause: z.string().min(1),
        fix: z.string().min(1),
        evidence: Evidence,
      }),
    )
    .max(3),
  // "What I'd do next": honest limits stated in the sources only.
  limitations: z.array(z.string().min(1)).default([]),
});

export const CaseStudyList = z.array(CaseStudy).superRefine((list, ctx) => {
  const seen = new Set<string>();
  list.forEach(({ slug }, index) => {
    if (seen.has(slug)) {
      ctx.addIssue({
        code: "custom",
        message: `duplicate case study "${slug}"`,
        path: [index, "slug"],
      });
    }
    seen.add(slug);
  });
});

/** Throws unless every case study's slug matches a project. */
export function assertCaseStudiesMatchProjects(
  caseStudies: { slug: string }[],
  projects: { slug: string }[],
) {
  const slugs = new Set(projects.map((project) => project.slug));
  for (const { slug } of caseStudies) {
    if (!slugs.has(slug)) {
      throw new Error(`Case study "${slug}" has no matching project`);
    }
  }
}

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

export const Initiative = z
  .object({
    name: z.string().min(1),
    org: z.string().min(1).default("Computing Students Society"),
    start: EventDate,
    end: EventDate.optional(),
    format: z.enum(["online", "on-campus"]),
    focus: z.enum(["technical", "career", "community"]),
    venue: z.string().min(1).optional(),
    myRole: z.string().min(1),
    summary: z.string().min(1).optional(),
    // Self-reported unless they carry evidence.
    stats: z.array(Claim).default([]),
    featured: z.boolean(),
    // `src` is a path under apps/web/public, e.g. "/images/events/...".
    photos: z
      .array(
        z.object({
          src: z.string().regex(/^\/[^\s]+$/),
          alt: z.string().min(1),
        }),
      )
      .default([]),
    evidence: z.array(Evidence).default([]),
    published: z.boolean(),
  })
  .refine((item) => !item.end || item.end >= item.start, {
    error: "end must not be before start",
    path: ["end"],
  });

// Home-page content. The proof strip holds exactly four claims.
export const Home = z.object({
  proof: z.array(Claim).length(4),
  // The community roles shown in the leadership preview, matched by org and title.
  leadershipPath: z
    .array(z.object({ org: z.string().min(1), title: z.string().min(1) }))
    .min(1),
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
export type CaseStudy = z.output<typeof CaseStudy>;
export type Initiative = z.output<typeof Initiative>;
export type Credential = z.output<typeof Credential>;
export type Home = z.output<typeof Home>;
export type Skill = z.output<typeof Skill>;
export type SkillGroup = z.output<typeof SkillGroup>;

export type ClaimInput = z.input<typeof Claim>;
export type ProfileInput = z.input<typeof Profile>;
export type ProjectInput = z.input<typeof Project>;
export type RoleInput = z.input<typeof Role>;
export type CaseStudyInput = z.input<typeof CaseStudy>;
export type InitiativeInput = z.input<typeof Initiative>;
export type CredentialInput = z.input<typeof Credential>;
export type HomeInput = z.input<typeof Home>;
export type SkillGroupInput = z.input<typeof SkillGroup>;
