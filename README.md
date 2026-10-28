# Muhammad Ilyas — Portfolio

My personal portfolio showcasing my work as an AI/ML Engineer specializing in Generative AI, LLMs, RAG, agentic systems, and full-stack AI applications, alongside technical leadership and community contributions.

> 🚧 Under active development, built milestone by milestone from [`docs/PLAN.md`](docs/PLAN.md). Progress: [`docs/PROGRESS.md`](docs/PROGRESS.md).

## Stack

| Part | Tech | Hosting |
| --- | --- | --- |
| Website (`apps/web`) | Next.js 16 (App Router), TypeScript, Tailwind CSS | Vercel |
| Contact API (`apps/api`) | FastAPI, Pydantic, Python 3.11 | Free-tier host, chosen at deploy time |

## Quick start

Requires Node 22+, [pnpm](https://pnpm.io) (version pinned in `package.json`), and [uv](https://docs.astral.sh/uv/) with Python 3.11.

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
```

## Repository layout

Target layout. `apps/web` and `apps/api` are created in milestone M0.

```text
portfolio/
├── apps/
│   ├── web/        # Next.js website
│   └── api/        # FastAPI contact service
├── docs/
│   ├── PLAN.md     # full build plan (source of truth)
│   └── PROGRESS.md # milestone status and session log
├── CLAUDE.md       # rules for Claude Code sessions
├── README.md
└── .gitignore  .gitattributes  .editorconfig
```

## Roadmap

- [x] M0 — Scaffold, tooling, CI
- [ ] M1 — Design system and layout shell
- [ ] M2 — Content layer
- [ ] M3 — Home page
- [ ] M4 — Projects and case studies
- [ ] M5 — Experience, Leadership, Credentials, About
- [ ] M6 — Contact API
- [ ] M7 — Contact form integration
- [ ] M8 — SEO, accessibility and performance pass
- [ ] M9 — Deploy and docs

## Contact

- Email: muhammadilyas.ai.eng@gmail.com
- LinkedIn: [muhammad-ilyas-ds](https://www.linkedin.com/in/muhammad-ilyas-ds/)
- GitHub: [Muhammad-Ilyas1408](https://github.com/Muhammad-Ilyas1408)
