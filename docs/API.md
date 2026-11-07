# Contact API

The FastAPI service in `apps/api` does one job: it accepts messages from the site's contact form and emails them to the owner through [Resend](https://resend.com). It has two endpoints, no database and no authentication.

## Base URL

| Environment | Base URL | Notes |
| --- | --- | --- |
| Local development | `http://localhost:8000` | `pnpm api` (runs `fastapi dev app/main.py`). Interactive docs at `/docs` and `/redoc`. |
| Production | `https://muhammad-ilyas-api.vercel.app` (planned, pending first deploy; a Vercel Python Function, see [`DEPLOY.md`](DEPLOY.md)) | `ENV=production`: `/docs`, `/redoc` and `/openapi.json` return 404. |

The web app reads the base URL from `NEXT_PUBLIC_API_URL`.

## Endpoints

### `GET /health`

```http
GET /health
```

```json
200 OK
{"status": "ok", "version": "1.0.0"}
```

### `POST /contact`

Request body (JSON, at most 32 KB):

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | 2–80 characters after trimming; no control characters (CR, LF, tab, NUL, DEL, C1, U+2028/U+2029) |
| `email` | string | A valid email address (`EmailStr`); used as `reply_to` |
| `reason` | string | One of `job`, `collaboration`, `speaking`, `other` |
| `message` | string | 20–5000 characters after trimming |
| `website` | string | Honeypot. Hidden in the form and must stay empty; optional |

Leading and trailing whitespace is trimmed from `name`, `email`, `message` and `website` before validation. Unknown fields are ignored.

```http
POST /contact
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "reason": "job",
  "message": "Hello, I would like to talk about an engineering role.",
  "website": ""
}
```

#### Responses

Every response carries an `X-Request-ID` header (see [Request ids](#request-ids-and-logs)).

**202 Accepted**: the message was emailed. A filled honeypot gets the same 202 and nothing is sent.

```json
{"ok": true}
```

**422 Unprocessable Content**: one message per invalid field. `body` is used when the body is not valid JSON or not a JSON object.

```json
{
  "ok": false,
  "errors": {
    "email": "Enter a valid email address.",
    "message": "Write a message of 20–5000 characters."
  }
}
```

| Field | Message |
| --- | --- |
| any (missing) | `This field is required.` |
| `name` | `Enter your name (2–80 characters).` or `Name must not contain control characters.` |
| `email` | `Enter a valid email address.` |
| `reason` | `Choose one of: job, collaboration, speaking, other.` |
| `message` | `Write a message of 20–5000 characters.` |
| `body` | `The request body must be valid JSON.` or `The request body must be a JSON object.` |

**429 Too Many Requests**: the client IP used up its limit. `Retry-After` is the number of seconds until the window resets.

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 412

{"ok": false, "error": "rate_limited"}
```

**413 Content Too Large**: the body is over 32 KB (32,768 bytes). The limit leaves room for a 5,000-character message in which every character takes 4 bytes in UTF-8 (emoji). It is rejected before parsing, with or without a `Content-Length` header.

```json
{"ok": false, "error": "payload_too_large"}
```

**503 Service Unavailable**: Resend returned an error, or the send took longer than 10 seconds. The form should show the mailto fallback.

```json
{"ok": false, "error": "email_unavailable"}
```

## Rate limit

- `RATE_LIMIT` per client IP (default `5/10minutes`, a fixed window), on `POST /contact` only. `GET /health` and CORS preflights are not counted.
- Requests rejected with 422 or 413 never reach the limiter, so typos don't use up a visitor's attempts. Honeypot submissions that are otherwise valid are counted.
- The client IP is the connection's address. Set `TRUST_PROXY_HEADERS=true` only when the API runs behind a proxy that sets `X-Forwarded-For`; the first address in that header is then used. Without a proxy, leave it off, or anyone could pick their own key. On Vercel it is `true`: Vercel overwrites `X-Forwarded-For` with the client's public IP "to prevent IP spoofing" ([request headers](https://vercel.com/docs/headers/request-headers)). `X-Real-IP` and `X-Vercel-Forwarded-For` are never read.
- Counts are kept in memory: per process, and reset on restart. On Vercel each function instance has its own counts, so the limit is **per instance, not global**. Accepted for v1 (M9): the honeypot and Resend's daily quota (100 emails) back it up.

## CORS

- Exact origins from `CORS_ALLOW_ORIGINS` (comma-separated), plus any origin that fully matches `CORS_ALLOW_ORIGIN_REGEX` (for example, the site's own Vercel preview URLs; pin the regex to your project name and account slug, as in [`DEPLOY.md`](DEPLOY.md)). An invalid regex stops the app at startup.
- Methods `GET`, `POST`, `OPTIONS`; request header `Content-Type`; no credentials. Preflights are cached for 10 minutes.
- `Retry-After` and `X-Request-ID` are exposed, so the browser form can read them.
- A disallowed origin gets no `Access-Control-Allow-Origin` header, so the browser blocks the response.

## Email

- One notification to `CONTACT_TO_EMAIL`, from `CONTACT_FROM_EMAIL`, with `reply_to` set to the sender's email.
- Subject: `Portfolio contact: <reason> — <name>`, with CR/LF removed.
- A plain-text body, plus an HTML body in which all user content is HTML-escaped.
- No auto-reply to the sender in v1: Resend's test sender (`onboarding@resend.dev`) can only deliver to the account owner's address.
- The Resend SDK is blocking, so it runs in a worker thread with a 10-second limit.
- In development without `RESEND_API_KEY`, messages are accepted (202) and dropped, with a warning in the log.

## Request ids and logs

- Each response has `X-Request-ID`. A valid incoming id (1–64 characters of `A–Z a–z 0–9 . _ -`) is reused; otherwise a new one is generated.
- Every log line from the app carries the request id. Contact lines hold only the outcome and a reason, for example `contact outcome=sent reason=job` or `contact outcome=failed reason=timeout`. They never contain the message, the sender's name or their email.

## Environment variables

Set these in the host's environment (on Vercel: the API project's Environment Variables; production values in [`DEPLOY.md`](DEPLOY.md)), or in `apps/api/.env` for local work (see `apps/api/.env.example`; never commit `.env`).

| Variable | Default | Notes |
| --- | --- | --- |
| `ENV` | `development` | `development` or `production` |
| `RESEND_API_KEY` | — | Secret. Required in production: the app refuses to start without it |
| `CONTACT_TO_EMAIL` | `muhammadilyas.ai.eng@gmail.com` | Notification recipient |
| `CONTACT_FROM_EMAIL` | `Portfolio Contact <onboarding@resend.dev>` | Sender; switch to a verified domain later |
| `CORS_ALLOW_ORIGINS` | `http://localhost:3000` | Comma-separated exact origins |
| `CORS_ALLOW_ORIGIN_REGEX` | — | Optional; must match the whole origin |
| `RATE_LIMIT` | `5/10minutes` | `limits` syntax; an invalid value fails at startup |
| `TRUST_PROXY_HEADERS` | `false` | Use the first `X-Forwarded-For` address as the client IP |

## Running and testing

```bash
pnpm api                                    # dev server on :8000
pnpm api:test                               # pytest (a fake mailer; no network)
uv run --directory apps/api ruff check .
uv run --directory apps/api ruff format --check .
uv run --directory apps/api mypy
```
