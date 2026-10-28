# Portfolio Build Plan — Muhammad Ilyas

Last updated: Oct 29, 2026 · Owner: Muhammad Ilyas

## 1. How to use this plan

This is the build spec for your portfolio. We plan here, and Claude Code builds from it one milestone at a time. Put a copy at `docs/PLAN.md` in the repo and tell Claude Code to read it before each milestone. Section 10 has a ready-to-paste prompt for every milestone.

**Decisions locked from your Stage 1 answers**

| Topic | Decision |
| --- | --- |
| Flood-Aware | Team FYP with Abdullah Ahmad, supervised by Dr. Asim Jalal. Credit both on the site, and describe only the parts you personally owned (open item 1). |
| StoryWeave | Shared team repo ([JawadGigyani/StoryWeave](https://github.com/JawadGigyani/StoryWeave)). It won 1st place at HackVortex Codestorm 5 ([Devpost](https://devpost.com/software/story-weave)). Your listed role is Full-Stack Developer: Docker, deployment and infrastructure. |
| CSS presidency | Ends **30 Sep 2026**. TechRise '26 is shown as planned under your presidency (late Aug–Sep 2026) and run in Oct 2026. |
| Credentials | The Coursera org dashboard link needs your login, so it can't serve as public proof. Each certificate needs its own `coursera.org/verify/...` link (open item 3). |
| Database | None in v1. Contact messages go to your email. |
| Build tool | Claude Code builds it; this doc is the source of truth. |

**One honesty fix to make before launch.** Your CV's StoryWeave bullet says you "engineered a six-stage LangGraph pipeline." The repo README and Devpost credit the LangGraph orchestration to Muhammad Jawad. They list your role as Docker, deployment and infrastructure. A recruiter who checks the repo will see the mismatch. The site will describe your real role and the team's 1st-place win, which is still a strong story. I'd update the CV bullet to match.

The Flood-Aware CV line also merges three separate measurements into one. The site shows them separately (section 2), and the CV should do the same.

### v1 scope and guardrails (approved 29 Oct 2026)

- **Structure:** apps live only in `apps/web` (Next.js) and `apps/api` (FastAPI). M0 deletes the empty `frontend/` and `backend/` folders, so there is never a second, competing structure.
- **In v1:** the core pages, project case studies, responsive layout, accessibility, SEO fundamentals, essential tests and a secure contact form.
- **Deferred to v1.1:** analytics, live GitHub stats, entrance and scroll animations, Lighthouse CI automation, the external link checker, WebKit end-to-end tests, a light theme, and the "Ask about my work" assistant.
- **Evidence rules:** never invent facts, personal contributions, credentials, dates or metrics. Anything unresolved stays a `TODO` or `published: false`.
- **API scope:** `GET /health` and `POST /contact` only. No database and no authentication unless a real requirement appears and you approve it.
- **Costs:** v1 targets $0. No paid service is created or deployed without your explicit confirmation (section 7).

### How we work: one feature per session

1. **Plan:** in the planning chat, you get the prompt for the next milestone or feature.
2. **Build:** you start a *fresh* Claude Code session in the repo and paste the prompt. Claude Code reads `CLAUDE.md`, `docs/PLAN.md` and `docs/PROGRESS.md`, and does only that milestone. It runs the checks, updates `docs/PROGRESS.md`, and ends with a **Session report**. It never commits, pushes or deploys.
3. **Review:** you paste the Session report back into the planning chat, plus screenshots for UI work. Fixes go into a follow-up prompt.
4. **Ship:** once the work is approved, you commit and push by hand, following the step-by-step commands from the planning chat. CI must be green on GitHub.
5. **Next:** a new session for the next milestone. Large milestones (M4, M5) may be split into several feature sessions.

## 2. Content inventory

Every item on the site carries one of three evidence labels. **Verified** means a public source confirms it. **Self-reported** means it comes from you and is shown without a proof link. **Pending** means it stays hidden until proof arrives.

### Projects (featured order)

| # | Project | Your role | Status | Evidence | Facts we can show |
| --- | --- | --- | --- | --- | --- |
| 1 | [Flood-Aware](https://github.com/Muhammad-Ilyas1408/flood-aware) | Co-developer (team of 2), FYP | Complete, deployed | Repo, changelog, thesis photo, live app | 7 evidence tools; 150 villages and 51 shelters; 348 backend tests passing; golden-set evaluation with real API calls; startup cut from 5–6 min to 39 s; production GIS warm-up about 2 s; data files cut 97–98% |
| 2 | [StoryWeave](https://github.com/JawadGigyani/StoryWeave) | Full-Stack Developer: Docker, deployment, infrastructure (team of 4) | Complete, demo live | Repo README, [Devpost](https://devpost.com/software/story-weave) | 1st place at HackVortex Codestorm 5; 6-stage LangGraph pipeline (Gemini, ElevenLabs, FFmpeg); deployed with Docker on DigitalOcean |
| 3 | Internship: fine-tuning and DP-SGD | Intern | Done, Jan–Apr 2025 | Self-reported (CV) | TinyLlama with Unsloth and LoRA/QLoRA; Opacus DP-SGD with gradient clipping and noise injection. No metrics shown. |
| 4 | [Inventory System](https://github.com/Muhammad-Ilyas1408/inventory-system) | Solo | v1.0.0 | Repo | Layered architecture; 214 tests passing |
| — | Lab grid: ReAct agent, RAG tools, Personality Search, AI Chatbot, File Intelligence, Spendly, spam classifier | Solo | Mixed | Only Spendly and the spam classifier are public | Each card appears only once its repo is public, labelled *Experiment*, *In progress* or *Concept* |

**Flood-Aware performance, shown as three separate facts:**

- **Per-request GIS collection** went from about 90 s–4 min to about 30 s. This came from caching the parsed data at startup (changelog, Sprint 14.1.5).
- **Regional data extraction** shrank the OSM file from 147 MB to 4 MB and the WorldPop raster from 135 MB to 2 MB. Local startup dropped from 5–6 min to 39 s, with analysis results bit-for-bit identical (Hotfix 14.4).
- **Production GIS warm-up** takes about 2 s on Railway (Sprint 16.1).

Sources: [Flood-Aware changelog](https://github.com/Muhammad-Ilyas1408/flood-aware/blob/main/docs/CHANGELOG.md).

### Leadership timeline

| Period | Role | Organization | Evidence |
| --- | --- | --- | --- |
| Oct 2025 – Sep 2026 | President | Computing Students Society (CSS), UoP | Self-reported |
| Aug – Oct 2026 | Led planning of TechRise '26 (planned Aug–Sep, run Oct 2026) | CSS | Pending: post or photos |
| Summer 2026 | Instructor, Summer Bootcamp 2026 (70+ participants reported) | CSS | Pending: topic taught and source of the 70+ figure |
| Dec 2024 – Sep 2025 | AI/DS Club Lead | CSS | Self-reported |
| Dec 2024 – Jan 2025 | Team Member | Connected Pakistan | Self-reported |
| Oct – Dec 2024 | Ambassador | Connected Pakistan | Self-reported |
| Oct 2024 – May 2025 | Executive Team Member | GDG on Campus, UoP | Self-reported |
| Sep 2023 – May 2024 | AI/ML Team Lead | GDG on Campus, UoP | Self-reported |

### Awards and credentials

| Item | Kind | Evidence |
| --- | --- | --- |
| HackVortex Codestorm 5, 1st place (StoryWeave, team of 4) | Award, team | **Verified** (Devpost) |
| CSS AI/ML Club Lead Award | Award, individual | Pending: certificate image |
| CSS Certificate of Excellence | Award, individual | Pending: certificate image |
| BS Computer Science, University of Peshawar, 2022–2026 | Degree | Thesis photo; conferral status pending |
| DeepLearning.AI ML Specialization; Deep Learning Specialization | Specialization | Pending: verify links |
| IBM GenAI Engineering with LLMs Specialization | Specialization | Pending: verify link |
| IBM GenAI and LLMs: Architecture and Data Preparation; Michigan GenAI Essentials | Course | Pending: verify links |
| Kaggle Intro to Machine Learning | Course | Pending: Kaggle certificate link |
| SMIT/Saylani Python for AI & Data Science | Training | Pending: certificate image |

## 3. Brand and visual identity

**Positioning line:** *AI/ML Engineer building grounded, agentic systems — and the communities that build them.*

**Concept: "Signal and Ember."** The site's two halves get two accent colors that never compete. **Signal** (cool teal) marks engineering work: projects, skills, experience, code. **Ember** (warm amber) marks people work: leadership, community, teaching, awards. A visitor learns the code in seconds. Teal means *what he built*, amber means *who he built it with*. Pages that join both, like About and the hero, use both accents sparingly.

**The evidence system is the signature.** Every claim gets a small mono chip: `REPO`, `LIVE`, `DEVPOST`, `CERT`, `CHANGELOG` or `THESIS`. Each chip links to its proof. Verified chips get a green dot; self-reported items get no chip. This turns Flood-Aware's "never fabricate" principle into the site's identity.

### Color tokens (dark theme, the default)

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | #0B0F14 | Page background (deep ink, slightly blue) |
| `surface` | #11161D | Cards, panels |
| `surface-raised` | #171D26 | Hover, modals, active cards |
| `border` | #232B36 | Hairlines, dividers |
| `text` | #E6EAF0 | Body and headings |
| `text-muted` | #8A96A6 | Metadata, captions (about 6.7:1 on bg) |
| `signal` | #5EEAD4 | Engineering accent: links, project highlights, focus rings |
| `signal-soft` | #5EEAD4 at 10% | Engineering tints, chip backgrounds |
| `ember` | #F5B454 | Leadership accent: timeline nodes, community highlights, awards |
| `ember-soft` | #F5B454 at 10% | Leadership tints |
| `verified` | #6EE7A0 | Verified dot on evidence chips only |

Rules: an accent stays under about 10% of any screen; text never sits on a full-strength accent fill; focus rings use `signal` everywhere. A light theme comes from the same token names in phase 2. The tokens make it a one-file change.

### Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display (h1–h2) | Bricolage Grotesque, 600–700 | Distinctive and confident; tight tracking at large sizes |
| Body and UI | Inter, 400–600 | 17px base, 1.65 line height, 68ch max line length |
| Mono (chips, metadata, code) | JetBrains Mono, 400–500 | Dates, stack tags, evidence chips, section numbers like `01 / About` |

All three load through `next/font` (self-hosted, no layout shift). Scale: 14 / 17 / 20 / 28 / 40 / 64 px.

### Layout and motion

- **Grid:** 12 columns, 1200px max width, 24px gutters on desktop and 16px on mobile. Sections open with a mono label (`02 — Projects`).
- **Texture:** one faint dot grid behind the hero only, like engineering paper. No gradients or glassmorphism elsewhere.
- **Motion:** v1 uses only hover and focus transitions: 150ms color and border changes, plus a 2px lift on project cards. All of it is off under `prefers-reduced-motion`. Section reveals and the scroll-drawn timeline are deferred to v1.1.
- **Banned:** skill bars and percentages, typing-effect headlines, particle backgrounds, cursor followers, and any counters for numbers we can't source.

## 4. Information architecture

The home page is a fast overview that previews everything. Each area also gets its own page with full depth. Recruiters skim the home page in 60 seconds, and engineers and collaborators click through to the detail.

```text
Sitemap
/                      Home (previews every section)
├── /projects          All work (Signal / teal)
│   ├── /projects/flood-aware
│   ├── /projects/storyweave
│   └── /projects/inventory-system
├── /experience        Internship (Signal / teal)
├── /leadership        Timeline (Ember / amber)
├── /credentials       Certificates
├── /about             Journey
├── /contact           Form + email
└── /cv.pdf            Static file
```

**Main navigation (desktop):** Work · Experience · Leadership · Credentials · About, with a Contact link and a filled "Download CV" button on the right. On mobile it becomes a full-screen sheet with the same order and a sticky CV button. The active page is marked with `aria-current="page"`.

**Footer:** email, GitHub, LinkedIn, Kaggle, Devpost, CV, a "Built with Next.js + FastAPI — source on GitHub" link, and the last-updated date.

**Other routes:** `/projects/[slug]` for each case study, `/cv.pdf` (a static file), a custom 404 page, `sitemap.xml`, `robots.txt`, and a generated Open Graph image for each page.

## 5. Page-by-page UX spec

### Home `/`

1. **Hero.** On the left: a mono label `AI/ML ENGINEER · PESHAWAR, PK`, then the h1 "I build AI systems that show their evidence." Below it, one line: "Grounded LLM agents, RAG and GIS pipelines — and the student communities that build them." Buttons: **View work** (filled, signal), **Download CV** (outline), and a text link to Contact. On the right: your portrait in a rounded-square frame with a thin signal border. Under it, an availability chip, e.g. "Open to AI/ML roles — 2026" (your wording, open item 6).
2. **Proof strip.** Four facts with no counters: "Flood-Aware — live, 348 tests" · "HackVortex Codestorm 5 — 1st place" · "CSS President 2025–26" · "AI/ML Intern — LLM fine-tuning + DP-SGD". Each links to its source.
3. **Featured work.** One large Flood-Aware card with an architecture thumbnail, then two smaller cards for StoryWeave and the internship. A link reads "All projects →".
4. **Leadership preview.** A horizontal mini-timeline in ember: GDG AI/ML Lead → CSS AI/DS Club Lead → CSS President, with a link reading "See the full story →".
5. **Credentials row.** Small logos and names for the degree and the top 3 specializations, with a link to "All credentials →".
6. **Contact band.** "Building something with LLMs, or running a tech community? Let's talk." Buttons for Email and the contact form.

### Projects `/projects`

- Filter chips: All · Agentic/RAG · Full-stack · ML · Engineering fundamentals. Filters are client-side and the URL keeps the state (`?tag=rag`).
- Each card shows a title, one-line problem, role ("Co-developer, team of 2"), stack tags in mono, a status pill (*Live* · *Complete* · *In progress* · *Experiment* · *Concept*) and evidence chips.
- A **Lab** section at the bottom holds a compact list for smaller public repos.

### Case study `/projects/[slug]` (the template every project uses)

1. Header: title, a one-line summary, role, team and supervisor, dates, a status pill, and buttons for Live demo, Repo and Docs.
2. **At a glance:** a 4-cell grid covering Problem · Approach · My role · Outcome.
3. **Architecture:** a static, accessible SVG diagram with a numbered list below it explaining each component. Nothing is hidden behind hover, so the list works on phones and with screen readers.
4. **Key engineering decisions:** 3–5 cards, each following *Decision → Why → Trade-off*.
5. **Hard problems solved:** 2–3 short debugging stories. For Flood-Aware: the evidence-reuse regression, the missing forecast-discharge mapping, and shelter-proximity matching.
6. **Results:** only sourced numbers, each with its evidence chip.
7. **Team and credit:** names everyone, and separates *what I did* from *what the team did*.
8. **What I'd do next:** honest limits and next steps.
9. Previous and next project links.

### Experience `/experience`

A card for the DeepCognishann internship (Jan–Apr 2025) with three subsections: LLM fine-tuning (TinyLlama, Unsloth, LoRA/QLoRA), privacy-preserving ML (Opacus, DP-SGD, clipping and noise), and what you learned. It includes a plain explainer box: "What is DP-SGD, in 3 sentences." It shows no company code. A link to a public DP-SGD demo notebook can be added later if you build one.

### Leadership `/leadership` (the ember page)

1. Intro: "From leading one AI/ML team to running a computing society."
2. **Progression timeline:** vertical and newest first, and static in v1. Each node shows the role, organization, dates and 2–3 bullets split into **"I led"** and **"We delivered"**.
3. **Initiatives:** event cards for TechRise '26, Summer Bootcamp 2026 and workshops. Each card shows the date, your role, scale (only sourced numbers), photos and a link to the post.
4. **Teaching and mentorship:** what you taught at the bootcamp, plus talks and workshops.
5. Awards from community work: CSS AI/ML Club Lead Award and Certificate of Excellence, once their images are provided.

### Credentials `/credentials`

Four groups in this order: **Degree** · **Specializations** · **Courses and training** · **Awards**. Each row shows the name, issuer, date and a "Verify ↗" link. Items without proof are hidden until their proof arrives. A small note explains the rule: "Every credential here links to its issuer's verification page."

### About `/about`

- **Story:** 3 short paragraphs: how you started, community and engineering together, and where you're going.
- **Engineering principles:** 3 cards. 1) Ground every claim in evidence. 2) Verify with real systems, not just mocks. 3) Fix root causes, not symptoms. Each card links to a Flood-Aware example.
- **Skills:** grouped by area (ML/DL · GenAI and LLMs · Backend · Frontend · Data and vector stores · Tools). Each skill links to where it was used, e.g. "LangGraph → Flood-Aware, StoryWeave". Skills with no project to point to are listed as "Familiar" without a link.
- **Education:** the degree card with the FYP title and supervisor.

### Contact `/contact`

The form fields are Name, Email, a Reason dropdown (Job opportunity · Collaboration · Speaking/community · Other) and a Message. The form has inline validation and a hidden honeypot field. The submit button shows a loading state, then a success panel or an error panel with a mailto fallback. Email, GitHub, LinkedIn and the CV are listed beside the form.

### States every page handles

Loading skeletons appear only where data loads at runtime, which is just the contact form. Empty states cover a filtered project list with no results. A broken image falls back to a monogram. The 404 page links back to Work and Home.

## 6. Content model

All content lives in typed files under `apps/web/content/`. Zod schemas check every file at build time, so a missing field or a proof-less "verified" claim fails the build. Case-study prose goes in MDX, and structured facts go in TypeScript. To update the site, you edit content files only and never touch components.

```ts
// content/schema.ts — the single source of truth for content shape
export const Evidence = z.object({
  kind: z.enum(['repo', 'live', 'devpost', 'cert', 'changelog', 'thesis', 'post', 'photo']),
  label: z.string(),
  url: z.string().url(),
});

export const Claim = z.object({        // any number or result shown on the site
  text: z.string(),                    // "348 backend tests passing"
  evidence: Evidence.optional(),       // required when status === 'verified'
  status: z.enum(['verified', 'self-reported']),
}).refine(c => c.status !== 'verified' || !!c.evidence, 'verified claims need evidence');

export const Project = z.object({
  slug: z.string(), title: z.string(), summary: z.string(),
  role: z.string(), team: z.array(z.object({ name: z.string(), role: z.string() })),
  supervisor: z.string().optional(),
  period: z.object({ start: z.string(), end: z.string().optional() }),
  status: z.enum(['live', 'complete', 'in-progress', 'experiment', 'concept']),
  tags: z.array(z.enum(['agentic-rag', 'full-stack', 'ml', 'fundamentals'])),
  stack: z.array(z.string()),
  myContribution: z.array(z.string()),  // what I did
  teamContribution: z.array(z.string()).optional(), // what the team did
  results: z.array(Claim),
  links: z.array(Evidence),
  featured: z.boolean(), order: z.number(),
  caseStudy: z.string().optional(),     // path to the MDX file
});

export const Role = z.object({
  org: z.string(), title: z.string(), start: z.string(), end: z.string().optional(),
  track: z.enum(['community', 'industry']),
  iLed: z.array(z.string()), weDelivered: z.array(z.string()),
  evidence: z.array(Evidence).default([]),
});

export const Initiative = z.object({ // TechRise '26, Summer Bootcamp 2026, workshops
  name: z.string(), date: z.string(), myRole: z.string(),
  scale: Claim.optional(), summary: z.string(),
  photos: z.array(z.string()).default([]), evidence: z.array(Evidence).default([]),
});

export const Credential = z.object({
  name: z.string(), issuer: z.string(), date: z.string().optional(),
  kind: z.enum(['degree', 'specialization', 'course', 'training', 'award']),
  verifyUrl: z.string().url().optional(),
  published: z.boolean(),               // false until proof exists
});
```

**Files:** `profile.ts` (name, positioning, links, availability), `projects.ts`, `roles.ts`, `initiatives.ts`, `credentials.ts`, `skills.ts` (each skill lists the project slugs where it was used), and `case-studies/*.mdx`.

## 7. Technical architecture

Every page is pre-rendered and served from Vercel's CDN. The FastAPI service does one job: it receives contact messages safely. The site therefore stays fast, cheap and hard to break. It also still shows your own Python backend stack.

```text
Architecture — pages are static on Vercel; only the contact form calls the API

Visitor ──HTTPS──▶ Vercel · Next.js
                   ├── Static pages (SSG)
                   ├── Content files (Zod-checked)
                   └── Contact form (client) ──JSON──▶ FastAPI (free-tier host, chosen in M9)
                                                       ├── GET  /health
                                                       └── POST /contact ─▶ validate, rate-limit
                                                                              │
                                                                              ▼
                                                                      Resend email API ─▶ Your inbox
```

### Frontend — `apps/web`

- **Next.js 16 (App Router), TypeScript in strict mode, Tailwind CSS v4.** shadcn/ui is used only for accessible primitives (Sheet, Dialog, Tooltip). Every other component is our own, so the site doesn't look like a template.
- **Rendering:** all routes are statically generated from the content files. v1 fetches no data at runtime. Repos appear as plain links, and live GitHub stats are deferred to v1.1.
- **Motion:** CSS transitions only, with no animation library in v1.
- **Images:** `next/image` serves AVIF/WebP. Your portrait is at most 1200px at the source.
- **SEO:** the Metadata API, `opengraph-image.tsx` for each route, `sitemap.ts`, `robots.ts`, and JSON-LD for `Person` (with `sameAs` links to GitHub, LinkedIn and Kaggle) and `CreativeWork` for each project.
- **Analytics:** none in v1. Deferred to v1.1, when a cookie-free option can be added.

### Backend — `apps/api`

- **FastAPI with Pydantic v2 and pydantic-settings.** It runs on Python 3.11 under uv, the same tooling as Flood-Aware.

| Endpoint | Request | Responses |
| --- | --- | --- |
| `GET /health` | — | `200 {"status":"ok","version":"1.0.0"}` |
| `POST /contact` | `{name: 2–80 chars, email: EmailStr, reason: enum, message: 20–5000 chars, website: "" (honeypot)}` | `202 {"ok":true}` · `422` validation errors by field · `429` rate-limited with `Retry-After` · `503` email provider down (the client shows the mailto fallback) |

- **Security:**
  - CORS allows the production domain exactly, plus a regex pinned to your own Vercel previews (the same lesson as Flood-Aware's Sprint 16.3).
  - Rate limiting allows 5 requests per IP per 10 minutes through `slowapi`.
  - A filled honeypot field returns a fake 202 and sends nothing.
  - Request bodies are capped at 16 KB.
  - Message text is escaped before going into the email HTML.
  - Logs never contain the message body, only the request id and outcome.
  - Secrets come from environment variables only: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CORS_ALLOW_ORIGINS`, `CORS_ALLOW_ORIGIN_REGEX`.
- **Email:** [Resend](https://resend.com) sends a notification to you, plus an optional auto-reply to the sender.
- **No database in v1.** If you later want an admin inbox or dynamic content, add Postgres (Railway or Neon) behind the same API.

### Hosting and cost

v1 targets **$0 a month**. One rule applies to every deployment step: **Claude Code never creates accounts, enables billing, buys domains or deploys.** You do each step yourself in M9 by following `docs/DEPLOY.md`. Anything that can charge money needs your explicit OK first.

| Piece | v1 default (free) | Paid option (only with your approval) |
| --- | --- | --- |
| Website | Vercel Hobby plan (free, for personal, non-commercial sites) | Not needed |
| Contact API | A free-tier host, chosen in M9 after checking each provider's current pricing page. Free hosts may sleep and take a few seconds on the first request. That's acceptable, because the form shows a loading state and a mailto fallback. | A paid plan (e.g. Railway), only if you want no cold starts |
| Email | Resend free tier | Not needed |
| Domain | Optional; the site works on its free `*.vercel.app` address | About $10–15 a year, bought by you |

Free-tier limits and prices change, so this plan doesn't state numbers that may go stale. Before M9, Claude Code reads each provider's official pricing page, lists the current free limits and any costs, and waits for your choice.

## 8. Repository structure

One public monorepo named `portfolio`. Its README is itself a showcase: an architecture diagram, setup steps, test commands and a deploy guide.

```text
portfolio/
├── apps/
│   ├── web/                         # Next.js 16 — Vercel (Root Directory = apps/web)
│   │   ├── app/
│   │   │   ├── layout.tsx           # fonts, theme tokens, header, footer, JSON-LD Person
│   │   │   ├── page.tsx             # Home
│   │   │   ├── projects/page.tsx
│   │   │   ├── projects/[slug]/page.tsx
│   │   │   ├── experience/  leadership/  credentials/  about/  contact/
│   │   │   └── opengraph-image.tsx  sitemap.ts  robots.ts  not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Chip, Card, Pill, Section, Container
│   │   │   ├── evidence/            # EvidenceChip, ClaimList
│   │   │   ├── projects/            # ProjectCard, CaseStudyHeader, ArchitectureDiagram, DecisionCard
│   │   │   ├── leadership/          # Timeline, TimelineNode, InitiativeCard
│   │   │   ├── contact/             # ContactForm (react-hook-form + zod)
│   │   │   └── layout/              # SiteHeader, MobileNav, SiteFooter
│   │   ├── content/                 # ← the only folder you edit to update the site
│   │   │   ├── schema.ts  profile.ts  projects.ts  roles.ts
│   │   │   ├── initiatives.ts  credentials.ts  skills.ts
│   │   │   └── case-studies/        # flood-aware.mdx, storyweave.mdx, inventory-system.mdx
│   │   ├── lib/                     # api-client.ts, seo.ts
│   │   ├── public/                  # cv.pdf, portrait, images/ (events, logos)
│   │   ├── tests/unit/  tests/e2e/  # Vitest / Playwright
│   │   ├── vitest.config.mts  playwright.config.ts
│   │   ├── AGENTS.md                # written by Next.js 16 — keep it
│   │   ├── package.json             # scripts: dev, build, lint, typecheck, test, test:e2e, format
│   │   └── .env.example             # NEXT_PUBLIC_API_URL only
│   └── api/                         # FastAPI — contact + health only
│       ├── app/
│       │   ├── main.py              # app factory, CORS, middleware, routers
│       │   ├── config.py            # pydantic-settings            (M6)
│       │   ├── routers/             # health.py, contact.py        (M6)
│       │   ├── schemas.py           # ContactRequest / ContactResponse (M6)
│       │   ├── services/mailer.py   # Resend behind a Mailer protocol (M6)
│       │   └── security.py          # rate limit, honeypot, body-size limit (M6)
│       ├── tests/
│       ├── pyproject.toml           # deps + ruff, mypy, pytest config
│       ├── uv.lock  .python-version  .env.example
├── docs/
│   ├── PLAN.md                      # this document
│   └── API.md  DEPLOY.md  CONTENT-GUIDE.md   (written in M6 and M9)
├── .github/workflows/ci.yml         # web + api jobs
├── package.json                     # root scripts + "packageManager": "pnpm@…"
├── pnpm-workspace.yaml              # packages: [apps/web] + ignoredBuiltDependencies
├── pnpm-lock.yaml                   # the ONLY lockfile for the web app
├── CLAUDE.md  README.md  .gitignore  .editorconfig
```

There is no `frontend/` or `backend/` folder. The root `package.json` delegates to the web app (`pnpm --filter web <script>`) and to the API (`uv run --directory apps/api …`), so every command runs from the repo root.

**`CLAUDE.md` (create it first).** It holds the standing rules for every Claude Code session:

- Read `docs/PLAN.md` before any milestone.
- Never invent content. Every claim lives in `content/` and must pass the schema.
- Use only theme tokens, never raw hex values in components.
- Respect `prefers-reduced-motion`.
- Run `pnpm lint && pnpm typecheck && pnpm test` and `uv run pytest` before saying a milestone is done.
- Keep commits small, with conventional commit messages.

## 9. Quality bars

A milestone is done only when its checks pass in CI. Each bar below is a concrete test, not a goal.

| Area | v1 target | How it's checked |
| --- | --- | --- |
| Performance | Lighthouse 95+ on mobile for every page; LCP under 2.0 s, CLS under 0.05 | Manual Lighthouse run against `pnpm build && pnpm start` before launch (CI automation deferred to v1.1) |
| Accessibility | WCAG 2.2 AA: 4.5:1 text contrast, visible focus rings, a skip link, keyboard-only navigation, alt text on all images, form errors announced through `aria-live` | `@axe-core/playwright` on every route (zero violations), plus a manual keyboard pass |
| SEO fundamentals | A unique title and description per page, OG image, canonical URL, sitemap, robots and JSON-LD `Person` | Playwright checks the meta tags on key routes; Google Rich Results test before launch |
| Content integrity | No verified claim without evidence; nothing unpublished renders | Zod schemas at build time, plus unit tests for both rules |
| Frontend tests (essential) | Unit: EvidenceChip, content schema rules, contact form validation. End-to-end: navigation, mobile menu, CV download, contact success and error states (API mocked) | Vitest; Playwright on Chromium at 375px and 1280px |
| Backend tests | 202 on a valid submission; 422 for each invalid field; honeypot sends nothing; 429 on the 6th request within 10 minutes; no CORS headers for a disallowed origin; 503 when the mailer fails | pytest + httpx, with a fake mailer |
| Security | No secrets in client bundles; CSP, HSTS, `X-Content-Type-Options` and `Referrer-Policy` headers set | A CI grep for key patterns in `.next/`; a header check after deploy |
| Responsive | Correct at 360, 390, 768, 1024, 1280 and 1536 px with no horizontal scroll | A manual check at each width, plus Playwright screenshots for design review |

CI (GitHub Actions) has two jobs. **web** runs lint, typecheck, unit tests, build and the Chromium end-to-end tests. **api** runs ruff (lint and format check), mypy in strict mode and pytest. Pull requests must pass CI before merging to `main`. Auto-deploy from `main` is switched on by you in M9. Deferred to v1.1: Lighthouse CI, the weekly link checker and WebKit runs.

## 10. Milestones and Claude Code prompts

Run the milestones in order, one Claude Code session each. After M1 and M3, bring screenshots back here for a design review before you continue. Fixing the look early is cheaper than fixing it on every page.

| # | Milestone | Done when |
| --- | --- | --- |
| M0 | Scaffold apps, tooling and CI (root files created by hand) | `frontend/` and `backend/` removed; `pnpm dev` and `pnpm api` both start; Prettier, ruff, mypy, Vitest and Playwright configured; CI green |
| M1 | Design system and layout shell | Tokens, fonts, UI primitives, header/footer/mobile nav, `/styleguide` page; axe is clean |
| M2 | Content layer | Schemas plus real content for every item marked Verified or Self-reported; the build fails on a bad claim |
| M3 | Home page | All 6 home sections built from content; works at 360–1536 px — **design review** |
| M4 | Projects and case studies | Index with filters; template; Flood-Aware case study with an interactive architecture diagram; StoryWeave and Inventory |
| M5 | Experience, Leadership, Credentials, About | All four pages; a static leadership timeline; axe clean on every route |
| M6 | Contact API | FastAPI endpoints, security and the full pytest suite passing |
| M7 | Contact form integration | Form wired to the API with every state; e2e tests with the API mocked |
| M8 | SEO, accessibility and performance pass | Every target in section 9 met |
| M9 | Deploy and docs | Current costs confirmed by you; deployed by you on free tiers; `API.md`, `DEPLOY.md`, `CONTENT-GUIDE.md` and the README written |

**M0 — setup**

```text
Read CLAUDE.md and docs/PLAN.md (sections 1 and 7–10). Complete milestone M0 only: scaffolding, tooling and CI. No pages, no design work, no application features. Every command below was dry-run and works together; follow them exactly.

0) Legacy folders: if frontend/, backend/ or assets/ still exist, they should be empty; delete them. If any contains files, STOP and ask me. Apps live only in apps/web and apps/api. Remove apps/.gitkeep once both apps exist.

1) Root workspace:
   - package.json: {"name":"portfolio","private":true,"packageManager":"pnpm@<output of pnpm -v>"} with scripts
     dev/build/lint/typecheck/test = "pnpm --filter web <same name>",
     api = "uv run --directory apps/api fastapi dev app/main.py",
     api:test = "uv run --directory apps/api pytest".
   - pnpm-workspace.yaml: packages: ["apps/web"].

2) Web scaffold:
   pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm --yes
   It creates its own pnpm-workspace.yaml, pnpm-lock.yaml and node_modules INSIDE apps/web. Delete all three, copy its ignoredBuiltDependencies list into the root pnpm-workspace.yaml, then run `pnpm install` at the root (one lockfile, at the root). Append `!.env.example` to apps/web/.gitignore, because Next ignores .env*. Read apps/web/AGENTS.md: this is Next.js 16.

3) Web tooling (apps/web):
   - Scripts: typecheck "tsc --noEmit", test "vitest run", test:e2e "playwright test", format "prettier --write .". Keep "strict": true.
   - Dev deps: vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths @playwright/test @axe-core/playwright prettier prettier-plugin-tailwindcss
   - vitest.config.mts: jsdom environment, include tests/unit/**/*.test.{ts,tsx}.
   - playwright.config.ts: Chromium only, testDir tests/e2e, webServer "pnpm build && pnpm start" on port 3000, reuseExistingServer when not in CI.
   - One smoke test each: a Vitest render test, and a Playwright test that loads / and has zero axe violations.
   - Folders (.gitkeep where empty): components/{ui,evidence,projects,leadership,contact,layout}, content/case-studies, lib, tests/unit, tests/e2e, public/images.
   - .env.example containing only: NEXT_PUBLIC_API_URL=http://localhost:8000

4) API scaffold (contact + health only; no database, no auth):
   uv init apps/api --app --name portfolio-api --python 3.11 --no-readme --vcs none
   Delete the generated main.py, then:
   uv add --directory apps/api "fastapi[standard]" pydantic-settings slowapi resend
   uv add --directory apps/api --dev pytest pytest-asyncio httpx ruff mypy
   - app/__init__.py; app/main.py with ONLY GET /health -> {"status":"ok","version":"0.1.0"}; tests/__init__.py; tests/test_health.py using TestClient.
   - pyproject.toml: [tool.ruff] line-length = 100, target-version = "py311"; [tool.ruff.lint] select = ["E","F","I","B","UP"]; [tool.mypy] strict = true, files = ["app"]; [tool.pytest.ini_options] testpaths = ["tests"], asyncio_mode = "auto", asyncio_default_fixture_loop_scope = "function".
   - .env.example with empty values only: RESEND_API_KEY=, CONTACT_TO_EMAIL=, CORS_ALLOW_ORIGINS=http://localhost:3000, CORS_ALLOW_ORIGIN_REGEX=

5) CI (.github/workflows/ci.yml), on push and pull_request to main, two jobs, no secrets:
   web: actions/checkout@v4 -> pnpm/action-setup@v4 (reads packageManager) -> actions/setup-node@v4 (node 22, cache: pnpm) -> pnpm install --frozen-lockfile -> pnpm lint -> pnpm typecheck -> pnpm test -> pnpm build -> pnpm --filter web exec playwright install --with-deps chromium -> pnpm --filter web test:e2e
   api: actions/checkout@v4 -> astral-sh/setup-uv@v6 -> uv sync --directory apps/api --locked -> uv run --directory apps/api ruff check . -> uv run --directory apps/api ruff format --check . -> uv run --directory apps/api mypy -> uv run --directory apps/api pytest

6) Verify locally, in order, and fix any failure: pnpm lint, pnpm typecheck, pnpm test, pnpm build, pnpm --filter web test:e2e, pnpm api:test, ruff check, ruff format --check, mypy. Then start `pnpm api` and confirm GET http://localhost:8000/health returns ok. Add these commands to the README "Quick start".

Do NOT commit, push, deploy or create any external account or service; I review and commit myself. Update docs/PROGRESS.md, then end with the Session report from CLAUDE.md. Include the tree (excluding node_modules, .venv, .next) and use "chore: scaffold monorepo (web + api), tooling and CI" as the suggested commit message.
```

**M1 — design system**

```text
Implement section 3 of docs/PLAN.md. Define every color token as a CSS variable in globals.css and map it into Tailwind's theme; no raw hex anywhere else. Load Bricolage Grotesque, Inter and JetBrains Mono with next/font. Build components/ui: Button (filled, outline, ghost), Chip, EvidenceChip (kind, label, url, verified dot), Pill (status), Card, Section (mono label + heading), Container. Build SiteHeader (nav from section 4, active state with aria-current, CV button), a MobileNav sheet and SiteFooter. Add a /styleguide page that renders every component and the type scale, and exclude it from the sitemap. Add a skip link and visible focus rings. Run axe through Playwright on /styleguide and fix every violation.
```

**M2 — content layer**

```text
Implement section 6 of docs/PLAN.md. Create content/schema.ts with the Zod schemas exactly as written, and validate every content file at build time so a bad entry fails `pnpm build`. Fill profile.ts, projects.ts, roles.ts, initiatives.ts, credentials.ts and skills.ts using ONLY the facts in section 2. Mark anything listed as Pending with published: false. Do not invent numbers, dates, roles or links; if a field is unknown, leave it optional and add a TODO comment. Write unit tests proving that a verified claim without evidence and an unpublished credential are both rejected or hidden.
```

**M3 — home page**

```text
Build the Home page per section 5 ("Home") of docs/PLAN.md, reading only from content/. Portrait in public/portrait.jpg via next/image with priority. Proof strip items are EvidenceChips linking to their sources; items without evidence do not render. Featured work: one large Flood-Aware card plus two smaller cards. Leadership preview uses the ember accent. No entrance or scroll animations in v1: hover and focus transitions only. Check layouts at 360, 390, 768, 1024, 1280 and 1536 px with Playwright screenshots saved to tests/screenshots/ (git-ignored) so I can review the design.
```

**M4 — projects and case studies**

```text
Build /projects and /projects/[slug] per section 5 of docs/PLAN.md. Filters are chips synced to ?tag=. The case-study template renders the header, At a glance, Architecture, Key decisions, Hard problems, Results (Claims with EvidenceChips), Team & credit ("What I did" and "What the team did" kept separate), What I'd do next, and prev/next links. ArchitectureDiagram is a static, accessible inline SVG (role="img" with an aria-label) with a numbered list below explaining each component; nothing is hover-only. Write the Flood-Aware MDX using only facts in section 2 and the public Flood-Aware README and CHANGELOG. Leave "What I did" as an explicit TODO for me: never infer personal contributions. StoryWeave describes only the role stated in its README and Devpost. Generate static params for all slugs.
```

**M5 — experience, leadership, credentials, about**

```text
Build /experience, /leadership, /credentials and /about per section 5 of docs/PLAN.md. Leadership: a static vertical timeline, newest first, using the ember accent; each node splits "I led" and "We delivered". Use only content I have provided; an empty list renders nothing, never placeholder text. Initiative cards and credentials render only published items. About: story, three principle cards, skills grouped and linked to the projects that use them, and the education card. Keyboard-test every page and run axe on each route.
```

**M6 — contact API**

```text
Build apps/api per section 7 of docs/PLAN.md: GET /health and POST /contact with the exact request and response contract in the table. Pydantic v2 models, pydantic-settings config, CORS with an exact origin list plus a pinned regex, slowapi rate limit of 5 per IP per 10 minutes, a 16 KB body limit, a honeypot field that returns a fake 202, HTML-escaped email content, and no message bodies in logs. Put the Resend mailer behind a Mailer protocol so tests use a fake. Write pytest tests for every case in section 9's backend row. Write docs/API.md with request and response examples.
```

**M7 — contact form**

```text
Wire components/contact/ContactForm to POST /contact using react-hook-form with a zod schema that mirrors the API contract. States: idle, field errors (inline + aria-live), submitting (disabled button + spinner), success panel, 429 message with retry time, and 503/network error with a mailto fallback. API URL from NEXT_PUBLIC_API_URL. Add Playwright e2e tests for each state with the API mocked via route interception.
```

**M8 — SEO, accessibility and performance**

```text
Meet every v1 target in section 9 of docs/PLAN.md. Add the Metadata API per page, opengraph-image.tsx per route, sitemap.ts, robots.ts, JSON-LD Person (sameAs GitHub, LinkedIn, Kaggle) and CreativeWork per project. Add the security headers in next.config. Run Lighthouse locally against `pnpm build && pnpm start`, and axe on every route; fix anything under target and report the scores in a table. No analytics.
```

**M9 — deploy and docs**

```text
Prepare deployment without deploying anything. Write docs/DEPLOY.md: the Vercel project (Root Directory apps/web, env vars), the API host setup from apps/api (health check path /health, env vars), Resend sender verification, and the optional custom domain. Write docs/CONTENT-GUIDE.md (how to add a project, role, initiative or credential by editing content/ only) and finish README.md. Then read each provider's official pricing page and give me a table of current free-tier limits and any costs, and WAIT for my choice. Do not create accounts, enable billing, buy domains or deploy. I will do each step myself following DEPLOY.md.
```

## 11. Open items and assets

None of these block M0–M2. Each one fills in or unhides a piece of content when it arrives.

- [ ] **1. Your Flood-Aware ownership.** List 4–6 bullets on what *you* built versus Abdullah (e.g. LangGraph agent, GIS pipeline, Next.js frontend, deployment). Also: is Abdullah fine with being named on the site?
- [ ] **2. TechRise '26 details.** The date, venue, your role during the October event (after your term ended on 30 Sep), scale (attendees, speakers, sponsors), 3–6 photos, and the official post link.
- [ ] **3. Credential verify links.** On Coursera, open each certificate and copy its `coursera.org/verify/...` (or `/verify/specialization/...`) link. The org dashboard link needs a login. Also send the Kaggle certificate URL and images of the SMIT, CSS award and Certificate of Excellence certificates.
- [ ] **4. Summer Bootcamp 2026.** What you taught, how many sessions, and the source of the "70+ participants" figure (a registration list, a post or an organizer's statement).
- [ ] **5. GDG and Connected Pakistan.** 1–2 concrete things you did in each role, e.g. sessions you led or a workshop topic.
- [ ] **6. Availability line.** Your wording for the hero, e.g. "Open to AI/ML Engineer roles — remote or Pakistan".
- [ ] **7. Portrait.** A high-resolution headshot, at least 1200px, plain or blurred background. The thesis photo can go on the Flood-Aware case study.
- [ ] **8. Final CV PDF.** Fix the StoryWeave bullet and split the Flood-Aware performance line first (section 1).
- [ ] **9. Degree status.** Conferred, or awaiting results? This decides whether the site says "BS CS, 2026" or "BS CS (2022–2026), results pending".
- [ ] **10. Domain and hosting.** Decided in M9 after Claude Code lists current prices: a free API host, or a paid one only with your approval. A domain is optional and bought by you.
- [ ] **11. Profile cleanups.** Fix the GitHub sidebar LinkedIn link (it points to `/muhammad-ilyas-d14m08`), change the GitHub bio away from "Data Science Freshman", and add READMEs and screenshots to the repos you want in the Lab grid.
- [ ] **12. Optional, high value.** A public notebook reproducing DP-SGD with Opacus on a small dataset. It turns the internship from a claim into something people can see.

## Sources

- [Flood-Aware repository](https://github.com/Muhammad-Ilyas1408/flood-aware) and [CHANGELOG](https://github.com/Muhammad-Ilyas1408/flood-aware/blob/main/docs/CHANGELOG.md)
- [StoryWeave repository](https://github.com/JawadGigyani/StoryWeave) and [Devpost: Story Weave](https://devpost.com/software/story-weave)
- [Inventory System repository](https://github.com/Muhammad-Ilyas1408/inventory-system)
- [GitHub profile](https://github.com/Muhammad-Ilyas1408)
- Your CV (PDF) and Flood-Aware thesis cover photo, provided in chat
