# Deploy guide

A click-by-click guide for putting the portfolio online, written for Windows. You do every step yourself. Claude Code never signs up, logs in or deploys.

**What you will end up with (all free):**

| Piece | Where | Planned URL |
| --- | --- | --- |
| Website (`apps/web`) | Vercel project #1 (Hobby) | `https://muhammad-ilyas.vercel.app` |
| Contact API (`apps/api`) | Vercel project #2 (Hobby) | `https://muhammad-ilyas-api.vercel.app` |
| Email delivery | Resend (free plan) | Sends from `onboarding@resend.dev` to `muhammadilyas.ai.eng@gmail.com` |

Both Vercel projects come from the **same GitHub repository**. Each one simply looks at a different folder.

> **If a name is taken.** A `*.vercel.app` name belongs to whoever claimed it first. If `muhammad-ilyas` or `muhammad-ilyas-api` is not available, pick another project name (for example `muhammad-ilyas-portfolio`). Then use **your real URLs** everywhere this guide says `https://muhammad-ilyas.vercel.app` or `https://muhammad-ilyas-api.vercel.app`, especially in these three variables:
> - `CORS_ALLOW_ORIGINS` on the API project = the website's real URL;
> - `NEXT_PUBLIC_SITE_URL` on the web project = the website's real URL;
> - `NEXT_PUBLIC_API_URL` on the web project = the API's real URL.

**Before you start:** the code is committed and pushed to `main` on GitHub, and CI is green (the green tick next to the latest commit).

---

## 1. Resend: sign up and create an API key

Resend is the service that turns a contact-form message into an email in your inbox.

1. Open <https://resend.com> and click **Sign up**.
2. Sign up with **muhammadilyas.ai.eng@gmail.com**. This matters: the test sender `onboarding@resend.dev` only delivers to the email address of the Resend account, and that is the inbox the contact form sends to.
3. Confirm your email address from the message Resend sends you.
4. Skip any step that asks you to add a domain. We don't use one. Stay on the **Free** plan. Resend's docs don't say whether signup asks for a card; the free plan needs no payment, so if a page asks for payment details, stop and don't enter them.
5. In the left menu, open **API Keys**, then click **Create API Key**.
6. Fill in:
   - **Name:** `portfolio-api-production`
   - **Permission:** **Sending access** (not "Full access"). A sending-only key can't read, change or delete anything in your account, so a leaked key does less harm.
   - **Domain:** leave as **All domains**.
7. Click **Add** (or **Create**). The key starts with `re_`. **Copy it now.** Resend won't show it again.
8. Keep it for step 3.6 only. Paste it into a password manager or a temporary Notepad window you close without saving.

**Never paste the key into:**
- any file in this repository: not `.env.example`, `README`, code, tests or docs;
- `apps/web` or any variable that starts with `NEXT_PUBLIC_`. Those are published to every visitor's browser;
- the **web** Vercel project. Only the **API** project gets it;
- chat messages, screenshots, GitHub issues or commit messages.

If you think it leaked anyway, follow section 11.

---

## 2. Vercel: sign up with GitHub

1. Open <https://vercel.com/signup>.
2. Choose **Hobby** ("I'm working on personal projects"). Hobby is free and is meant for personal, non-commercial use, which fits a portfolio.
3. Enter your name, then click **Continue with GitHub**, and approve access for your GitHub account `Muhammad-Ilyas1408`.
4. If Vercel asks which repositories it may access, choose **Only select repositories** and pick `portfolio`.
5. Don't add a payment method, and don't start a Pro trial.

---

## 3. Deploy the API project first

The website needs the API's URL when it builds, so the API goes first.

1. On the Vercel dashboard click **Add New…** → **Project**.
2. Find `portfolio` under **Import Git Repository** and click **Import**.
3. **Project Name:** `muhammad-ilyas-api`. If Vercel says the name is taken, choose another (see the box at the top).
4. **Root Directory:** click **Edit**, choose `apps/api`, then **Continue**.
5. **Framework Preset:** Vercel should detect **FastAPI** by itself. Leave **Build and Output Settings** as they are. Vercel installs the dependencies from `pyproject.toml` and `uv.lock` with uv, and reads the Python version (3.12) from `.python-version`. The app it serves is named in `pyproject.toml` under `[tool.vercel]` (`app.main:app`).
6. Open **Environment Variables** and add each row below. Click **Add** after each one. Leave the environment selection at its default (all environments), so preview deployments of the API behave like production.

   | Name | Value | Notes |
   | --- | --- | --- |
   | `ENV` | `production` | Turns off `/docs` and requires the key |
   | `RESEND_API_KEY` | your `re_…` key from step 1.7 | The only secret. API project only |
   | `CONTACT_TO_EMAIL` | `muhammadilyas.ai.eng@gmail.com` | Must be the Resend account's email |
   | `CONTACT_FROM_EMAIL` | `Portfolio Contact <onboarding@resend.dev>` | Type it exactly, including `<` and `>` |
   | `CORS_ALLOW_ORIGINS` | `https://muhammad-ilyas.vercel.app` | The website's URL: no trailing `/`, no path |
   | `TRUST_PROXY_HEADERS` | `true` | Rate limit by the visitor's real IP (Vercel sets it) |

   Don't add `CORS_ALLOW_ORIGIN_REGEX` or `RATE_LIMIT`. The defaults are right (see "Preview deployments" in section 9).
7. Click **Deploy** and wait for "Congratulations" (about a minute).
8. Click **Continue to Dashboard**. Under **Domains**, note the API's real URL. It should be `https://muhammad-ilyas-api.vercel.app`.
9. **Test it in the browser:** open `https://muhammad-ilyas-api.vercel.app/health`. You should see:

   ```json
   {"status":"ok","version":"1.0.0"}
   ```

   `https://muhammad-ilyas-api.vercel.app/docs` should say `{"detail":"Not Found"}`. That's correct: docs are off in production.

If the deploy fails, open the deployment, click **Build Logs** and check section 10.

---

## 4. Deploy the web project

1. Dashboard → **Add New…** → **Project** → **Import** `portfolio` again. Yes, the same repository a second time.
2. **Project Name:** `muhammad-ilyas`.
3. **Root Directory:** **Edit** → choose `apps/web` → **Continue**.
4. **Framework Preset:** **Next.js** (detected). Leave **Build and Output Settings** alone: Vercel sees `pnpm-lock.yaml` at the repository root, installs the whole pnpm workspace there, and runs `pnpm build` (= `next build`) in `apps/web`.
5. **Environment Variables.** Add these **before** the first deploy. Both are baked into the site when it builds, so changing them later means a rebuild. The build is set up to **fail on purpose** if either is missing, not `https`, or `localhost`. A failed build keeps the old site online, while a wrong build would publish broken links and share previews.

   | Name | Value | Environments |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://muhammad-ilyas.vercel.app` | all (default) |
   | `NEXT_PUBLIC_API_URL` | `https://muhammad-ilyas-api.vercel.app` | all (default) |
   | `ENABLE_EXPERIMENTAL_COREPACK` | `1` | all (default) |

   - `NEXT_PUBLIC_*` values are **public**: anyone can read them in the page. They are URLs, not secrets. **Never** add `RESEND_API_KEY` here.
   - `ENABLE_EXPERIMENTAL_COREPACK=1` makes Vercel use the exact pnpm version the repo pins (`packageManager` in the root `package.json`, pnpm 12). Without it, Vercel picks pnpm 9 or 10 from the lockfile format, and the install may differ from yours.
6. Click **Deploy**. The first build takes a few minutes.
7. When it's done, open the project → **Settings** → **Build and Deployment**:
   - **Node.js Version:** choose **22.x** (the version CI uses), then **Save**.
   - Under **Root Directory**, check that **Include files outside the root directory in the Build Step** is **Enabled**. The build needs the root `package.json`, `pnpm-lock.yaml` and `pnpm-workspace.yaml`. It is normally on already. (Vercel's docs don't describe this switch, so check it in the dashboard.)
   - If you changed anything on this page, go to **Deployments** → the latest one → **⋯** → **Redeploy**.
8. Open `https://muhammad-ilyas.vercel.app`. The home page should load.

---

## 5. Check that CORS matches the real website URL

The API only answers the website it knows. If the website's URL isn't exactly what you put in `CORS_ALLOW_ORIGINS`, the contact form shows the "email me instead" fallback.

1. Open the web project → **Domains**, and copy the production URL, for example `https://muhammad-ilyas.vercel.app`.
2. Open the **API** project → **Settings** → **Environment Variables**, and compare it with `CORS_ALLOW_ORIGINS`. It must be identical: `https://`, no trailing `/`, no path.
3. If you changed it: **Save**, then **Deployments** → latest → **⋯** → **Redeploy**. Environment variables only apply to new deployments.
4. If the **API** URL turned out different from `https://muhammad-ilyas-api.vercel.app`, update `NEXT_PUBLIC_API_URL` on the **web** project and redeploy the web project.

---

## 6. Run the smoke test against production

This automated check is read-only. It loads every page, checks the security headers, `robots.txt`, `sitemap.xml` and the share image, and calls the API's `/health` from the live site, as a browser would. It **never** sends the contact form.

In **PowerShell**, from the repository folder:

```powershell
cd E:\2.0\portfolio
$env:SMOKE_BASE_URL = "https://muhammad-ilyas.vercel.app"
pnpm --filter web test:smoke
Remove-Item Env:SMOKE_BASE_URL
```

(Once on a new machine, run `pnpm --filter web exec playwright install chromium` first.)

All tests should pass. Common failures:
- **"blocked: check CORS_ALLOW_ORIGINS"**: go back to section 5.
- **sitemap / canonical uses another URL**: `NEXT_PUBLIC_SITE_URL` on the web project is wrong. Fix it and redeploy.
- **connect-src has no https API origin**: `NEXT_PUBLIC_API_URL` is wrong or missing. Fix it and redeploy.

Without `SMOKE_BASE_URL`, every smoke test is skipped. It is never part of `test:e2e` or CI.

---

## 7. Send one real test message

1. Open `https://muhammad-ilyas.vercel.app/contact`.
2. Fill in the form with your own details and a short message such as "Deploy test 1", then click send.
3. You should see the success panel.
4. Check **muhammadilyas.ai.eng@gmail.com** within a minute or two. Look in **Spam** and **Promotions** too. The first messages from `onboarding@resend.dev` sometimes land there. If it's in Spam, mark it **Not spam**.
5. Click **Reply** on the email. It should reply to the address you typed in the form, not to Resend.
6. In Resend → **Emails**, the message should show as **Delivered**.

Send just one. The free plan allows 100 emails a day.

---

## 8. After the deploy

1. **PageSpeed Insights:** <https://pagespeed.web.dev>. Test `https://muhammad-ilyas.vercel.app/`, `/projects/flood-aware`, `/leadership` and `/contact` on **Mobile**. Targets: Performance 95+, Accessibility 100, Best Practices 95+, SEO 100. Network conditions vary, so run a page twice before worrying.
2. **Google Rich Results Test:** <https://search.google.com/test/rich-results>. Test the home page (it should find a **Person**) and `/projects/flood-aware`.
3. **Share previews:**
   - **LinkedIn Post Inspector:** <https://www.linkedin.com/post-inspector/>. Paste the home URL and check the title, description and image. Repeat for `/projects/flood-aware`. If you ever change the image or text, run the inspector again to refresh LinkedIn's cache.
   - **WhatsApp:** send the home URL to yourself ("Message yourself"). A preview with the image should appear. WhatsApp caches previews for a while, so a fix can take time to show.
4. **Google Search Console (optional, free):** <https://search.google.com/search-console>
   1. **Add property** → **URL prefix** → `https://muhammad-ilyas.vercel.app/`.
   2. Choose the **HTML file** verification method and download the file Google gives you (for example `google1234abcd.html`).
   3. Put it in `apps/web/public/`, then commit and push. Vercel redeploys on its own.
   4. Once the deploy is live, click **Verify** in Search Console.
   5. Open **Sitemaps** and submit `sitemap.xml`.

---

## 9. Automatic deploys and previews

- **Every push to `main`** starts a new production deployment of both projects, if Vercel sees changes for them. The web project may skip a build when only `apps/api` changed (Vercel's "skip unaffected projects" feature), and the API project rebuilds on any push. Both are free. The site keeps serving the previous version until the new build succeeds, so a failed build never takes the site down.
- **Every other branch or pull request** gets a **preview deployment** with its own URL, such as `muhammad-ilyas-git-my-branch-<your-account>.vercel.app`. Vercel comments the link on the pull request. Previews use the same environment variables, so their canonical links point at production, which is what you want.
- **The contact form on a preview** shows the mailto fallback, because the API only allows the production website. That's intended. To let previews send messages too, you can set `CORS_ALLOW_ORIGIN_REGEX` on the API project to this pattern, replacing `<scope>` with the account slug shown in your preview URLs:

  ```text
  ^https://muhammad-ilyas-(?:[a-z0-9]{9}|git-[a-z0-9-]+)-<scope>\.vercel\.app$
  ```

  It is matched against the whole origin and only allows this project's preview URLs. Caveat: someone else could register a Vercel project whose name happens to fit the pattern. The API uses no cookies or logins, so the most such a site could do is send you a message, which anyone can already do. Leaving it **empty** (the default) is simplest.
- **Roll back:** project → **Deployments** → pick an older, working deployment → **⋯** → **Promote to Production** (it may be called **Instant Rollback**).

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Contact form shows "email me instead"; the browser console (F12) says **CORS** or "blocked by CORS policy" | `CORS_ALLOW_ORIGINS` on the API doesn't exactly match the website URL | Section 5: fix the value (no trailing `/`), then **redeploy the API** |
| The form says email is unavailable; the API answered **503** `{"ok":false,"error":"email_unavailable"}` | Resend rejected or failed the send: wrong or revoked key, `CONTACT_TO_EMAIL` not your Resend account's email, or the daily quota (100) used up | Resend → **Emails** / **Logs** shows the reason. Fix the env var, then redeploy the API. Over quota: wait until 00:00 UTC |
| API deploy fails or the function crashes at startup: "RESEND_API_KEY is required when ENV=production" | Key missing or misspelled | Add `RESEND_API_KEY` to the **API** project, then redeploy |
| Web build fails with "Production build stopped: fix these Vercel environment variables" | `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_API_URL` is missing, `http://`, or localhost | Set the values from section 4, then redeploy |
| You changed an environment variable but nothing happened | Variables only apply to **new** deployments | **Deployments** → latest → **⋯** → **Redeploy** |
| The site shows old content after a push | The build failed (the old version stays live), or your browser cached the page | Check **Deployments** for a red **Error** and read its **Build Logs**. Otherwise hard-refresh (Ctrl + F5) or use a private window. LinkedIn and WhatsApp previews have their own caches (section 8.3) |
| A project name is already taken | Another Vercel user has it | Pick another name. Update `CORS_ALLOW_ORIGINS`, `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` to the real URLs, and redeploy **both** projects |
| `pnpm install` fails on Vercel with a lockfile or version error | Vercel picked an older pnpm | Check `ENABLE_EXPERIMENTAL_COREPACK=1` on the web project (section 4.5), then redeploy |
| `/health` returns 404 or Vercel can't find the app | Root Directory isn't `apps/api` | API project → **Settings** → **Build and Deployment** → **Root Directory** = `apps/api`, then redeploy |
| Smoke test: every test **skipped** | `SMOKE_BASE_URL` isn't set in this PowerShell window | Set it as in section 6 |

---

## 11. Rotating the Resend key (if it ever leaks)

Do this straight away if the key ended up in a commit, a screenshot, a chat or anywhere public.

1. Resend → **API Keys** → **Create API Key**: name `portfolio-api-production-2`, **Sending access**, **All domains**. Copy the new key.
2. Vercel → **API** project → **Settings** → **Environment Variables** → `RESEND_API_KEY` → **⋯** → **Edit**. Paste the new key, then **Save**.
3. **Deployments** → latest → **⋯** → **Redeploy**. Then test `/health` and send one message (section 7).
4. Back in Resend → **API Keys**, find the **old** key → **⋯** → **Delete** (revoke). Once revoked, the leaked key is useless.
5. If the key was committed to Git, deleting the file isn't enough, because it stays in the history. Revoking it (step 4) is what protects you. Then check Resend → **Emails** for messages you didn't send.

---

## 12. Costs

**Everything in this setup is free:** Vercel Hobby (two projects), Resend's free plan, `*.vercel.app` addresses, GitHub Actions on a public repository. Never enter payment details. The limits below were verified on 8 Nov 2026 from the providers' own docs:

| Service | Limit that matters | What happens at the limit |
| --- | --- | --- |
| Vercel Hobby | Personal, non-commercial use only. Per month: 1,000,000 function invocations, 4 CPU-hours of active CPU, 100 GB fast data transfer, 1,000,000 CDN requests. Per function: 300 s max duration, 2 GB memory, 4.5 MB request/response body, 500 MB Python bundle | "you will have to wait until 30 days have passed before you can use the feature again": paused, **never billed** |
| Resend Free | 100 emails a day, 3,000 a month (a UTC day: resets at 00:00 UTC); 10 API requests a second | Further sends are refused until the quota resets. Free accounts are never charged overage (pay-as-you-go exists only on paid plans) |

A portfolio uses a tiny fraction of these.

**Things that would cost money. Never enable them without deciding it yourself:**
- Upgrading Vercel to **Pro**, or starting a Pro **trial** (it asks for a card and bills when the trial ends).
- Any Vercel add-on, integration or Marketplace product that asks for a plan or payment (for example storage, databases, analytics or observability upgrades). v1 needs none of them.
- Upgrading Resend to a paid plan, or turning on **pay-as-you-go**.
- Buying a **custom domain** (about $10–15 a year). The site works on `*.vercel.app` without one.
- Any other host for the API (Railway, Render, Fly.io, …). The plan is Vercel only.

Analytics are deliberately left out of v1 (planned for v1.1, cookie-free).

---

## Sources (checked 8 Nov 2026)

- Vercel: [FastAPI](https://vercel.com/docs/frameworks/backend/fastapi), [Python runtime](https://vercel.com/docs/functions/runtimes/python), [Python version](https://vercel.com/docs/functions/runtimes/python/python-version), [function limits](https://vercel.com/docs/functions/limitations), [request headers](https://vercel.com/docs/headers/request-headers), [Hobby plan](https://vercel.com/docs/plans/hobby), [monorepos](https://vercel.com/docs/monorepos), [configure a build](https://vercel.com/docs/builds/configure-a-build), [package managers](https://vercel.com/docs/package-managers), [generated URLs](https://vercel.com/docs/deployments/generated-urls), [uv changelog](https://vercel.com/changelog/python-package-manager-uv-is-now-available-for-builds-with-zero).
- Resend: [quotas and limits](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [403 on resend.dev](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain), [API keys](https://resend.com/docs/dashboard/api-keys/introduction), [create API key](https://resend.com/docs/api-reference/api-keys/create-api-key), [pricing](https://resend.com/pricing).
