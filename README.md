# Muhammad Ilyas — Portfolio

My personal portfolio showcasing my work as an AI/ML Engineer specializing in Generative AI, LLMs, RAG, agentic systems, and full-stack AI applications, alongside technical leadership and community contributions.

**Live site:** <https://muhammad-ilyas.vercel.app> (planned URL, pending first deploy)

> Built milestone by milestone from [`docs/PLAN.md`](docs/PLAN.md). Progress: [`docs/PROGRESS.md`](docs/PROGRESS.md).

## Stack

| Part | Tech | Hosting |
| --- | --- | --- |
| Website (`apps/web`) | Next.js 16 (App Router), TypeScript, Tailwind CSS | Vercel (Hobby) |
| Contact API (`apps/api`) | FastAPI, Pydantic, Python 3.12 | Vercel (Hobby), as a Python Function |
| Email | Resend (free plan) | — |

## Quick start

Requires Node 22+, [pnpm](https://pnpm.io) (version pinned in `package.json`), and [uv](https://docs.astral.sh/uv/) with Python 3.12 (`uv python install 3.12`).

```bash
# install — web deps (single lockfile, at the repo root) and the API environment
pnpm install --frozen-lockfile
uv sync --directory apps/api --locked

# dev — web app on http://localhost:3000
pnpm dev

# api — contact API on http://localhost:8000 (GET /health)
pnpm api

# tests — web
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter web exec playwright install chromium   # once, to fetch the browser
pnpm --filter web test:e2e

# tests — API
pnpm api:test
uv run --directory apps/api ruff check .
uv run --directory apps/api ruff format --check .
uv run --directory apps/api mypy

# smoke — read-only checks of the live site (PowerShell; skipped without the variable)
$env:SMOKE_BASE_URL = "https://muhammad-ilyas.vercel.app"; pnpm --filter web test:smoke
```

## Docs

- [`docs/DEPLOY.md`](docs/DEPLOY.md): deploy the website and the API to Vercel, step by step
- [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md): update the site's content without touching code
- [`docs/API.md`](docs/API.md): the contact API contract
- [`docs/PLAN.md`](docs/PLAN.md) and [`docs/PROGRESS.md`](docs/PROGRESS.md): the build plan and log

## Repository layout

```text
portfolio/
├── apps/
│   ├── web/        # Next.js website
│   └── api/        # FastAPI contact service
├── docs/
│   ├── PLAN.md          # full build plan (source of truth)
│   ├── PROGRESS.md      # milestone status and session log
│   ├── API.md           # contact API contract
│   ├── DEPLOY.md        # deploy guide (Vercel + Resend)
│   └── CONTENT-GUIDE.md # how to edit content
├── CLAUDE.md       # rules for Claude Code sessions
├── README.md
└── .gitignore  .gitattributes  .editorconfig
```

## Roadmap

- [x] M0 — Scaffold, tooling, CI
- [x] M1 — Design system and layout shell
- [x] M2 — Content layer
- [x] M3 — Home page
- [x] M4 — Projects and case studies
- [x] M5 — Experience, Leadership, Credentials, About
- [x] M6 — Contact API
- [x] M7 — Contact form integration
- [x] M8 — SEO, accessibility and performance pass
- [x] M8.5 — Design polish
- [x] M8.6 — Visual identity, motion and copy
- [x] M9 — Deploy preparation and docs (ready to deploy; the first deploy follows `docs/DEPLOY.md`)

## Contact

- Email: muhammadilyas.ai.eng@gmail.com
- LinkedIn: [muhammad-ilyas-ds](https://www.linkedin.com/in/muhammad-ilyas-ds/)
- GitHub: [Muhammad-Ilyas1408](https://github.com/Muhammad-Ilyas1408)
