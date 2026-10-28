# Progress

Running log of the portfolio build. Claude Code updates this at the end of every session; the plan lives in [`PLAN.md`](PLAN.md).

## Milestones

| # | Milestone | Status | Completed |
| --- | --- | --- | --- |
| M0 | Scaffold, tooling, CI | Done | 2026-10-29 | |
| M1 | Design system and layout shell | Not started | |
| M2 | Content layer | Not started | |
| M3 | Home page | Not started | |
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
