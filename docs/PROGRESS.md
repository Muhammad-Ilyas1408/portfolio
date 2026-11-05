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
| M4 | Projects and case studies | Done | 2026-11-04 |
| M5 | Experience, Leadership, Credentials, About | Done | 2026-11-05 |
| M6 | Contact API | Done | 2026-11-05 |
| M7 | Contact form integration | Done | 2026-11-05 |
| M8 | SEO, accessibility and performance pass | Done | 2026-11-06 |
| M9 | Deploy and docs | Not started | |

Status values: Not started · In progress · In review · Done

## Open items (owner input needed)

See section 11 of `PLAN.md`. Items resolved during the build are noted in the session log.

## Session log

Newest first. One entry per Claude Code session.

### 2026-11-06 — M8 SEO, accessibility and performance
- **Site URL:** `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`, set on Vercel in M9) added to `apps/web/.env.example`; `lib/site.ts` keeps its origin and feeds `metadataBase` in the root layout, the sitemap, robots and JSON-LD. The home page's `metadataBase` TODO is resolved.
- **Metadata:** every route uses `pageMetadata()` (`lib/seo.ts`): title, description, canonical, Open Graph (title, description, url, type, site name, image) and a `summary_large_image` Twitter card. A page that sets `openGraph` drops the root's file-based image (checked on the built site), so each page names its image explicitly. New descriptions for routes that shared `profile.positioning`: `/projects` (built from the project titles), `/about` (lists the page's sections), `/contact` (the page's own intro line, now one constant used for both); 404: "This page does not exist. Go back to the home page or see the projects." These are page descriptions, not facts. The 404 has no canonical (it has no URL of its own) and Next.js already marks it noindex.
- **Open Graph images:** `app/opengraph-image.tsx` (name, "AI/ML ENGINEER", the headline's 3 segments, positioning line) and `app/projects/[slug]/opengraph-image.tsx` (title, summary, "CASE STUDY"); `lib/og.tsx` holds the frame and fonts, `lib/tokens.ts` the token values (unit-tested against `globals.css`). Fonts: static TTF Bricolage Grotesque 700, Inter 400 and JetBrains Mono 500 from Google Fonts (SIL OFL) in `apps/web/assets/fonts/` with a README, since `ImageResponse` can't read WOFF2. Font files, not a package dependency. PNGs saved by the screenshot spec to `tests/screenshots/og-default.png`, `og-flood-aware.png`, `og-storyweave.png` (that folder is git-ignored).
- **Icons:** `app/icon.tsx` (32×32) and `app/apple-icon.tsx` (180×180, square for iOS masking), "MI" in Bricolage, signal on bg. `app/favicon.ico` deleted; `/favicon.ico` now returns 404 (tested).
- **sitemap.ts / robots.ts:** the nine public routes without `lastModified` (no reliable dates in content); robots allows all, disallows `/styleguide`, names the sitemap.
- **JSON-LD:** `Person` in the root layout; `CreativeWork` on each case study. The author list is the Person by `@id` plus the other team members by name (Flood-Aware 2, StoryWeave 4), so team work isn't credited to one person. Repo, live and Devpost links go in `sameAs` (`codeRepository` is not a `CreativeWork` property). `serializeJsonLd` escapes `<`. Unit tests check the exact Person object and each CreativeWork.
- **Security headers:** `lib/security-headers.ts` → `next.config.ts` `headers()` on `/:path*`. Nonces need dynamic rendering and don't work with Cache Components/PPR (bundled CSP guide), so `script-src`/`style-src` use `'unsafe-inline'`; reasons in `PLAN.md` section 7. `connect-src` adds the origin of `NEXT_PUBLIC_API_URL`, which is read at build time. Dev adds `'unsafe-eval'` (checked: `pnpm dev` shows no violations).
- **CSP fix found by Lighthouse:** `/contact` reported a CSP issue that the console never showed. Zod 4 probes `new Function` once (caught, but the browser still reports it). Fixed with `z.config({ jitless: true })` in `lib/contact.ts`. The e2e CSP test now listens for `securitypolicyviolation` events instead of console text.
- **Contact under CSP:** the 16 mocked e2e tests pass on the built site with the headers, and a manual submit against `pnpm api` from headless Chromium got preflight `OPTIONS /contact` 200, `POST /contact` 202, API log "email delivery disabled … message dropped" and `contact outcome=sent reason=other`, success panel shown, zero CSP violations. Servers stopped.
- **Events toggle:** `EventsTable` renders the 8 newest events, then a native `<details id="all-events">` "Show all 20 events" holding a second table with the rest (same columns, a screen-reader-only caption). `OpenTargetDetails` (client, ~30 lines) opens the disclosure when the hash targets a hidden row, on load and on `hashchange`. `/experience` → `/leadership#css-ai-bootcamp-2025` (a hidden row) works on both full and client-side navigation.
- **CI guard:** step "No secrets in the build output" after `pnpm build`. The prompt's regex `re_[A-Za-z0-9]{20,}` matched Next.js's own `_workStore_pendingRevalidatedTags` in `.next`, so the pattern is anchored: `RESEND_API_KEY|(^|[^A-Za-z0-9_])re_[A-Za-z0-9_]{20,}`. It also allows `_` inside the key, since Resend keys can contain one. Checked locally: the clean build passes; planted `re_…` and `RESEND_API_KEY` strings are caught.
- **Performance:** the hero's Contact button has `prefetch={false}`. On a phone, prefetching `/contact` loaded the form's JS during start-up (home TBT 510 → 160 ms at 1× CPU). Image sizes were already right: the only image-delivery hint is the lazy TechRise banner at the expected 750w for a 412px DPR-1.75 screen. Lighthouse 13 gives insights no score weight.
- **Lighthouse 13.6.0** (run via `pnpm dlx`, not added to the repo; mobile preset; Playwright's Chromium via `CHROME_PATH`; `pnpm build && pnpm start`). This machine's `benchmarkIndex` is **359**. Lighthouse's 4× CPU slowdown assumes a fast desktop (index about 1500+), and its throttling guide recommends 1× below about 800. Final scores, median of 3 runs at 1× CPU (network throttling unchanged):

  | Page | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | `/` | 100 | 100 | 100 | 100 | 0.8 s | 0 | 60 ms |
  | `/projects/flood-aware` | 100 | 100 | 100 | 100 | 0.9 s | 0 | 90 ms |
  | `/leadership` | 100 | 100 | 100 | 100 | 0.9 s | 0 | 50 ms |
  | `/contact` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 90 ms |

  At the default 4× on this machine, Performance was 80 / 81 / 81 / 84 (LCP 0.9–1.1 s, CLS ≤ 0.004, TBT 620–840 ms). The gap is React/Next.js start-up JS on a slow CPU slowed 4× more: `/contact`'s 29 KB page had the same TBT as `/leadership`'s 150 KB page. **To confirm:** PageSpeed Insights on the deployed URL (M9).
- **Tests:** unit `m8.test.tsx` (23: site URL, unique titles/descriptions and full OG/Twitter/canonical on all 9 routes, 404 metadata, sitemap/robots, Person and CreativeWork shape, `<` escaping, CSP string, dev/no-API variants, headers, tokens vs `globals.css`, the events toggle and hash opener). E2E `m8.spec.ts` (30: one h1 and no skipped heading levels on 10 pages, an internal link and anchor crawl, headers on the built site, no `securitypolicyviolation` on any page, SEO tags and OG image responses per route, unique titles/descriptions, icons, robots/sitemap, JSON-LD, toggle by keyboard, by hash and after client navigation). `a11y.spec.ts` now runs axe on every public route, `/styleguide`, the 404 and `/leadership` with every event open (the `/contact` states stay in `contact.spec.ts`). The M5 mobile-stacking test checks both tables; the home canonical test now expects the `metadataBase` origin. Screenshots regenerated.
- **`PLAN.md`:** section 4 (other routes), section 5 (events toggle), section 7 (SEO, security headers and why `'unsafe-inline'`, site URL, toggle, prefetch), section 8 (tree), section 9 (performance, accessibility, SEO and security rows as built), section 11 (content still open: none).

### 2026-11-05 — M7 final fixes
- **New tokens:** `danger` (#F87171) and `danger-soft` (#F87171 at 10%) in `globals.css` and the Tailwind theme, plus styleguide swatches. Contrast of `danger` text: 6.95:1 on `bg`, 6.57:1 on `surface`, 6.18:1 on `danger-soft`; body `text` on `danger-soft` is 14.16:1.
- **/contact:** validation messages, invalid-field borders, the over-limit counter, the error panel and the "API URL missing" panel now use `danger`/`danger-soft` instead of `ember`.
- **`PLAN.md` section 3:** token table rows and the rule "Danger is used only for errors."
- Screenshots regenerated. M7 → Done; ticked in `README.md`.

### 2026-11-05 — M7 Contact form
- **Dependencies:** `react-hook-form` 7.91.0 and `@hookform/resolvers` 7.0.2 (requested in the M7 prompt and listed in `PLAN.md` section 8). `zod` was already present. `pnpm peers check` reports only the existing `@types/node`/vitest mismatch.
- **Contract (`lib/contact.ts`):** reason options and labels, limits (name 2–80, message 20–5000), a Zod schema mirroring `POST /contact` (trim, control characters incl. U+2028/U+2029, lengths counted in code points like Python's `len`, so 5,000 emoji pass), `mapApiErrors`, `formatRetryAfter`/`rateLimitMessage`, `buildMailto`, and `submitContact` (15 s `AbortController` timeout; maps 202/422/429/413/other/network/timeout to a result). It never logs.
- **Form (`components/contact/ContactForm.tsx`):** visible labels, `aria-invalid` + `aria-describedby` errors, first invalid field focused (client and server 422), live "n / 5000" counter, honeypot `website` (sr-only, `aria-hidden`, `tabIndex -1`, `autoComplete="off"`), spinner + `aria-busy` while sending, one always-mounted `aria-live="polite"` region, focused success panel with "Send another message" (resets and focuses Name), mailto fallback on 503/network/timeout. Missing `NEXT_PUBLIC_API_URL` → disabled form with the mailto link. Reason has a "Choose a reason" placeholder, so no reason is preselected.
- **Page (`app/contact/page.tsx`):** signal accent, title "Contact · Muhammad Ilyas", description from `profile.positioning`, canonical `/contact`; form left, "Direct links" (Email, LinkedIn, GitHub, Download CV) right from 1024px and below on smaller screens.
- **Home and header:** already linked to `/contact` (nav "Contact", hero "Contact", contact band "Contact form"); existing e2e tests cover them. No change.
- **Playwright config:** defaults `NEXT_PUBLIC_API_URL` to `http://localhost:8000` so the build inlines it locally and in CI; all e2e calls to it are mocked with `page.route`.
- **Tests:** unit `contact.test.tsx` (30: schema limits, emoji count, control characters, reasons, error mapping, Retry-After cases, mailto encoding, `submitContact` statuses/network/timeout, disabled form without the API URL, honeypot attributes). E2E `contact.spec.ts` (16: metadata and links; success with focus and the exact payload sent, `aria-busy` while sending, "Send another"; empty submit focuses Name and sends nothing; 422 field and general errors; 429 "10 minutes"; 413; 503, aborted and 15 s timeout (fake clock) → mailto fallback; honeypot skipped by Tab; axe idle/error/success; no horizontal scroll at 360/390/768/1280). Screenshots `contact-1280`, `contact-390`, `contact-errors-390`, `contact-success-1280`.
- **Manual check:** `pnpm api` + `pnpm dev` (with `NEXT_PUBLIC_API_URL=http://localhost:8000`), a real submission from headless Chromium: preflight `OPTIONS /contact` 200, `POST /contact` 202, API log "email delivery disabled (RESEND_API_KEY not set); message dropped" and `contact outcome=sent reason=other`; success panel shown and focused. Both servers stopped.
- **Design note:** validation errors and the error panel used `ember` (no error token yet); replaced by `danger` in the final fixes.
- **`PLAN.md`:** section 5 (Contact as built), section 7 (contact form bullet; M8 CSP must allow `connect-src` to the API origin), section 8 (`lib/` entry).

### 2026-11-05 — M6 final fixes
- **Body limit 16 KB → 32 KB** (`app/security.py`), so a 5,000-character message of 4-byte characters (emoji) is always accepted; the 5,000-character limit is unchanged. New test: 5,000 emoji (about 20 KB as UTF-8 JSON) → 202. The 413 tests now use bodies over 32 KB. `docs/API.md` and `PLAN.md` section 7 updated.
- M6 → Done; ticked in `README.md`.

### 2026-11-05 — M6 Contact API
- **Content first:** the three remaining Coursera courses ("AI Foundations: How Artificial Intelligence Works", "Data Science Foundations: Tools, Careers & Real-World Applications", "Python for Data Science & AI: Hands-On Development") now have issuer IBM and `published: true`; TODOs removed. Unit counts updated (20 published, 9 courses, 13 Verify links). `PLAN.md` section 2 row and section 11 item 3 resolved; the only open content item is the M8 mobile events toggle.
- **Config (`app/config.py`):** pydantic-settings with `ENV`, `RESEND_API_KEY` (SecretStr), `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CORS_ALLOW_ORIGINS`, `CORS_ALLOW_ORIGIN_REGEX`, `RATE_LIMIT`, `TRUST_PROXY_HEADERS`; empty values fall back to defaults. Production without a key, or an unparseable `RATE_LIMIT`, fails at startup. `.env.example` rewritten (no real values).
- **App (`app/main.py`, `create_app(settings, mailer=None)`):** middleware order request id → CORS → 16 KB body limit (pure ASGI, also counts chunked bodies) → routes. CORS exposes `Retry-After` and `X-Request-ID` so the M7 form can read them. Docs/OpenAPI off in production. `/health` returns version `1.0.0` (from `app/__init__.py`); `pyproject.toml` version bumped to 1.0.0 and `uv.lock` re-locked (version line only; no new packages).
- **POST /contact:** `schemas.py` (trim, control-character check on name, honeypot), `routers/contact.py` (slowapi limit applied in a router factory so it reads `RATE_LIMIT`), one 422 shape with fixed per-field messages, 429 with `Retry-After` computed from the window, 503 `email_unavailable` on any mailer error or timeout. A filled honeypot returns 202 even when other fields are invalid. Logs: request id + outcome + reason only.
- **Mailer (`services/mailer.py`):** `Mailer` protocol, `ResendMailer` (subject without CR/LF, `reply_to`, text + escaped HTML), injected via the `get_mailer` dependency. In development without a key, a `DisabledMailer` accepts and drops messages with a warning. No auto-reply (noted in `PLAN.md` section 7).
- **Timeout detail:** the SDK call runs through `anyio.to_thread.run_sync(..., abandon_on_cancel=True)` inside `anyio.fail_after(10)`. That is the call Starlette's `run_in_threadpool` makes, minus the wait: `run_in_threadpool` cannot abandon the thread, so a hung send would hold the request past 10 s. The SDK's HTTP client timeout is also set to 10 s.
- **Tests (50, no network):** valid → 202 and one escaped email with `reply_to`; 422 per invalid/missing field, bad JSON and non-object bodies; honeypot (also with invalid fields); 6th request → 429 with `Retry-After`; validation failures not counted; `X-Forwarded-For` only when trusted; 413 with and without `Content-Length`; CORS allowed/disallowed/regex/multiple origins; 503 on error and on timeout; CR/LF never in the subject; caplog shows no name, email or message, and log lines carry the request id; production disables docs and needs the key; `ResendMailer` request built via a monkeypatched `resend.Emails.send`; `/health` 1.0.0.
- **Docs:** new `docs/API.md`; `PLAN.md` section 7 (backend as built), section 8 (API tree adds `request_id.py`).

### 2026-11-05 — M5 follow-ups
- **Event photos:** restored Supabase Meetup `talk.jpg` and `audience.jpg` and Sports Fest `trophies.jpg` with the alt text from the M5 prompt; TODOs removed. Sports Fest `teams.png` added after the owner confirmed it is the correct file (the prompt listed `teams.jpg`); TODO removed.
- **`/leadership`:** "All events, 2025–26" renamed to "All events and programmes" (page, tests, `PLAN.md` section 5).
- Screenshots regenerated. M5 → Done; ticked in `README.md`.

### 2026-11-05 — M5 Experience, Leadership, Credentials, About
- **Source:** every new fact comes from the owner's M5 prompt and is self-reported, except the CSS alumni page (`WEBSITE` evidence) and the Coursera share links.
- **Schema:** evidence kind `website`; `Profile.about`; `Role.summary`; shared `Photo`; `Credential` gains `period`, `note` and `photos`, and `issuer` is optional only while unpublished (TODO for 3 courses); new `Chapter`, `Principle` and `Explainer` schemas; optional `anchor` on case-study decisions (`citation-validation`, `golden-set`).
- **Content:** `profile.about`; internship summary; President team line and CSS alumni evidence on President and AI/DS Club Lead; new `chapter.ts` and `about.ts` (principles, and the 3-sentence DP-SGD explainer, a general description written for this page); initiative roles and summaries as given; Summer Bootcamp 2026 stats, role "Instructor, AI & Data Science track" and co-instructor sentence; `credentials.ts` replaced (17 published, 3 hidden until issuers are confirmed; Kaggle and IBM Architecture entries removed). TechRise '26 sponsors stay unnamed.
- **Left out:** Sports Fest (`teams.jpg`, `trophies.jpg`) and Supabase Meetup (`talk.jpg`, `audience.jpg`) photos. They came with alt text, but the files are not in `public/images/events/`, so TODOs are in `initiatives.ts`.
- **Getters and build checks:** `getCredentialGroups`, `getHomeCredentials`, `getCommunityRoles`, `getInternship`, `getInitiativeByName`, `getChapter`, `getPrinciples`, `getDpSgdExplainer`, `initiativeId` (anchors must be unique), and a build failure if a principle points at a missing case-study anchor.
- **Home:** the credentials row now uses `getHomeCredentials()` (degree + the verifiable award), so it is unchanged while 17 credentials are published.
- **Pages:** `/experience` (Industry, Teaching), `/leadership` (Progression, Chapter 2 in numbers, Featured initiatives, All events table that stacks into cards below 1024px, Recognition), `/credentials` (Degree · Awards · Specializations · Courses · Training with anchors, award thumbnails opening full images), `/about` (portrait and text, principles, skills with "Used in" links, education). Each page has title, description, canonical and OG metadata. Case-study sections now carry `id`s too.
- **Components:** `components/shared` (PageHeader, StatChips, TextLink), `components/experience`, `components/leadership`, `components/credentials`, `components/about`.
- **Tests:** unit `m5.test.tsx` (chapter schema, website kind, credential groups/order/published filter, issuer rule, award photos exist, TechRise sponsors counted but not named, anchors, page sections). E2E `m5-pages.spec.ts` (section headings, metadata, non-empty alt, `/credentials#awards` and `/leadership#<id>` anchors, principle anchors, Photos disclosure, stacked table on mobile, axe on all four pages, no horizontal scroll at 360/390/768/1280). Screenshots `experience-1280`, `leadership-1280`, `leadership-390`, `credentials-1280`, `about-1280`; the screenshot helper now scrolls the page so lazy images load first.
- **`PLAN.md`:** section 2 (About, internship, roles, initiatives, Chapter 2, credentials table), section 3 (`WEBSITE` chip), section 5 (four pages as built), section 6 (schemas), section 11 (items 3, 9, 13).

### 2026-11-04 — M4 review fixes
- **Source check (Flood-Aware CHANGELOG):** Sprint 11.1, Sprint 11.2 and Sprint 12.1 all exist and support the claims that cite them; no evidence was moved and nothing was removed. The routing trade-off's wording comes straight from Sprint 14.1.4 (Notes), with Sprint 12.1 as confirmation; the source comment in `case-studies.ts` now says so.
- **Flood-Aware `teamOutcomes`:** now `[]`, so Team & credit shows only "What I did".
- **Evidence labels:** repo links → "GitHub repository", live links → "Live app", Devpost links → "Devpost project page" (also in `home.ts`); README evidence → "README: <section heading>" ("README: Grounded Multi-Tool Reasoning", "README: Project Status" for the golden-set result). "Sprint …"/"Hotfix …" and "Changelog" labels unchanged.
- **`PLAN.md` section 7:** the proxy now has its own bullet (`proxy.ts`, `/projects/:slug` only, real 404 for unknown slugs).
- **Tests:** e2e checks the new Devpost name, the README chip name, and that "What the team did" is absent on Flood-Aware. Screenshots regenerated.
- M4 → Done; ticked in `README.md`.

### 2026-11-04 — M4 Projects and case studies
- **EvidenceChip:** the accessible name is now built as "<KIND>: <label> (opens in a new tab)", so the visible kind always starts it (WCAG 2.5.3). Styleguide samples are back to "Verified sample" / "Unverified sample". To avoid names like "CHANGELOG: Changelog, Sprint 16.1", three Flood-Aware result labels were shortened to "Sprint 16.1", "Sprint 14.1.5" and "Hotfix 14.4"; plain "Changelog", "Repo", "Live" and "Devpost" labels are unchanged.
- **Sources:** the Flood-Aware README and `docs/CHANGELOG.md` and the StoryWeave README, cloned read-only to `../_refs/` outside the repo. Nothing was copied in.
- **Content model:** new `CaseStudy` schema and `content/case-studies.ts` (replaces the planned MDX; the empty `content/case-studies/` folder was removed, and `Project.caseStudy` dropped). Decisions also carry required `evidence`, so each one names its README section or CHANGELOG entry. The build fails if a case-study slug matches no project. New getters: `getCaseStudy`, `getCaseStudySlugs`, `getAdjacentProjects`.
- **Flood-Aware:** 8 architecture steps from the README's System Architecture diagram; 5 decisions; 3 hard problems (Hotfix 20, 21, 22, all verified in the CHANGELOG); 4 limitations from deferred items in the CHANGELOG. The thesis photo does not exist, so it is skipped.
- **StoryWeave:** 6 steps from "How It Works", framed as the team's pipeline. The README names Docker and DigitalOcean but gives no reasons or trade-offs, and documents no debugging story or limits, so decisions, hard problems and limitations are empty and their sections do not render.
- **Pages:** `/projects` (one `ProjectCard` per project; the card moved from `components/home/FeaturedWork.tsx` to `components/projects/ProjectCard.tsx`); `/projects/[slug]` with numbered sections that are left out when empty, and per-page metadata. `ArchitectureDiagram` is a two-row inline SVG shown from 1024px; below that the numbered list carries the content.
- **404 for unknown slugs:** with Cache Components, `dynamicParams` is unavailable and the shell streams with a 200 before `notFound()` runs (tried `"use cache"` on the page first; still 200). Added `apps/web/proxy.ts` (matcher `/projects/:slug`), which rewrites unknown slugs to the 404 page before rendering, per the Next.js 16 docs. This adds a request-time Proxy function; no new dependency.
- **`PLAN.md`:** section 5 (no filter chips in v1, deferred; case-study template as built), section 6 (`CaseStudy` schema, files), section 7 (MDX → TS note, Proxy note), section 8 (tree), section 10 (M4 row).
- **Tests:** unit — case-study schema (https evidence on hard problems, 0 or 3–5 decisions, 4–8 unique steps, slug must match a project), empty sections render nothing, team line, "What I did" verbatim, diagram summary and word wrap, EvidenceChip name format. E2E — `projects.spec.ts`: 2 cards, section headings per case study, 404 for an unknown slug, axe on `/projects` and both case studies, no horizontal scroll at 360/390/768/1280px. Screenshots: `projects-1280`, `flood-aware-390`, `flood-aware-1280`, `storyweave-1280`.

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
