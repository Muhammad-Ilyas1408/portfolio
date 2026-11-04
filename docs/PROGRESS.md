# Progress

Running log of the portfolio build. Claude Code updates this at the end of every session; the plan lives in [`PLAN.md`](PLAN.md).

## Milestones

| # | Milestone | Status | Completed |
| --- | --- | --- | --- |
| M0 | Scaffold, tooling, CI | Done | 2026-10-29 | |
| M1 | Design system and layout shell | Done | 2026-11-02 |
| M2 | Content layer | Done | 2026-11-02 |
| M2.1 | Content update (owner-provided facts) | Done | 2026-11-04 |
| M3 | Home page | Done | 2026-11-04 |
| M4 | Projects and case studies | Not started | |
| M5 | Experience, Leadership, Credentials, About | Not started | |
| M6 | Contact API | Not started | |
| M7 | Contact form integration | Not started | |
| M8 | SEO, accessibility and performance pass | Not started | |
| M9 | Deploy and docs | Not started | |

Status values: Not started · In progress · In review · Done

## Open items (owner input needed)

See section 11 of `PLAN.md`. Items resolved during the build are noted in the session log.

## Session log

Newest first. One entry per Claude Code session.

### 2026-11-04 — M3 design review fixes
- **EvidenceChip:** the visible text is now only the kind in mono caps, plus the verified dot when verified. The label becomes the accessible name: "<label> (opens in a new tab)". A verified chip also carries `data-verified`. Unit tests updated.
- **Home highlights:** project results take an optional `highlight`. Flood-Aware highlights the 348 backend tests, production GIS warm-up and 7 evidence tools results. To get that order from a boolean, those three now come first in `projects.ts` (the other results keep their order). The home card shows only highlighted results, or else the first 3 verified ones. New unit tests cover both paths.
- **CredentialsRow:** the "Verify ↗" link uses signal.
- **`PLAN.md` section 5 (Home):** rewritten to match what was built. The earlier "Differences from PLAN.md" note in the M3 entry below no longer applies.
- Screenshots regenerated. M3 → Done; ticked in `README.md`.

### 2026-11-04 — M3 Home page
- **Small updates:** CSS Summer Bootcamp 2026 summary replaced with the owner's CV text; `timeout-minutes: 15` on both CI jobs; `profile.portrait` added to the schema (optional) and set to `/portrait.jpeg`. The prompt named `portrait.jpg`, but the owner's file is `portrait.jpeg`; the owner chose to use it as is.
- **Content:** new `content/home.ts` (validated by a new `Home` schema): the 4 proof-strip claims from the prompt (2 verified, reusing the changelog and Devpost URLs now exported from `projects.ts`; 2 self-reported) and the leadership-preview roles, matched by org and title against `roles.ts` (build fails if one is missing). New getters `getHomeProof()` and `getLeadershipPath()` (oldest first).
- **Page:** `app/page.tsx` composes `components/home/` — Hero, ProofStrip, FeaturedWork, LeadershipPreview, CredentialsRow, ContactBand, MoreLink. Date helpers in `lib/format.ts`. Faint `dot-grid` utility in `globals.css`, used behind the hero only. EvidenceChip now wraps, so it no longer clips in the 2-column proof strip at 390px.
- **Next.js 16:** `priority` is deprecated on `next/image`; the portrait uses its replacement, `preload`.
- **UI labels I added (no facts):** section headings "Featured work", "Leadership", "Credentials", a screen-reader-only "Highlights" heading for the proof strip, "Case study →", "Experience →", "Verify ↗", and a "Self-reported" note under initiative stats (per PLAN section 5, Leadership).
- **SEO:** title, description, canonical "/" and OG title/description. `metadataBase` is not set yet (no domain), so absolute URLs resolve to localhost; TODO in `app/page.tsx` for M8/M9.
- **Tests:** unit — roleLine, Hero portrait shown/hidden, ProofStrip chips only on verified items, leadership path order and dates, date formatting, all six section headings. E2E — `home.spec.ts` (sections, CTA hrefs, Tab order after the header, `/cv.pdf` 200, portrait above the label on mobile, metadata); no-horizontal-scroll now also at 1280px; axe on `/` (existing). Screenshots regenerated.
- **Differences from PLAN.md section 5 (Home), following the owner's M3 prompt:** h1 is the name, not "I build AI systems that show their evidence."; the role line comes from the headline; Contact is a ghost button; proof-strip wording differs and self-reported items have no link; the leadership preview has 4 roles plus 3 initiative cards; credentials show the degree and award only (specializations are unpublished); no architecture thumbnail or logos (no assets). PLAN.md was not edited.

### 2026-11-04 — M2.1 final touches
- **StoryWeave summary:** now "Multimodal wellness-story generator: a six-stage LangGraph pipeline turns a single prompt into a personalized, narrated story with background music (Gemini, ElevenLabs, FFmpeg)." It describes the project per its README, not the owner's own work. TODO removed.
- **TechRise '26 photos:** the owner confirmed the `.png` files are correct.
- M2.1 → Done.

### 2026-11-04 — M2.1 Content update
- **Source:** every new fact comes from the owner's M2.1 prompt and is self-reported; no evidence URLs were given. No page or visual changes.
- **Profile:** `availability` removed from the schema and content; `headline` and `intro` added; `location` is now "Pakistan". The positioning line stays for metadata.
- **Flood-Aware:** role "BS CS Final Year Project (team of 2)"; team Muhammad Ilyas and Abdullah Ahmad, no role for Abdullah; the owner's six contributions added. Open item 1 TODOs removed.
- **StoryWeave:** role and contributions unchanged, now confirmed by the owner. The separate summary TODO stays (see Needs owner input).
- **Roles:** contributions for every community role except Ambassador, which stays empty. The 2023–24 role is now "AI/ML Team Member" at "Google Developer Student Clubs (GDSC), University of Peshawar". `teamOutcomes` stay empty. All role TODOs removed.
- **Initiative schema:** `start`/`end` take "YYYY-MM-DD" or "YYYY-MM" and the day must exist; `end` cannot precede `start`; adds `org` (default "Computing Students Society"), `format`, `focus`, `venue`, `stats: Claim[]`, `featured` and `photos: { src, alt }[]`. `scale` and `date` are gone, and `summary` is optional. `getPublishedInitiatives()` is replaced by `getInitiatives()` (published, newest first) and `getFeaturedInitiatives()`. `ClaimInput` type exported.
- **Initiatives:** the 20 owner-provided entries, all published, with 3 featured: TechRise '26, CSS Summer Bootcamp 2026 (3 tracks), CSS AI Bootcamp 2025.
- **TechRise '26 photos:** the prompt listed `.jpg` files, but the folder holds `banner.png`, `audience.png`, `panel.png` and `keynote.png`, so the content points at the `.png` files with the given alt text. `my_award.jpg` is also in the folder but came with no alt text, so it is not used (TODO in `initiatives.ts`).
- **Tests:** content parses; 20 initiatives sorted newest first; exactly 3 featured; "YYYY-MM-DD" and "YYYY-MM" accepted, "2026/10/22", "2026-02-30" and "2026-13" rejected; end before start rejected; org default; every photo exists under `public/`; Flood-Aware has 2 members and the six contributions; profile headline/intro and no availability; GDSC role title and org.
- **`PLAN.md`:** section 1 Flood-Aware row; section 2 hero copy, Flood-Aware team and contributions, StoryWeave confirmation, leadership timeline and a new initiatives table; section 5 hero label `AI/ML ENGINEER` and no availability chip, leadership preview now starts at "GDSC AI/ML Team Member", project role example and initiative cards; section 6 `Initiative` schema, getters and `profile.ts` fields; section 11 items 1, 2, 4, 5 and 6 resolved, new item 13 (About text), plus the other M2.1 resolutions.

### 2026-11-02 — M2 owner updates
- **Dates (self-reported by the owner):** Flood-Aware period 2026-06 to 2026-08; StoryWeave period 2025-10 to 2025-10; HackVortex Codestorm 5 award date 2025-10. Matching TODOs removed.
- **Inventory System removed (owner decision; it may return as a new entry):** gone from `projects.ts`, Python's `usedIn` and the content tests. `PLAN.md` updated in section 2 (projects table, Sources), section 4 (sitemap), section 5, section 8 (case-study list) and section 10 (M4 row and prompt, now two case studies).
- **Filters:** the "Engineering fundamentals" chip is removed from section 5, since Inventory System was its only project. The `fundamentals` tag stays in the schema for when it returns.
- M2 stays Done.

### 2026-11-02 — M2 review fixes
- **Flood-Aware figures:** content and `PLAN.md` section 2 now use the changelog's exact sizes (147.2 → 4.2 MiB, 134.9 → 2.0 MiB) and "348 backend tests passing (53 skipped) in the latest recorded run". This resolves the mismatch in the entry below. The section 2 "data files cut 97–98%" fact now gives the same MiB figures.
- **`PLAN.md`:** section 5 credentials note reworded; section 11 item 5 now includes CSS AI/DS Club Lead and asks for 2–3 contributions per role. The `roles.ts` TODOs for that role are now open item 5.
- M2 → Done; ticked in `README.md`.

### 2026-11-02 — M2 Content layer
- **Schemas and getters:** `content/schema.ts` and `content/index.ts` parse every content file at module load. A temporary verified claim without evidence made `pnpm build` fail (exit 1); the file was then restored.
- **Content:** `profile`, `projects`, `roles`, `initiatives`, `credentials` and `skills`. Every Flood-Aware result was checked against the public README and CHANGELOG before being marked verified.
- **Imports:** every `profile` import, including the home placeholder and footer, now goes through `@/content`. No visual changes.
- **`PLAN.md` section 6, as requested:** `iLed`/`weDelivered` and `myContribution`/`teamContribution` → `myContributions`/`teamOutcomes`; `Role` and `Initiative` gain `published`; dates are `YYYY-MM`; evidence URLs must be https.
- **`PLAN.md` section 6, needed so nothing is guessed:** `Initiative.date`, `Project.period` and team-member `role` are optional; `Credential.years` holds "2022–2026", which has no months.
- **Source mismatch:** the plan says 147, 135 and 4 MB; the changelog says 147.2, 134.9 and 4.2 MiB. The site copy follows the plan.

### 2026-11-02 — M1 final touches
- Mobile Menu button now has a neutral border and text-colored label; the signal outline stays on actions such as the CV buttons.
- `PLAN.md` section 3: the `verified` token now covers evidence-chip dots and the Live status pill, which resolves the open conflict in the entry below.
- M1 → Done; ticked in `README.md`.

### 2026-11-02 — M1 design review fixes
- **Buttons:** the outline variant now has a signal border and text-colored label. The header and mobile CV buttons use it; filled is reserved for a page's single primary action.
- **Pills:** each status has a 6px leading dot plus its text label, with the specified borders.
- **Footer:** Email, GitHub, LinkedIn, Kaggle, Source on GitHub, from `content/profile.ts`. Devpost removed. External links open in a new tab; mailto does not. This supersedes the footer note in the entry below.
- **`PLAN.md`:** official profile links recorded in section 2; accent-fill rule updated in section 3; mobile menu and footer descriptions updated in sections 4 and 10. The section 4 footer line also dropped Devpost, CV and the "Built with" wording so it matches the footer.
- **Tests:** no-horizontal-scroll now also runs at 390px on `/` and `/styleguide`; added a footer link order and attributes test.
- **Open conflict:** `PLAN.md` section 3 still limits `verified` to evidence-chip dots, while the Live pill now uses it for its dot and border.
- Screenshots regenerated. M1 stays In review.

### 2026-11-02 — M1 Design system and layout shell
- **Tokens and type:** every section 3 color token is a CSS variable in `globals.css`, exposed through `@theme`; Tailwind's default palette and type sizes are cleared, so only tokens and the 14/17/20/28/40/64 scale exist. Fonts are Bricolage Grotesque, Inter and JetBrains Mono through `next/font/google`. Geist and the light/dark block are gone.
- **Components:** `components/ui` (Button, Chip, Pill, Card, Container, Section), `components/evidence/EvidenceChip`, `components/layout` (SiteHeader, DesktopNav, MobileNav, SiteFooter, shared `nav.ts`).
- **Pages:** shell and skip link in `app/layout.tsx`, placeholder `app/page.tsx`, `app/not-found.tsx`, noindex `app/styleguide/page.tsx`.
- **Plan update:** section 7 of `PLAN.md` now says "No UI component library in v1; primitives are hand-built and accessible (the mobile menu is a disclosure, not a dialog)." The next sentence changed from "Every other component" to "Every component" so it still reads correctly.
- **Footer links:** only GitHub, Devpost and the source repo render. `PLAN.md` has no email, LinkedIn or Kaggle URL, so those are `TODO`s in `content/profile.ts`. The only Devpost link in `PLAN.md` is the StoryWeave project page, so that is the target for now.
- **Year:** cached at build time with `"use cache"`, because Cache Components rejects a bare `new Date()` during prerender. It updates on each build.
- **Tests:** `smoke.spec.ts` replaced by `a11y`, `navigation` and `screenshots` specs. `tests/unit/setup.ts` now cleans up the DOM after each test, because Vitest globals are off.
- **Known gap:** nav targets don't exist yet, so a click reloads into the 404 page. The link-click focus test blocks the request, and focus after a real client-side navigation can only be tested once the routes exist (M3–M5).

### 2026-10-29 — M0 Scaffold, tooling, CI (recovery and finish)
- **Clean reinstall:** deleted the root and `apps/web` `node_modules` (`apps/web/.next` was already absent). `pnpm install --frozen-lockfile` succeeded with no lockfile changes, so a plain `pnpm install` was not needed.
- **API environment:** `uv sync --directory apps/api --locked` passed, but `pnpm api` then failed with `Failed to canonicalize script path`. The `.venv` launchers still pointed at the repo's old drive letter, and `uv sync` checks only packages, not launcher paths. Deleted `apps/api/.venv` and re-ran `uv sync --directory apps/api --locked` to rebuild it from `uv.lock`. No dependency changes.
- **Playwright browser:** the requested cache folder's drive was not mounted on this machine, so on the owner's instruction Chromium went into Playwright's default per-user cache. No browser-path variable is set in any repo file, script or config. A repo search found none.
- **packageManager:** the root `package.json` is the single source (`pnpm@12.16.1`, matching `pnpm -v`). Removed the duplicate field from `apps/web/package.json`.
- **API smoke check:** `pnpm api` → `GET http://localhost:8000/health` returned `{"status":"ok","version":"0.1.0"}` (HTTP 200); the server was then stopped.
- **README.md:** Quick start regrouped into install / dev / api / tests; the install step now includes `uv sync --directory apps/api --locked`.
- Reworded the previous entry's local-environment note so it no longer names the browser-path variable or drive letters.
- All checks pass (lint, typecheck, unit, build, e2e, API pytest, ruff check, ruff format --check, mypy). M0 → In review.

### 2026-10-29 — M0 Scaffold, tooling, CI
- Root: `package.json` (workspace scripts delegating to `apps/web`/`apps/api`) and `pnpm-workspace.yaml` (`packages: [apps/web]` + `allowBuilds` for `sharp`/`unrs-resolver`, this pnpm version's equivalent of `ignoredBuiltDependencies`).
- `apps/web`: scaffolded with `create-next-app` (Next.js 16.4.3, TS strict, Tailwind, ESLint, App Router). Its own `pnpm-workspace.yaml`/`pnpm-lock.yaml`/`node_modules` were deleted so the repo has one lockfile at the root. Added `typecheck`, `test`, `test:e2e`, `format` scripts; Vitest + Testing Library + jsdom; Playwright + axe; Prettier + Tailwind plugin. Folders scaffolded per spec with `.gitkeep`s. `.env.example` with `NEXT_PUBLIC_API_URL` only; `!.env.example` appended to `.gitignore`.
- `apps/api`: scaffolded with `uv init --app` (Python 3.11). `GET /health` only in `app/main.py`; one pytest test. `fastapi[standard]`, `pydantic-settings`, `slowapi`, `resend` as runtime deps; `pytest`, `pytest-asyncio`, `httpx`, `ruff`, `mypy` as dev deps. Ruff/mypy/pytest config added to `pyproject.toml`. `.env.example` with empty values only.
- `.github/workflows/ci.yml`: two jobs (`web`, `api`) matching the commands in CLAUDE.md, no secrets.
- `apps/.gitkeep` removed now that both apps exist.
- README.md: added a "Quick start" section with install/dev/check commands for both apps.
- **Deviation (environmental, not a plan change):** `apps/web/package.json`'s `typecheck` script is `next typegen && tsc --noEmit` rather than bare `tsc --noEmit`. Next.js 16 generates the ambient `LayoutProps`/`PageProps` route types during `next dev`, `next build`, or `next typegen` — without one of those having run, a standalone `tsc --noEmit` fails on `app/layout.tsx` (`Cannot find name 'LayoutProps'`). Confirmed in `node_modules/next/dist/docs/01-app/.../02-typescript.md`. This keeps `typecheck` runnable on its own and in CI, where it runs before `build`.
- **Local environment note:** the dev machine's system drive was almost full, which failed the first `playwright install chromium` with `ENOSPC`. As a one-off local workaround, the browser was installed inside the project's `node_modules`. That only affected this machine; GitHub Actions runners are unaffected, and nothing was added to any script or config. (Superseded: see the recovery entry above.)
- Ran every check in section 6 of PLAN.md M0, in order; see table below. All passed, including a manual `GET /health` check against `pnpm api`.

### 2026-10-29 — Repository initialised (by hand)
- Created root files: README.md, CLAUDE.md, .gitignore, .gitattributes, .editorconfig, docs/PLAN.md, docs/PROGRESS.md.
- `apps/` is empty and ready for M0.
