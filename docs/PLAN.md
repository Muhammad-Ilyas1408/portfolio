# Portfolio Build Plan — Muhammad Ilyas

Last updated: Nov 4, 2026 · Owner: Muhammad Ilyas

## 1. How to use this plan

This is the build spec for your portfolio. We plan here, and Claude Code builds from it one milestone at a time. Put a copy at `docs/PLAN.md` in the repo and tell Claude Code to read it before each milestone. Section 10 has a ready-to-paste prompt for every milestone.

**Decisions locked from your Stage 1 answers**

| Topic | Decision |
| --- | --- |
| Flood-Aware | Team FYP with Abdullah Ahmad, supervised by Dr. Asim Jalal. Credit both on the site, and describe only the parts you personally owned (section 2). |
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
- **Deferred to v1.1:** analytics, live GitHub stats, the scroll-drawn timeline (section reveals and ambient motion moved into v1 with M8.6), Lighthouse CI automation, the external link checker, WebKit end-to-end tests, a light theme, and the "Ask about my work" assistant.
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

### Hero copy (self-reported, M2.1)

- **Headline:** "AI/ML Engineer | Generative AI & Agentic Systems | LLM Engineering, RAG & FastAPI | Deep Learning & NLP"
- **Intro:** "I fine-tune LLMs and build grounded, RAG-powered applications with LangGraph, FastAPI and Next.js — and I led the University of Peshawar's Computing Students Society as President (2025–26)."
- **Location:** Pakistan. There is no availability line; it was dropped in M2.1.
- The positioning line in `profile.ts` stays and is used for page metadata.
- **About (M5, self-reported):** one five-sentence paragraph in `profile.about`, from "My journey into AI started during my Computer Science degree…" to "…keep learning." It is shown on `/about`.

### Official profile links

- **Email:** [muhammadilyas.ai.eng@gmail.com](mailto:muhammadilyas.ai.eng@gmail.com)
- **LinkedIn:** <https://www.linkedin.com/in/muhammad-ilyas-ds/>
- **Kaggle:** <https://www.kaggle.com/muhammadilyasm>

### Projects (featured order)

| # | Project | Your role | Status | Evidence | Facts we can show |
| --- | --- | --- | --- | --- | --- |
| 1 | [Flood-Aware](https://github.com/Muhammad-Ilyas1408/flood-aware) | Co-developer, BS CS Final Year Project (team of 2) | Complete, deployed | Repo, changelog, thesis photo, live app | 7 evidence tools; 150 villages and 51 shelters; 348 backend tests passing (53 skipped) in the latest recorded run; golden-set evaluation with real API calls; startup cut from 5–6 min to 39 s; production GIS warm-up about 2 s; data files cut from 147.2 MiB to 4.2 MiB (OSM) and 134.9 MiB to 2.0 MiB (WorldPop) |
| 2 | [StoryWeave](https://github.com/JawadGigyani/StoryWeave) | Full-Stack Developer: Docker, deployment, infrastructure (team of 4) | Complete, demo live | Repo README, [Devpost](https://devpost.com/software/story-weave) | 1st place at HackVortex Codestorm 5; 6-stage LangGraph pipeline (Gemini, ElevenLabs, FFmpeg); deployed with Docker on DigitalOcean |
| 3 | Internship: fine-tuning and DP-SGD | Intern | Done, Jan–Apr 2025 | Self-reported (CV, M5 summary) | Summary: low-resource language model adaptation through LoRA/QLoRA, and DP-SGD with Opacus, focusing on the trade-offs between model performance, training stability and privacy. TinyLlama with Unsloth and LoRA/QLoRA; Opacus DP-SGD with gradient clipping and noise injection. No metrics shown. |
| — | Lab grid: ReAct agent, RAG tools, Personality Search, AI Chatbot, File Intelligence, Spendly, spam classifier | Solo | Mixed | Only Spendly and the spam classifier are public | Each card appears only once its repo is public, labelled *Experiment*, *In progress* or *Concept* |

**Flood-Aware performance, shown as three separate facts:**

- **Per-request GIS collection** went from about 90 s–4 min to about 30 s. This came from caching the parsed data at startup (changelog, Sprint 14.1.5).
- **Regional data extraction** shrank the OSM file from 147.2 MiB to 4.2 MiB and the WorldPop raster from 134.9 MiB to 2.0 MiB. Local startup dropped from 5–6 min to 39 s, with analysis results bit-for-bit identical (Hotfix 14.4).
- **Production GIS warm-up** takes about 2 s on Railway (Sprint 16.1).

**Flood-Aware summary and title (content fixes before M9).** Summary: "LLM-driven multi-source flood monitoring and decision support for the River Swat Basin." Thesis title, shown once in Team & credit: "Flood-Aware: LLM-Driven Multi-Source Flood Monitoring and Decision Support System for the River Swat Basin". The "My role" card adds one line from `roleSummary`.

**Flood-Aware team and your contributions (self-reported).** Team: Muhammad Ilyas and Abdullah Ahmad (no role given for Abdullah), supervised by Dr. Asim Jalal. Your own work, none of it attributed to Abdullah:

- Designed and built the LangGraph decision agent with severity-based tool routing and citation validation
- Built the GIS analysis pipeline (GeoPandas, Rasterio) for population and infrastructure exposure, including regional data extraction and in-memory caching
- Built the ChromaDB RAG pipeline over PDMA/NDMP disaster-management documents with relevance-thresholded retrieval
- Built the Next.js production frontend: Flood Guide, Policy Advisor and Situation Room
- Deployed the FastAPI backend to Railway and the frontend to Vercel, including production CORS hardening
- Wrote the backend test suite and the real-API golden-set evaluation

**StoryWeave role:** confirmed by you as the repo README states it: Full-Stack Developer — Docker, deployment, infrastructure (team of 4).

Sources: [Flood-Aware changelog](https://github.com/Muhammad-Ilyas1408/flood-aware/blob/main/docs/CHANGELOG.md).

### Leadership timeline

All community roles and contributions are self-reported. The President and AI/DS Club Lead roles also carry a verified `WEBSITE` chip linking to the [CSS alumni page](https://cssuop.org/alumni) (M5).

| Period | Role | Organization | What you did |
| --- | --- | --- | --- |
| Oct 2025 – Sep 2026 | President | Computing Students Society (CSS), UoP | Led a team of about 40 students: the presidential council (President, Male Vice President and Female Vice President), the cabinet (Chief Secretary, Information Secretary and Creative Lead), four clubs (AI & DS, Cyber Security, Software Engineering, Literary), and the PR, media, content & graphics and management teams; led the CSS executive team and the Department of Computer Science's student activities as president of the department's official society; organized 18 events during the term, from the Supabase Meetup Peshawar (Nov 2025) to a Pentesting Masterclass (Sep 2026); initiated and planned TechRise '26 (held 22 Oct 2026, 300+ attendees) |
| Dec 2024 – Sep 2025 | AI/DS Club Lead | CSS | Delivered a three-part AI session series (foundations of AI, Machine Learning, Deep Learning); co-led a GitHub session; co-led and taught the CSS AI Bootcamp 2025 (Jun–Aug 2025) |
| Oct 2024 – Jan 2025 | Team Member | Connected Pakistan | Selected as a Connected Pakistan Ambassador, then joined the Connected Pakistan team as a Team Member for the Connected Pakistan Conference 2024 (CPC 2024). One role since the content fixes before M9 (previously two: Ambassador and Team Member). |
| Oct 2024 – May 2025 | Executive Team Member | GDG on Campus, UoP | Co-led a career guidance and LinkedIn session; co-led a New Year session; hosted the Cyber Security and Virtualization session; hosted the Hult Prize 2025: Turning Ideas into Impact session |
| Sep 2023 – May 2024 | AI/ML Team Member | Google Developer Student Clubs (GDSC), UoP — the program's name before it became GDG on Campus | Co-led a LinkedIn session and the GDSC Solution Challenge event |

### Initiatives (self-reported)

Organized by the Computing Students Society. Your role is "Organized as CSS President" unless stated. Every figure is self-reported. ★ = featured.

| Date | Initiative | Format | Focus | Scale |
| --- | --- | --- | --- | --- |
| 22 Oct 2026 | ★ TechRise '26, SSAQ Khan Hall, University of Peshawar. Your role: event lead; you initiated and planned it as CSS President (Aug–Sep 2026) | On campus | Technical | 300+ attendees, 9 speakers, 3 sponsors |
| 3 Sep 2026 | Pentesting Masterclass | Online | Technical | 70+ attendees |
| 4 Jul – 20 Sep 2026 | ★ CSS Summer Bootcamp 2026 (3 tracks). Your role: instructor, AI & Data Science track | Online | Technical | 70+ students across 3 tracks (AI & Data Science, Web Development, Cyber Security); 35+ students in the 9-week AI & Data Science track |
| 21–22 May 2026 | Prompt Engineering Bootcamp (2 days) | Online | Technical | 80+ attendees |
| 19 May 2026 | CSS × SMIT: Free IT Courses Session | On campus | Career | 120+ attendees |
| 11 May 2026 | One Year of Glory: Alumni Reunion. Your role: speaker (as CSS President) | On campus | Community | 100+ attendees |
| 5 May 2026 | Turn Your Skills Into Income | On campus | Career | 100+ attendees |
| 10 Apr 2026 | LinkedIn Optimization Masterclass | Online | Career | 90+ attendees |
| 7 Apr 2026 | Step into App Development | Online | Technical | 60+ attendees |
| 4 Apr 2026 | From Open Source to Google DeepMind | Online | Career | 50+ attendees |
| 1 Apr 2026 | From Zero to GitHub Hero | Online | Technical | 60+ attendees |
| 11 Mar 2026 | Purpose of Life & Ramadan + Seerat Quiz. Your role: co-delivered (as CSS President) | On campus | Community | 60+ attendees |
| 5 Mar 2026 | Guidance Session with Fresh Juniors. Your role: speaker (as CSS President) | On campus | Community | ~300 attendees |
| 16 Feb 2026 | Build Your First Website | Online | Technical | 55+ attendees |
| 24–25 Jan 2026 | Workflow Automation with n8n (2 days) | Online | Technical | 50+ attendees |
| 3 Jan 2026 | Your 1st Step into AI | Online | Technical | 60+ attendees |
| 29 Dec 2025 | Web Development: What to Learn, When, Why | Online | Technical | 100+ attendees |
| 23–28 Nov 2025 | Sports Fest 2025–26. Your role: chief organizer (as CSS President) | On campus | Community | 700+ participants |
| 13 Nov 2025 | Supabase Meetup Peshawar | On campus | Technical | 100+ attendees |
| Jun – Aug 2025 | ★ CSS AI Bootcamp 2025, held during the AI/DS Club Lead term. Your role: lead and instructor | Online | Technical | 30+ students |

- **TechRise '26:** a youth-focused tech event by the Computing Students Society, Department of Computer Science, connecting students across Khyber Pakhtunkhwa and beyond while creating opportunities for youth from the Newly Merged Districts. Promoted by the Directorate of Youth Affairs, Khyber Pakhtunkhwa. Theme: Learn · Connect · Rise. Photos: banner, audience, panel and keynote, in `apps/web/public/images/events/techrise-26/`.
- **CSS Summer Bootcamp 2026:** you taught Machine Learning, Deep Learning and NLP and judged the final Project Exhibition; you co-delivered the AI & Data Science track with Abdullah Ahmad, Muhammad Jawad and Abubakar Saddiq, supervised by Dr. Waheed Ur Rehman. Participants came from the department and other universities.
- **Summaries added in M5:** Sports Fest (six-day festival: cricket, futsal, badminton, traditional Pashto games, chess, e-sports), Supabase Meetup Peshawar (co-hosted with Supabase Peshawar, TechKhwa as community partner), Guidance Session (class-to-class visits across all five programs), Alumni Reunion (graduation ceremony honouring the 2024–25 chapter), CSS × SMIT (free IT and AI courses awareness), Pentesting Masterclass (with SheTech, live bug bounty hunting).
- **Sponsors:** TechRise '26 shows "3 sponsors" and never names them (owner decision, M5).
- **Event photos (M5 follow-up):** Supabase Meetup `talk.jpg` and `audience.jpg`, and Sports Fest `teams.png` and `trophies.jpg`, are shown. The owner confirmed `teams.png` is correct (the prompt listed `teams.jpg`).

### Chapter 2 in numbers (self-reported)

Shown on `/leadership` as "My presidency in numbers (2025–26)", with the intro line "Computing Students Society, University of Peshawar, during my term as President (Oct 2025 – Sep 2026)." and the source line "Source: CSS Progress Report 2025–26 (submitted Sep 2026) · Self-reported". A muted line under it, linking to the events section: "The All events and programmes section below also includes the CSS AI Bootcamp 2025 (before my term) and TechRise '26 (after the report)." Every role contribution ends with a full stop.

Source: "CSS Chapter 2 Progress Report 2025–26 (submitted Sep 2026)", named but not linked. 18 events and programmes (11 online, 7 on campus) · 2,200+ total attendances (cumulative) · 14 guest speakers · 4 partner organizations: Supabase Peshawar, TechKhwa, SMIT and SheTech · ~300 freshers reached through class-to-class visits.
- **CSS AI Bootcamp 2025:** you co-led and delivered an end-to-end AI learning program from Python fundamentals to Machine Learning and Agentic AI. You taught Python programming, NumPy, Pandas and Machine Learning, led academic planning (curriculum, assignments, quizzes, assessments and evaluation), and supervised the final student projects. Participants came from the department and other universities.

### Awards and credentials

Replaced in full in M5. CSS certificates are issued by "Computing Students Society & Department of Computer Science, University of Peshawar"; their photos are in `apps/web/public/images/awards/`.

| Item | Kind | Evidence |
| --- | --- | --- |
| BS Computer Science, University of Peshawar, 2022–2026, completed Nov 2026 | Degree | Self-reported; shown with the Flood-Aware FYP |
| Award of Appreciation — President, CSS Chapter 2025–26 (Oct 2026, presented at TechRise '26) | Award | Self-reported; shield photo and presentation photo |
| Certificate of Recognition — President, CSS (2025–26) | Award | Self-reported; certificate photo |
| Certificate of Excellence — CSS (2025–26) | Award | Self-reported; certificate photo |
| Certificate of Recognition — AI & DS Club Lead, CSS (2024–25) | Award | Self-reported; certificate photo |
| Certificate of Excellence — CSS (2024–25) | Award | Self-reported; certificate photo |
| Appreciation Award — Connected Pakistan Conference 2024 (CPC 2024), Connected Pakistan; no date (the certificate shows none) | Award | Self-reported; photo of the framed award |
| HackVortex Codestorm 5, 1st place (StoryWeave, team of 4) | Award, team | **Verified** (Devpost) |
| Certificate of Participation — HackVortex Codestorm #5, HackVortex, Oct 2025 ("Presented for an outstanding project") | Certificate | Self-reported; certificate photo. Not an award; the 1st place rests on Devpost |
| Machine Learning Specialization (DeepLearning.AI & Stanford); Deep Learning Specialization (DeepLearning.AI); Generative AI Engineering with LLMs Specialization (IBM) | Specialization | Coursera share links |
| Generative AI Essentials: Overview and Impact, Python Basics, Python Functions, Files, and Dictionaries (University of Michigan); AI For Everyone (DeepLearning.AI); Foundations of Data Science, AI for Brainstorming and Planning (Google) | Course | Coursera share links |
| AI Foundations: How Artificial Intelligence Works; Data Science Foundations: Tools, Careers & Real-World Applications; Python for Data Science & AI: Hands-On Development (IBM) | Course | Coursera share links (issuer confirmed and published in M6) |
| Python Programming (Batch-01), Saylani Mass IT Training (SMIT), Saylani Welfare International Trust, Jan–Aug 2024 (8 months) | Training | Self-reported, no link or image |

Removed in M5: Kaggle Intro to Machine Learning, and IBM "Generative AI and LLMs: Architecture and Data Preparation".

## 3. Brand and visual identity

**Positioning line (M8.6 copy pass, owner to review):** *I build LLM-powered and agentic systems, and I led the Computing Students Society at the University of Peshawar.* It is the footer line; page metadata now uses the hero tagline plus the first intro sentence. Previously: *AI/ML Engineer building grounded, agentic systems — and the communities that build them.*

**Concept: "Signal and Ember."** The site's two halves get two accent colors that never compete. **Signal** (violet since M8.6; teal before) marks engineering work: projects, skills, experience, code. **Ember** (lime since M8.6; amber before) marks people work: leadership, community, teaching, awards. A visitor learns the code in seconds. Violet means *what he built*, lime means *who he built it with*. Pages that join both, like About and the hero, use both accents sparingly.

**The evidence system is the signature.** Every claim gets a small mono chip: `REPO`, `LIVE`, `DEVPOST`, `CERT`, `CHANGELOG`, `THESIS` or `WEBSITE`. Each chip links to its proof. Verified chips get a green dot; self-reported items get no chip. This turns Flood-Aware's "never fabricate" principle into the site's identity.

### Color tokens (dark theme, the default)

**M8.6 palette A (owner-chosen, 2026-11-07):** ink-violet surfaces, violet for engineering (`signal`), lime for leadership and community (`ember`). **Lime rule (M8.6 follow-up, owner decision):** lime may be used for accent phrases in display headings (e.g. "leading the Computing Students Society." on `/leadership` and the home leadership band) and for leadership stats, links and small details; never for body paragraphs or large filled areas (buttons stay violet). The hero tagline's second line ("Creating Real-World Impact") recreates the palette A preview exactly: a plain sRGB `linear-gradient(90deg, signal, ember 85%)`, so it is violet on "Creating", a soft transition over "Real-" and full lime on "World Impact"; each wrapped line on a phone gets the full run, and it is solid violet where `background-clip: text` is unsupported (owner decision, M8.6 follow-up 3). The portrait ring (`portrait-ring`, a circular head-and-shoulders crop on the home hero and `/about`, owner choice in the pre-M9 polish) is the second plain-sRGB violet → lime gradient, because in oklch it turns teal. Every other colour gradient interpolates in oklch, so none turns grey in the middle; FlowLines stay violet → lavender. The M1 teal/amber values are replaced.

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | #0A0A14 | Page background (ink violet); also `theme-color` |
| `surface` | #12121D | Cards, panels |
| `surface-raised` | #191927 | Hover, modals, active cards |
| `surface-warm` | #0F0F18 | Home leadership band (a neutral ink lift; lime comes only from its glow and details) |
| `border` | #26263B | Hairlines, dividers |
| `text` | #EDEDF3 | Body and headings (16.9:1 on bg) |
| `text-muted` | #8F8FA9 | Metadata, captions (6.3:1 on bg, 5.5:1 on surface-raised) |
| `signal` | #A08CFF | Engineering accent: links, highlights, focus rings, primary buttons (7.2:1 on bg) |
| `signal-soft` | #A08CFF at 10% | Engineering tints, chip backgrounds |
| `ember` | #C4F042 | Leadership accent (lime): timeline nodes, leadership stats and links (14.9:1 on bg) |
| `ember-soft` | #C4F042 at 8% | Leadership tints |
| `verified` | #34D399 | Verified dot and the Live pill; distinct from both accents (10.2:1) |
| `danger` | #F87171 | Errors only (7.1:1 on bg) |
| `danger-soft` | #F87171 at 10% | Error panel background |
| `flow-a` / `flow-b` | #7B5CFF / #D4C8FF | FlowLines and background glows: deep violet to lavender (decorative) |

Rules: an accent stays under about 10% of any screen; only bg-colored text may sit on a full-strength accent fill, and only on primary buttons; focus rings use `signal` everywhere. Danger is used only for errors. A light theme comes from the same token names in phase 2. The tokens make it a one-file change.

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
- **Motion (M8.6, owner-approved; replaces "hover and focus only"):** allowed are (a) an ambient background of thin flowing lines behind the home hero and the CTA band, with a calmer variant behind `PageHero` on inner pages; (b) a one-time gentle reveal of section headers and card grids as they scroll in (fade plus a rise of at most 16px, at most 500ms, small stagger); (c) a pointer-follow glow ("spotlight") on cards and primary buttons; (d) hover and focus transitions (150ms color and border changes, a 2px lift on cards). Required: all of it off or static under `prefers-reduced-motion`; animations pause when off-screen (IntersectionObserver) or when the tab is hidden; content is fully visible with JS disabled (the reveal only enhances); no layout shift (CLS 0); Lighthouse at 1× stays at 95 or above; no animation library (CSS, SVG or a tiny canvas only); no count-up numbers, carousels or marquees. The scroll-drawn timeline stays deferred to v1.1.
- **Banned:** skill bars and percentages, typing-effect headlines, particle backgrounds, cursor followers (the M8.6 card/button spotlight is a glow inside the element, not a follower), count-up numbers, carousels, marquees, and any counters for numbers we can't source.

## 4. Information architecture

The home page is a fast overview that previews everything. Each area also gets its own page with full depth. Recruiters skim the home page in 60 seconds, and engineers and collaborators click through to the detail.

```text
Sitemap
/                      Home (previews every section)
├── /projects          All work (Signal / teal)
│   ├── /projects/flood-aware
│   └── /projects/storyweave
├── /experience        Internship (Signal / teal)
├── /leadership        Timeline (Ember / amber)
├── /credentials       Certificates
├── /about             Journey
├── /contact           Form + email
└── /cv.pdf            Static file
```

**M8.5 update (owner prompt):** the header is sticky with a "MI" mark; the desktop nav is Work · Experience · Leadership · Credentials · About with a filled **Contact** button (Download CV moved to the hero, mobile menu and footer). The footer has four columns (Navigate · Work · Community · Connect; no Kaggle, owner decision) and a bottom row "© year Muhammad Ilyas" / "Built with Next.js & FastAPI · Source on GitHub". The text below is the original M1 spec.

**Main navigation (desktop):** Work · Experience · Leadership · Credentials · About, with a Contact link and a filled "Download CV" button on the right. On mobile it becomes a full-width disclosure panel (not a sheet) with the same links in the same order and the CV button. The active page is marked with `aria-current="page"`.

**Footer:** email, GitHub, LinkedIn, Kaggle, a "Source on GitHub" link, and the current year.

**Other routes:** `/projects/[slug]` for each case study, `/cv.pdf` (a static file), a custom 404 page, `sitemap.xml`, `robots.txt`, the generated `icon` and `apple-icon`, a default generated Open Graph image, and one per case study (M8).

## 5. Page-by-page UX spec

### Home `/`

Every fact comes from `content/` (`profile.ts`, `home.ts`, `projects.ts`, `roles.ts`, `initiatives.ts`, `credentials.ts`).

**M8.5 A replaced the layout below** (owner prompt): hero (eyebrow "Muhammad Ilyas · AI/ML Engineer", h1 "Building Generative AI & agentic systems" with "agentic systems" in signal, intro, the last two headline segments as tags, View projects · Download CV · Leadership & community →, framed portrait) → stats row (2 live AI projects · 1st place · 3 Coursera specializations · 2025–26 President; counts are checked against content, text stats are split from existing claims; 348 tests and 7 evidence tools stay on the Flood-Aware case study) → "Where I've worked and led" (orgs from community and industry roles only) → 01 What I build (4 owner-provided capabilities) → 02 Featured work (case-study cards; until `Project.cover` is set the cover is a decorative diagram of the first architecture steps and the stack, without the project name; plus the internship row) → 03 How I work (the principles as numbered cards) → 04 Leadership band (ember, 4 self-reported stats, TechRise '26 photo) → 05 Awards and recognition (4 award photos) → contact CTA band. Page metadata still uses the name. The M3 text below is kept for history.

1. **Hero.** A mono label `AI/ML ENGINEER` (no city or country), then the h1 with your name. Below it, a mono role line built from `profile.headline`: the first segment ("AI/ML Engineer") is dropped and the rest are joined with " · ". Then the intro paragraph (`profile.intro`, max 68ch). Buttons: **View work** (filled, `/projects`), **Download CV** (outline, `/cv.pdf`, downloads) and **Contact** (ghost, `/contact`). On desktop your portrait sits on the right in a rounded-square frame with a thin signal border; on mobile it sits above the label at a modest size. With no portrait, the hero is a single column with no placeholder. A faint dot grid sits behind the hero only. There is no availability chip (dropped in M2.1).
2. **Proof strip.** Four facts with no counters, in a compact row (2×2 on mobile): "Flood-Aware — live, 348 backend tests passing" (verified, Changelog) · "HackVortex Codestorm 5 — 1st place" (verified, Devpost) · "President, Computing Students Society 2025–26" (self-reported) · "AI/ML Engineering Intern — LLM fine-tuning and DP-SGD" (self-reported). Verified items show an evidence chip linking to their proof; self-reported items show no chip.
3. **Featured work (`01 — Work`, signal).** One large Flood-Aware card: title, summary, role, status pill, up to 6 stack chips, the results marked `highlight` (348 backend tests · production GIS warm-up about 2 s on Railway · 7 evidence tools) with evidence chips, and links to the case study, the live site and the repo. Then two smaller cards: StoryWeave (same structure, compact) and the internship (title, org, dates, contributions, link to `/experience`). A link reads "All projects →".
4. **Leadership preview (`02 — Leadership`, ember).** A progression, horizontal on desktop and vertical on mobile, oldest to newest: GDSC AI/ML Team Member (2023–24) → GDG on Campus Executive Team Member (2024–25) → CSS AI/DS Club Lead (2024–25) → CSS President (2025–26). Below it, cards for the 3 featured initiatives (TechRise '26 with its banner photo, CSS Summer Bootcamp 2026 (3 tracks), CSS AI Bootcamp 2025): name, date, your role and stats (labelled self-reported). A link reads "See the full story →".
5. **Credentials row (`03 — Credentials`).** Only published credentials: the degree and the HackVortex Codestorm 5 award, whose "Verify ↗" link goes to its proof. A link reads "All credentials →".
6. **Contact band.** "Building something with LLMs, or running a tech community? Let's talk." Buttons: **Email me** (filled, mailto) and **Contact form** (outline, `/contact`).

**M8.5 B update (owner prompt), applies to every inner page below:** each page opens with a shared `PageHero` (eyebrow, display h1, intro, optional meta row and actions, light backdrop; teal, ember on Leadership) and uses numbered `PageSection`s. `/projects` reuses the home case-study cards (generated architecture cover until `Project.cover` is set). Case studies: back link, eyebrow (type · period) with status pill, meta row (role, team, supervisor, period), Live/Repo/Devpost buttons and a wide architecture cover; then At a glance → Results (claims with a `stat` split shown as numerals with their evidence chips; others as a list) → Architecture → Key decisions → Hard problems → What I'd do next → Team & credit, an "On this page" list from 1280px, prev/next cards and the home contact band. `/experience` and `/leadership` use a shared `Timeline`; Leadership's h1 is its existing intro line and the presidency figures come first, as an ember stat grid. `/credentials`: degree card, award and certificate image cards (whole image, never cropped; a lone image or an award without one shows as a full-width row), specialization cards, hairline rows for courses and training. `/about`: hero with the framed portrait. `/contact`: h1 "… Let's talk.", form in a card, direct links in a card. Content: `Claim.stat` (value must appear in the claim text), every presidency figure needs one (build check); `links.kaggle` is optional and unset (owner decision). The sections below keep the original specs for history.

### Projects `/projects`

- No filter chips in v1: with two projects they add nothing. Deferred until there are enough projects to filter (All · Agentic/RAG · Full-stack · ML, synced to `?tag=`).
- Each card reuses the home `ProjectCard`: title, summary, role, status pill, stack chips, the highlighted results with evidence chips, and links to the case study, live site and repo.
- Each card shows a title, one-line problem, role ("BS CS Final Year Project (team of 2)"), stack tags in mono, a status pill (*Live* · *Complete* · *In progress* · *Experiment* · *Concept*) and evidence chips.
- A **Lab** section at the bottom holds a compact list for smaller public repos. It renders nothing until one is published.

### Case study `/projects/[slug]` (the template every project uses)

Every fact comes from `content/projects.ts` and `content/case-studies.ts`. Sections with nothing to show are left out, and the rest are numbered in order.

1. Header: title, the project summary, role, dates, a status pill, and buttons for Live demo, Repo and Devpost (only those the project has).
2. **At a glance:** a 4-cell grid covering Problem · Approach · My role · Outcome.
3. **Architecture:** a static, accessible inline SVG built from `architecture.steps` (`role="img"`, with an `aria-label` summarizing the flow; theme tokens only), drawn as two numbered rows. A numbered list below gives each step's description. Nothing is hidden behind hover. Below 1024px the SVG is hidden and the list carries the content alone, so there is no horizontal scroll.
4. **Key engineering decisions:** 3–5 cards, each following *Decision → Why → Trade-off*, with an evidence chip naming the README section or CHANGELOG entry it comes from. StoryWeave has none: its README gives no reasons or trade-offs.
5. **Hard problems solved:** up to 3 short debugging stories (*Symptom → Root cause → Fix*), each with its CHANGELOG evidence. For Flood-Aware: the evidence-reuse regression (Hotfix 20), the missing forecast-discharge mapping (Hotfix 21) and shelter-proximity matching (Hotfix 22).
6. **Results:** every project result as a claim; verified ones carry their evidence chip.
7. **Team and credit:** names everyone ("Team of 2: … · Supervised by …", or a member list when roles are known), and separates *What I did* (`myContributions`, verbatim) from *What the team did* (`teamOutcomes`). An empty list renders nothing.
8. **What I'd do next:** honest limits stated in the sources only.
9. Previous and next project links, in project order (no wrap-around).

Unknown slugs return a 404 (see section 7, Rendering). Page title: "<Project> — Case study · Muhammad Ilyas"; description: the project summary.

### Experience `/experience` (signal)

As built in M5. Two sections, left out when empty:

1. **Industry:** the internship card — title, organization, dates, `summary`, "What I did" (`myContributions`) and a "DP-SGD in three sentences" explainer box (`content/about.ts`; a general description of the technique, no claims about the company's results). No company code or metrics.
2. **Teaching:** CSS AI Bootcamp 2025 and "CSS Summer Bootcamp 2026 — AI & Data Science track": dates, role, stats (self-reported), summary, and a link to the event's row at `/leadership#<id>`.

A link to a public DP-SGD demo notebook can be added later if you build one.

### Leadership `/leadership` (the ember page)

As built in M5. Sections are numbered and left out when empty.

1. Intro: "From a GDSC team member to leading the Computing Students Society."
2. **Progression:** vertical, newest first, static. Each community role shows title, organization, dates, `myContributions` (empty → nothing) and evidence chips.
3. **Chapter 2 in numbers:** the five `chapter.ts` stats with the source line "Source: … · Self-reported" (not linked).
4. **Featured initiatives:** TechRise '26 (date, venue, role, summary, stats, 4-photo gallery), then short cards for the two bootcamps linking to `/experience#teaching`.
5. **All events and programmes:** a table of every published initiative, newest first (date, event with summary, format, focus, attendance, my role). The 8 newest show; the rest sit in a native `<details>` "Show all N events" (M8), which opens by itself when the URL hash targets an event inside it. Rows with photos get a "Photos (n)" disclosure. Each row's `id` is its anchor (`initiativeId`, e.g. `/leadership#techrise-26`). Below 1024px the table stacks into cards with inline labels.
6. **Recognition:** the Award of Appreciation with its shield photo and "See all awards →" to `/credentials#awards`.

### Credentials `/credentials`

As built in M5. Groups in this order, each with an anchor: **Degree** (`#degree`) · **Awards** (`#awards`) · **Specializations** (`#specializations`) · **Courses** (`#courses`) · **Training** (`#training`). Empty groups are left out; unpublished items never render. Awards show a thumbnail (`next/image`) that opens the full image in a new tab, plus title, issuer, date and note; extra photos are text links. Specializations and courses show "Verify ↗" (signal). Training shows its period and length. The degree shows its years, completion month, and the Flood-Aware FYP with its supervisor. Note under the heading (M8.6 copy pass): "Each certificate links to its issuer's verification page. My degree is listed with my final-year thesis."

### About `/about`

As built in M5.

- **Header:** portrait and the one-paragraph `profile.about` (replaces the planned 3 story paragraphs).
- **Engineering principles:** 3 cards. 1) Ground every claim in evidence → `/projects/flood-aware#citation-validation`. 2) Verify with real systems, not just mocks → `#golden-set`. 3) Fix root causes, not symptoms → `#hard-problems`. The build fails if an anchor does not exist.
- **Skills:** grouped as in `skills.ts`. A skill with `usedIn` shows "Used in: Flood-Aware" (or "Internship" → `/experience#industry`) as links; others are listed plainly, with no "Familiar" label.
- **Education:** the degree card with the FYP title (linking to its case study) and supervisor.

### Contact `/contact`

Signal accent. Title "Contact · Muhammad Ilyas"; description `profile.positioning`. Intro (M8.6 copy pass): "Building something with LLMs, or running a tech community? Send a message and I'll reply by email." The form is on the left; a "Direct links" panel (Email, LinkedIn, GitHub, Download CV, from `profile`) sits on the right from 1024px and below the form on smaller screens.

- **Fields:** Name (2–80), Email, Reason (a "Choose a reason" placeholder, then Job opportunity · Collaboration · Speaking or community · Other), and Message (20–5000, with a live "n / 5000" counter that counts characters the way the API does). A honeypot field `website` ("Leave this field empty") is visually hidden, `aria-hidden`, `tabIndex -1` and `autoComplete="off"`.
- **Validation:** client-side with the shared Zod schema on submit, then live as the visitor fixes fields. Each field has a visible label; errors appear under it with `aria-invalid` and `aria-describedby`, and the first invalid field gets focus. A 422 from the API maps onto the matching fields (first one focused); errors for other keys (e.g. `body`) show as a general error.
- **Sending:** the button shows a spinner, "Sending…", `aria-busy` and is disabled. Requests time out after 15 seconds.
- **States** (announced through an `aria-live="polite"` region): 202 replaces the form with a success panel ("Thanks — your message is on its way. I'll reply by email.") that receives focus, with a "Send another message" button that resets the form and focuses Name · 429 → "You've sent several messages recently. Please try again in N minutes." (from `Retry-After`, rounded up; "a few minutes" if missing) · 413 → "Your message is too long. Please shorten it." · 503, any other status, a network error or the timeout → "The message service is unavailable right now." with a mailto link whose subject is "Portfolio contact: <reason label>" (no body).
- **No API URL:** if `NEXT_PUBLIC_API_URL` is missing at build time, the form is disabled and shows the same unavailable message and mailto link.
- **Privacy:** form contents are never logged or stored in the browser.

### States every page handles

Loading skeletons appear only where data loads at runtime, which is just the contact form. Empty states cover a filtered project list with no results, once filters exist (v1.1). A broken image falls back to a monogram. The 404 page links back to Work and Home.

## 6. Content model

All content lives in typed files under `apps/web/content/`. Zod schemas check every file at build time, so a missing field or a proof-less "verified" claim fails the build. Case studies are structured TypeScript too (`case-studies.ts`), not MDX; see section 7. To update the site, you edit content files only and never touch components.

```ts
// content/schema.ts — the single source of truth for content shape
const HttpsUrl = z.url({ protocol: /^https$/ });
const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/); // "YYYY-MM"; unknown months stay empty
const EventDate = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/); // "YYYY-MM-DD" or "YYYY-MM"; the day must exist

export const Evidence = z.object({
  kind: z.enum(['repo', 'live', 'devpost', 'cert', 'changelog', 'thesis', 'post', 'photo', 'website']),
  label: z.string(),
  url: HttpsUrl,
});

export const Claim = z.object({        // any number or result shown on the site
  text: z.string(),                    // "348 backend tests passing"
  evidence: Evidence.optional(),       // required when status === 'verified'
  status: z.enum(['verified', 'self-reported']),
}).refine(c => c.status !== 'verified' || !!c.evidence, 'verified claims need evidence');

export const Project = z.object({
  slug: z.string(), title: z.string(), summary: z.string(),
  role: z.string(),
  team: z.array(z.object({ name: z.string(), role: z.string().optional() })).default([]),
  supervisor: z.string().optional(),
  period: z.object({ start: YearMonth.optional(), end: YearMonth.optional() }).optional(),
  status: z.enum(['live', 'complete', 'in-progress', 'experiment', 'concept']),
  tags: z.array(z.enum(['agentic-rag', 'full-stack', 'ml', 'fundamentals'])),
  stack: z.array(z.string()),
  myContributions: z.array(z.string()).default([]), // what I did
  teamOutcomes: z.array(z.string()).default([]),    // what the team did
  results: z.array(Claim).default([]),
  links: z.array(Evidence).default([]),
  featured: z.boolean(), order: z.number().int(),   // slugs and orders are unique across projects
});

export const CaseStudy = z.object({    // matched to its project by slug; one per project at most
  slug: z.string(),                    // must match a project's slug (checked at build time)
  problem: z.string(), approach: z.string(), outcome: z.string(), // one sentence each, for "At a glance"
  architecture: z.object({
    steps: z.array(z.object({ id: z.string(), label: z.string(), description: z.string() })).min(4).max(8), // ordered pipeline stages; ids unique
  }),
  decisions: z.array(z.object({ anchor: z.string().optional(), decision: z.string(), why: z.string(), tradeoff: z.string(), evidence: Evidence })), // none, or 3–5
  hardProblems: z.array(z.object({ title: z.string(), symptom: z.string(), rootCause: z.string(), fix: z.string(), evidence: Evidence })).max(3), // evidence required
  limitations: z.array(z.string()).default([]), // "What I'd do next": honest limits stated in the sources only
});
// Every decision and hard problem must trace to a specific README section or CHANGELOG entry,
// named in its evidence label (e.g. kind "changelog", label "Hotfix 14.4" → chip name "CHANGELOG: Hotfix 14.4").

export const Role = z.object({
  org: z.string(), title: z.string(), start: YearMonth, end: YearMonth.optional(),
  track: z.enum(['community', 'industry']),
  summary: z.string().optional(),
  myContributions: z.array(z.string()).default([]),
  teamOutcomes: z.array(z.string()).default([]),
  evidence: z.array(Evidence).default([]),
  published: z.boolean(),
});

export const Initiative = z.object({ // events, bootcamps and workshops
  name: z.string(),
  org: z.string().default('Computing Students Society'),
  start: EventDate, end: EventDate.optional(),   // end is never before start
  format: z.enum(['online', 'on-campus']),
  focus: z.enum(['technical', 'career', 'community']),
  venue: z.string().optional(),
  myRole: z.string(),
  summary: z.string().optional(),
  stats: z.array(Claim).default([]),             // self-reported unless they carry evidence
  featured: z.boolean(),
  photos: z.array(z.object({ src: z.string(), alt: z.string() })).default([]), // src is a path under apps/web/public
  evidence: z.array(Evidence).default([]),
  published: z.boolean(),
});
// getInitiatives(): published only, newest first (by start, then end). getFeaturedInitiatives(): the featured subset.

export const Credential = z.object({
  name: z.string(), issuer: z.string().optional(), date: YearMonth.optional(), // issuer required once published
  years: z.string().regex(/^\d{4}–\d{4}$/).optional(), // a span known only in whole years
  period: z.object({ start: YearMonth, end: YearMonth }).optional(),
  kind: z.enum(['degree', 'specialization', 'course', 'training', 'award']),
  note: z.string().optional(),          // e.g. "Presented at TechRise '26"
  verifyUrl: HttpsUrl.optional(),
  photos: z.array(Photo).optional(),    // the first is the thumbnail
  published: z.boolean(),               // false until proof exists
});
// getCredentialGroups(): Degree · Awards · Specializations · Courses · Training, published only, empty groups dropped.

export const Chapter = z.object({      // content/chapter.ts
  title: z.string(),
  source: z.object({ label: z.string(), url: HttpsUrl.optional() }),
  stats: z.array(Claim).min(1),
});

export const Principle = z.object({ title: z.string(), href: z.string(), linkLabel: z.string() }); // content/about.ts; anchor checked at build
export const Explainer = z.object({ title: z.string(), sentences: z.array(z.string()).length(3) });  // content/about.ts
```

`Photo` is `{ src, alt }` (src under `apps/web/public`), shared by initiatives and credentials. `Profile` also has `about`. Initiative anchors come from `initiativeId(name)` and must be unique (checked at build).

**Files:** `profile.ts` (name, title, headline, intro, about, positioning for metadata, location, links), `chapter.ts`, `about.ts` (principles, DP-SGD explainer), `projects.ts`, `roles.ts`, `initiatives.ts`, `credentials.ts`, `skills.ts` (each skill lists the project slugs where it was used), and `case-studies.ts`.

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

- **Next.js 16 (App Router), TypeScript in strict mode, Tailwind CSS v4.** No UI component library in v1; primitives are hand-built and accessible (the mobile menu is a disclosure, not a dialog). Every component is our own, so the site doesn't look like a template.
- **Rendering:** all routes are statically generated from the content files. v1 fetches no data at runtime. Repos appear as plain links, and live GitHub stats are deferred to v1.1.
- **Proxy (one, added in M4):** `apps/web/proxy.ts`, matching `/projects/:slug` only. It rewrites a slug with no case study to the 404 page before rendering, so unknown project URLs return a real `404` status. It is needed because, with Cache Components on, `dynamicParams` is unavailable and an unknown slug would otherwise stream the page shell with a `200` before `notFound()` runs. It reads the slug list from `content/` and does no other work; every page stays statically generated.
- **Case studies are TypeScript, not MDX (changed in M4).** Each case study is structured data (`content/case-studies.ts`, validated by the `CaseStudy` schema), so every decision and hard problem carries required evidence and the template renders it consistently. No MDX dependency is needed.
- **Contact form (added in M7):** a client component (`components/contact/ContactForm.tsx`) using `react-hook-form` with `@hookform/resolvers/zod`. The shared contract in `lib/contact.ts` (reasons, limits, a Zod schema mirroring `POST /contact`, error mapping, `submitContact`) is the only place the API shape is described on the frontend. It POSTs JSON to `${NEXT_PUBLIC_API_URL}/contact` with a 15-second timeout. `NEXT_PUBLIC_API_URL` is inlined at build time; without it the form renders disabled with a mailto link. Playwright sets it to `http://localhost:8000` for the build, and every e2e request to it is mocked.
- **Security headers (built in M8):** `next.config.ts` sets these on every route (`/:path*`), from `lib/security-headers.ts`:
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' <API origin>; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`. `<API origin>` is the origin of `NEXT_PUBLIC_API_URL`, read when `next build` runs (headers are fixed at build time), so on Vercel the variable must be set before the build. `pnpm dev` adds `'unsafe-eval'` to `script-src` (React's dev overlays need it); production never has it.
  - **Why `'unsafe-inline'` for scripts and styles:** every page is prerendered. The Next.js 16 docs say nonces need dynamic rendering on every request, and they don't work with Partial Prerendering/Cache Components, which this site uses. A static page carries Next.js's inline RSC payload scripts, and `next/image` writes inline `style` attributes, so `'unsafe-inline'` is the documented option without nonces. The risk is limited: the site renders no user-generated HTML, loads no third-party scripts, and the CSP still blocks eval, foreign script origins, framing, `<base>` and plugins. The experimental SRI mode was not used, since it does not cover the inline scripts.
  - The contact form runs Zod with `z.config({ jitless: true })` (`lib/contact.ts`), so Zod never probes `new Function`, which would be reported as a CSP violation.
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **Site URL (M8):** `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`; set on Vercel in M9) feeds `metadataBase`, canonicals, Open Graph URLs, the sitemap, robots and JSON-LD (`lib/site.ts`).
- **Motion:** CSS transitions plus three small client components from M8.6 (`FlowLines` canvas, `Reveal`, `Spotlight`); no animation library.
- **Images:** `next/image` serves AVIF/WebP. Your portrait is at most 1200px at the source.
- **SEO (built in M8):**
  - **Metadata:** each route calls `pageMetadata()` (`lib/seo.ts`) for its own title, description, canonical, Open Graph (title, description, url, type `website`, or `article` on case studies, site name, image) and a `summary_large_image` Twitter card. Next.js merges `openGraph` shallowly, and a page that sets it loses the parent's file-based image, so every page names its image explicitly. The 404 has no canonical and is noindex; `/styleguide` stays noindex.
  - **Open Graph images** (`ImageResponse`, 1200×630, design tokens from `lib/tokens.ts`, which a unit test keeps equal to `globals.css`): `app/opengraph-image.tsx` is the default (name, "AI/ML ENGINEER", headline segments, positioning line) and `app/projects/[slug]/opengraph-image.tsx` is per case study (title, summary, "CASE STUDY"). Both are prerendered at build time. The fonts are static TTF copies of Bricolage Grotesque, Inter and JetBrains Mono in `apps/web/assets/fonts/` (SIL OFL), because `ImageResponse` cannot read `next/font`'s WOFF2.
  - **Icons:** `app/icon.tsx` (32×32) and `app/apple-icon.tsx` (180×180), an "MI" monogram in Bricolage, signal on bg. The scaffold `favicon.ico` is gone.
  - **`sitemap.ts`** lists the nine public routes (no `lastModified`: the content has no reliable per-page dates); **`robots.ts`** allows all, disallows `/styleguide` and names the sitemap.
  - **JSON-LD** (`lib/json-ld.ts`, rendered server-side): a `Person` in the root layout (name, jobTitle, url, portrait image, email, `alumniOf` from the degree's issuer, `sameAs` GitHub, LinkedIn, Kaggle), and a `CreativeWork` on each case study (name, summary, url, `sameAs` repo/live/Devpost links). Its `author` is the Person (by `@id`) plus every other team member by name, so team projects are not credited to one person. `codeRepository` is not a `CreativeWork` property, so the repo goes in `sameAs`.
- **Leadership events toggle (M8):** "All events and programmes" shows the 8 newest events; the rest sit in a native `<details>` ("Show all N events"), as a second table with the same columns. A hash pointing at a hidden event (e.g. `/leadership#css-ai-bootcamp-2025` from `/experience`) opens the disclosure through a small client effect (`OpenTargetDetails`).
- **Performance (M8):** the hero's Contact button does not prefetch `/contact`. On a phone it is in the first viewport, and prefetching loaded the form's JS (react-hook-form, Zod) during start-up, adding about 0.35 s of blocking time on home.
- **Analytics:** none in v1. Deferred to v1.1, when a cookie-free option can be added.

### Backend — `apps/api`

- **FastAPI with Pydantic v2 and pydantic-settings.** It runs on Python 3.11 under uv, the same tooling as Flood-Aware. `app/main.py` is an app factory, `create_app(settings)`; the full contract is in [`docs/API.md`](API.md) (built in M6).

| Endpoint | Request | Responses |
| --- | --- | --- |
| `GET /health` | — | `200 {"status":"ok","version":"1.0.0"}` |
| `POST /contact` | `{name: 2–80 chars, no control characters; email: EmailStr; reason: "job" \| "collaboration" \| "speaking" \| "other"; message: 20–5000 chars; website: "" (honeypot)}`, trimmed | `202 {"ok":true}` · `422 {"ok":false,"errors":{"<field>":"<message>"}}` · `413 {"ok":false,"error":"payload_too_large"}` · `429 {"ok":false,"error":"rate_limited"}` with `Retry-After` · `503 {"ok":false,"error":"email_unavailable"}` (the client shows the mailto fallback) |

- **Security:**
  - CORS allows the exact origins in `CORS_ALLOW_ORIGINS`, plus an optional `CORS_ALLOW_ORIGIN_REGEX` pinned to your own Vercel previews (the same lesson as Flood-Aware's Sprint 16.3). Methods `GET`, `POST`, `OPTIONS`; header `Content-Type`; no credentials.
  - Rate limiting allows 5 requests per IP per 10 minutes (`RATE_LIMIT`) on `POST /contact` only, through `slowapi` with in-memory storage. Behind a proxy, `TRUST_PROXY_HEADERS=true` keys on the first `X-Forwarded-For` address. Requests that fail validation are not counted.
  - A filled honeypot field returns a fake 202 and sends nothing, even when other fields are invalid.
  - Request bodies over 32 KB get a 413 before parsing (raised from 16 KB at the end of M6, so a 5,000-character message of 4-byte characters such as emoji always fits).
  - Message text is escaped before going into the email HTML, and CR/LF are stripped from the subject.
  - Every response and app log line carries a request id (`X-Request-ID`). Logs hold only the request id, outcome and reason: never the message body, the sender's name or their email.
  - In production (`ENV=production`), `/docs`, `/redoc` and `/openapi.json` are off, and a missing `RESEND_API_KEY` stops the app at startup.
  - Configuration comes from environment variables only: `ENV`, `RESEND_API_KEY` (the one secret), `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CORS_ALLOW_ORIGINS`, `CORS_ALLOW_ORIGIN_REGEX`, `RATE_LIMIT`, `TRUST_PROXY_HEADERS`.
- **Email:** [Resend](https://resend.com) sends one notification to you, with `reply_to` set to the sender. The SDK is blocking, so it runs in a worker thread with a 10-second limit. The mailer sits behind a `Mailer` protocol, injected as a FastAPI dependency, so tests use a fake. **No auto-reply to the sender in v1:** Resend's test sender (`onboarding@resend.dev`) can only deliver to the account owner. An auto-reply needs a verified sending domain first.
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
│   │   │   ├── opengraph-image.tsx  projects/[slug]/opengraph-image.tsx   (M8)
│   │   │   └── icon.tsx  apple-icon.tsx  sitemap.ts  robots.ts  not-found.tsx
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
│   │   │   └── case-studies.ts      # structured case studies (was MDX)
│   │   ├── lib/                     # contact.ts (M7), format.ts; M8: seo.ts, site.ts, json-ld.ts, og.tsx, tokens.ts, security-headers.ts
│   │   ├── assets/fonts/            # TTF fonts for ImageResponse only (M8)
│   │   ├── proxy.ts                 # 404 status for unknown /projects/[slug] (M4)
│   │   ├── public/                  # cv.pdf, portrait, images/ (events, logos)
│   │   ├── tests/unit/  tests/e2e/  # Vitest / Playwright
│   │   ├── next.config.ts           # Cache Components + security headers (M8)
│   │   ├── vitest.config.mts  playwright.config.ts
│   │   ├── AGENTS.md                # written by Next.js 16 — keep it
│   │   ├── package.json             # scripts: dev, build, lint, typecheck, test, test:e2e, format
│   │   └── .env.example             # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL
│   └── api/                         # FastAPI — contact + health only
│       ├── app/
│       │   ├── main.py              # create_app(settings): CORS, middleware, error handlers
│       │   ├── config.py            # pydantic-settings            (M6)
│       │   ├── routers/             # health.py, contact.py        (M6)
│       │   ├── schemas.py           # ContactRequest / ContactMessage (M6)
│       │   ├── services/mailer.py   # Resend behind a Mailer protocol (M6)
│       │   ├── security.py          # body-size limit, rate-limit key and limiter (M6)
│       │   └── request_id.py        # X-Request-ID and log lines   (M6)
│       ├── tests/
│       ├── pyproject.toml           # deps + ruff, mypy, pytest config
│       ├── uv.lock  .python-version  .env.example
├── docs/
│   ├── PLAN.md                      # this document
│   └── API.md  DEPLOY.md  CONTENT-GUIDE.md   (API.md written in M6; the rest in M9)
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
| Performance | Lighthouse Performance 95+, Accessibility 100, Best Practices 95+, SEO 100 on mobile; LCP under 2.0 s, CLS under 0.05 | Manual Lighthouse (mobile preset) against `pnpm build && pnpm start` for `/`, `/projects/flood-aware`, `/leadership`, `/contact` (CI automation deferred to v1.1). Lighthouse calibrates its 4× CPU slowdown for a fast desktop; on a slow host (Lighthouse `benchmarkIndex` under about 800) run it with `--throttling.cpuSlowdownMultiplier=1`, as Lighthouse's throttling guide advises, and record the index. M8 results are in `PROGRESS.md`. Re-check with PageSpeed Insights after deploy (M9). |
| Accessibility | WCAG 2.2 AA: 4.5:1 text contrast, visible focus rings, a skip link, keyboard-only navigation, alt text on all images, form errors announced through `aria-live` | `@axe-core/playwright` on every public route, `/styleguide`, the 404, `/leadership` with every event shown, and `/contact` idle, error and success (zero violations); an e2e check of exactly one `h1` per page and no skipped heading levels; plus a manual keyboard pass |
| SEO fundamentals | A unique title and description per page, OG image, canonical URL, sitemap, robots, JSON-LD `Person` and `CreativeWork` | Unit tests on every route's metadata and the JSON-LD shape; Playwright checks canonical, Open Graph, Twitter tags and the OG image response on every public route, the sitemap and robots. An e2e crawl visits every route and asserts every internal link returns 200 and every `#anchor` exists. Google Rich Results test before launch |
| Content integrity | No verified claim without evidence; nothing unpublished renders | Zod schemas at build time, plus unit tests for both rules |
| Frontend tests (essential) | Unit: EvidenceChip, content schema rules, contact form validation. End-to-end: navigation, mobile menu, CV download, contact success and error states (API mocked) | Vitest; Playwright on Chromium at 375px and 1280px |
| Backend tests | 202 on a valid submission; 422 for each invalid field; honeypot sends nothing; 429 on the 6th request within 10 minutes; no CORS headers for a disallowed origin; 503 when the mailer fails | pytest + httpx, with a fake mailer |
| Security | No secrets in client bundles; CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` headers set; no CSP violations | A CI step after `pnpm build` fails if `apps/web/.next` matches `RESEND_API_KEY\|(^\|[^A-Za-z0-9_])re_[A-Za-z0-9_]{20,}` (the left anchor stops `…_workStore_pendingRevalidatedTags` in Next.js's own code from matching). E2E checks the headers on the built site and listens for `securitypolicyviolation` on every route; unit tests check the CSP string. A header check after deploy |
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
| M4 | Projects and case studies | Index (filters deferred); template; two case studies, Flood-Aware and StoryWeave, each with a static, accessible architecture diagram |
| M5 | Experience, Leadership, Credentials, About | All four pages; a static leadership timeline; axe clean on every route |
| M6 | Contact API | FastAPI endpoints, security and the full pytest suite passing |
| M7 | Contact form integration | Form wired to the API with every state; e2e tests with the API mocked |
| M8 | SEO, accessibility and performance pass | Every target in section 9 met |
| M8.5 | Design polish (A: foundations + home, B: inner pages) | A: fluid display type, eyebrow/section/card/stat primitives, sticky header, multi-column footer and the redesigned home, axe clean, Lighthouse ≥ 95 on `/`. B: inner pages on the same primitives. **Done 2026-11-06** |
| M8.6 | Visual identity, motion and copy | Motion policy recorded; owner-chosen palette in `@theme`; FlowLines, Reveal and Spotlight (paused off-screen, static under reduced motion, content visible without JS); owner's hero copy; copy pass; tech stack, durations, back to top; Lighthouse ≥ 95 with CLS 0 on `/`, `/projects/flood-aware`, `/leadership` |
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
Implement section 3 of docs/PLAN.md. Define every color token as a CSS variable in globals.css and map it into Tailwind's theme; no raw hex anywhere else. Load Bricolage Grotesque, Inter and JetBrains Mono with next/font. Build components/ui: Button (filled, outline, ghost), Chip, EvidenceChip (kind, label, url, verified dot), Pill (status), Card, Section (mono label + heading), Container. Build SiteHeader (nav from section 4, active state with aria-current, CV button), a MobileNav full-width disclosure panel (not a sheet) and SiteFooter (current year, not a last-updated date). Add a /styleguide page that renders every component and the type scale, and exclude it from the sitemap. Add a skip link and visible focus rings. Run axe through Playwright on /styleguide and fix every violation.
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
Build /projects and /projects/[slug] per section 5 of docs/PLAN.md, with two case studies: Flood-Aware and StoryWeave. Filters are chips synced to ?tag=. The case-study template renders the header, At a glance, Architecture, Key decisions, Hard problems, Results (Claims with EvidenceChips), Team & credit ("What I did" and "What the team did" kept separate), What I'd do next, and prev/next links. ArchitectureDiagram is a static, accessible inline SVG (role="img" with an aria-label) with a numbered list below explaining each component; nothing is hover-only. Write the Flood-Aware MDX using only facts in section 2 and the public Flood-Aware README and CHANGELOG. Leave "What I did" as an explicit TODO for me: never infer personal contributions. StoryWeave describes only the role stated in its README and Devpost. Generate static params for all slugs.
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

- [x] **1. Your Flood-Aware ownership.** Resolved in M2.1: six self-reported contributions, and the team is Muhammad Ilyas and Abdullah Ahmad (section 2).
- [x] **2. TechRise '26 details.** Resolved in M2.1: 22 Oct 2026 at SSAQ Khan Hall, event lead (initiated and planned as President, Aug–Sep 2026), 300+ attendees, 9 speakers, 3 sponsors, four photos (section 2). No official post link was given, so the card has no evidence link.
- [x] **3. Credential verify links.** Resolved: Coursera share links and CSS award photos in M5; in M6 the last 3 courses were confirmed as issued by IBM and published. Original request: On Coursera, open each certificate and copy its `coursera.org/verify/...` (or `/verify/specialization/...`) link. The org dashboard link needs a login. Also send the Kaggle certificate URL and images of the SMIT, CSS award and Certificate of Excellence certificates.
- [x] **4. Summer Bootcamp 2026.** Resolved in M2.1: instructor on the AI track of CSS Summer Bootcamp 2026 (3 tracks), 4 Jul – 20 Sep 2026; 70+ participants across 3 tracks and 30+ in the AI track, both self-reported.
- [x] **5. GDG, Connected Pakistan and CSS AI/DS Club Lead.** Resolved in M2.1: contributions per role in section 2. The Ambassador role has none, so it shows no bullets.
- [x] **6. Availability line.** Resolved in M2.1: dropped. The hero uses the headline and intro in section 2.
- [ ] **7. Portrait.** A high-resolution headshot, at least 1200px, plain or blurred background. The thesis photo can go on the Flood-Aware case study.
- [ ] **8. Final CV PDF.** Fix the StoryWeave bullet and split the Flood-Aware performance line first (section 1).
- [x] **9. Degree status.** Resolved in M5: completed Nov 2026 (self-reported). Original question: Conferred, or awaiting results? This decides whether the site says "BS CS, 2026" or "BS CS (2022–2026), results pending".
- [ ] **10. Domain and hosting.** Decided in M9 after Claude Code lists current prices: a free API host, or a paid one only with your approval. A domain is optional and bought by you.
- [ ] **11. Profile cleanups.** Fix the GitHub sidebar LinkedIn link (it points to `/muhammad-ilyas-d14m08`), change the GitHub bio away from "Data Science Freshman", and add READMEs and screenshots to the repos you want in the Lab grid.
- [ ] **12. Optional, high value.** A public notebook reproducing DP-SGD with Opacus on a small dataset. It turns the internship from a claim into something people can see.
- [x] **13. About text.** Resolved in M5: one five-sentence paragraph (section 2). Original request: The three story paragraphs for `/about` (section 5), in your words.

**Also resolved in M2.1:** the 2023–24 role is "AI/ML Team Member" at Google Developer Student Clubs (GDSC), University of Peshawar; the AI/DS Club Lead term started Dec 2024; the 2025 bootcamp's name is "CSS AI Bootcamp 2025"; the StoryWeave role follows the repo README.

**Content still open:** none (the events toggle was built in M8). Items 7, 8 and 10–12 are assets or owner tasks, not content.

## Sources

- [Flood-Aware repository](https://github.com/Muhammad-Ilyas1408/flood-aware) and [CHANGELOG](https://github.com/Muhammad-Ilyas1408/flood-aware/blob/main/docs/CHANGELOG.md)
- [StoryWeave repository](https://github.com/JawadGigyani/StoryWeave) and [Devpost: Story Weave](https://devpost.com/software/story-weave)
- [GitHub profile](https://github.com/Muhammad-Ilyas1408)
- Your CV (PDF) and Flood-Aware thesis cover photo, provided in chat
