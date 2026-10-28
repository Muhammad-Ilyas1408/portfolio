# CLAUDE.md — rules for every Claude Code session in this repo

## Session workflow
- One session = ONE milestone or feature, named in the prompt. Do not start the next one.
- At the start, read `CLAUDE.md`, `docs/PLAN.md` and `docs/PROGRESS.md` (and `apps/web/AGENTS.md` once it exists).
- Do NOT commit, push, create branches, deploy, or sign up for any service. The owner reviews and commits by hand.
- STOP and ask before:
  - anything that conflicts with `docs/PLAN.md`;
  - adding a dependency or service the plan does not list;
  - anything that could cost money;
  - writing content you were not given.
- At the end:
  1. Run the checks (below) that exist so far.
  2. Update `docs/PROGRESS.md`: the milestone table plus a new entry at the TOP of the session log.
  3. Print the Session report (template at the bottom of this file).

## Checks (available from M0 onwards)
- Web: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- E2E: `pnpm --filter web test:e2e`
- API: `pnpm api:test`, `uv run --directory apps/api ruff check .`, `uv run --directory apps/api ruff format --check .`, `uv run --directory apps/api mypy`

## Content integrity (non-negotiable)
- Never invent content: no metrics, dates, roles, personal contributions, credentials, testimonials or links.
- All site content lives in `apps/web/content/` and must pass the Zod schemas in `content/schema.ts`.
- A claim with `status: 'verified'` must carry evidence. Unknown facts stay optional with a `TODO` comment.
- Items marked Pending in `docs/PLAN.md` are `published: false`. Empty lists render nothing, never placeholder text.

## Scope (v1)
- Apps live only in `apps/web` (Next.js 16) and `apps/api` (FastAPI).
- The API has `GET /health` and `POST /contact` only. No database, no authentication.
- Deferred to v1.1: analytics, live GitHub stats, entrance/scroll animations, Lighthouse CI, link checker, WebKit e2e, light theme.

## Design system
- Use theme tokens only (`bg`, `surface`, `signal`, `ember`, ...). No raw hex values in components.
- Signal (teal) = engineering content. Ember (amber) = leadership/community content.
- v1 motion = hover and focus transitions only, off under `prefers-reduced-motion`.
- Every interactive element is keyboard-accessible with a visible focus ring.

## Security
- No secrets in frontend code. Only `NEXT_PUBLIC_*` variables reach the browser.
- Never commit `.env` files. Update `.env.example` whenever a variable is added.

## Session report (print this at the end of every session)

```markdown
## Session report — <milestone, e.g. M0 Scaffold>
**Status:** Done | Partly done | Blocked
**What changed:**
- <file or folder> — <what and why>
**Checks:**
| Command | Result |
| --- | --- |
| pnpm lint | pass/fail |
**Deviations from docs/PLAN.md:** none | <what and why>
**Needs owner input / TODOs:** none | <list>
**Suggested commit message:** <conventional commit>
```
