# Content guide

How to update the site's content yourself, without Claude. Every word, date, number and link on the site lives in **`apps/web/content/`**. Images and files live in **`apps/web/public/`**. You never need to touch components to change content.

Each content file is TypeScript. Edit it in VS Code: the editor checks the shape as you type and underlines mistakes in red. When the site builds, every entry is checked against the rules in `content/schema.ts`. A broken entry **fails the build**, so it can't reach the live site.

---

## 1. Where everything lives

| What you want to change | File (in `apps/web/content/`) |
| --- | --- |
| Name, title, hero intro, About paragraphs, email, GitHub/LinkedIn/Kaggle, phone and WhatsApp links, portrait path | `profile.ts` |
| Home page sections: hero greeting and tagline, proof strip (exactly 4 claims), stats (up to 5), What I build, leadership band, recognition (up to 4), contact band, leadership path | `home.ts` |
| Projects (cards on `/projects` and home) | `projects.ts` |
| Project case studies (`/projects/<slug>`) | `case-studies.ts` |
| Jobs, internships and community roles (`/experience`, `/leadership`) | `roles.ts` |
| Events and programmes you ran (`/leadership`) | `initiatives.ts` |
| "Chapter in numbers" figures (`/leadership`) | `chapter.ts` |
| Degree, awards, certificates, courses, training (`/credentials`) | `credentials.ts` |
| Skills and the Tech stack section (which projects use each skill) | `skills.ts` |
| About page principles and the DP-SGD explainer | `about.ts` |
| **The rules** every entry must follow. Read them, don't change them | `schema.ts` |
| How the files are loaded and cross-checked. Don't edit | `index.ts` |

Files in `apps/web/public/`:

| File or folder | Used for |
| --- | --- |
| `cv.pdf` | The CV download button |
| `portrait.jpeg` | Your portrait (home hero and `/about`) |
| `images/awards/` | Award and recognition certificate photos |
| `images/certificates/` | Other certificate images |
| `images/events/<event-name>/` | Event photos, one folder per event |

---

## 2. The claim and evidence rules (non-negotiable)

These rules keep the site honest. The build enforces most of them.

1. **Never add something that isn't true or that you can't stand behind.** No guessed dates, numbers, roles or links.
2. A **claim** (any number or result) has a `status`:
   - `"verified"`: it **must** have `evidence` with a public **`https://`** link anyone can open without logging in (a repo, Devpost, a certificate's verify page, an official post). The build fails without it.
   - `"self-reported"`: your own statement, shown without a proof link. Use this when there's no public source.
3. **Evidence** looks like this. `kind` is one of `repo`, `live`, `devpost`, `cert`, `changelog`, `thesis`, `post`, `photo`, `website`:

   ```ts
   evidence: { kind: "devpost", label: "Devpost", url: "https://devpost.com/software/story-weave" }
   ```

4. Every URL in content must start with `https://`. An `http://` link fails the build.
5. **Unknown facts stay out.** If a field is optional and you don't know it, leave it out and add a `// TODO:` comment. Never write "TBD" or placeholder text: it would show on the site.
6. **`published: false`** hides an entry (roles, initiatives, credentials) without deleting it. Use it for anything not ready yet. An empty list shows nothing, never a placeholder.
7. **Dates** are `"YYYY-MM"` (for example `"2025-11"`). Events may use `"YYYY-MM-DD"`. If you only know the year, leave the date out rather than guessing a month.
8. **Team work:** keep `myContributions` (what you personally did) separate from `teamOutcomes` (what the team achieved), and name the team members.

---

## 3. Common tasks

Copy an existing entry in the same file, then change it. That's the safest way to get the shape right.

### Add a project

1. Open `content/projects.ts` and copy an existing project block.
2. Set a new `slug` (lowercase words joined by `-`, for example `"my-new-project"`) and a unique `order` number (1 is first).
3. Fill in `title`, `summary`, `role`, `status` (`"live"`, `"complete"`, `"in-progress"`, `"experiment"` or `"concept"`), `tags`, `stack`, `team`, and `links` (each one is evidence: `https://` only).
4. `results` are claims (section 2). Mark `highlight: true` on the results that should appear on the home card.
5. `featured: true` puts it on the home page. The home layout is designed for the current set (one large card and two smaller ones), so to feature a new project, un-feature another and check the home page afterwards.
6. **Case study (optional):** add a matching entry with the **same slug** to `content/case-studies.ts` (copy an existing one). The page `/projects/<slug>`, its share image and its sitemap entry are created automatically. Also add `"/projects/<slug>"` to `apps/web/tests/e2e/routes.ts`, so the tests check the new page.
7. Add the new slug to the `usedIn` list of the skills it uses, in `content/skills.ts`.

### Add a role (job, internship, community position)

1. Open `content/roles.ts` and copy a role.
2. Set `org`, `title`, `start` (`"YYYY-MM"`), and `end` (leave it out while the role is ongoing).
3. `track: "industry"` shows it on `/experience`. `track: "community"` shows it in the leadership timeline.
4. Add `myContributions` (your own work) and optional `evidence` links.
5. `published: true` when ready.

### Add an award or certificate

1. Put the photo in `public/images/awards/` (awards) or `public/images/certificates/` (other certificates), following the image rules in section 4.
2. Open `content/credentials.ts` and copy a similar entry.
3. Set `name`, `issuer` (required once published), `date` (`"YYYY-MM"`), and `kind` (`"award"`, `"certificate"`, `"course"`, `"specialization"`, `"training"` or `"degree"`).
4. If there's a public verify page (for example `https://www.coursera.org/verify/…`), put it in `verifyUrl`. A link that needs a login doesn't count.
5. `photos: [{ src: "/images/awards/your-file.jpg", alt: "What the photo shows" }]`. The `src` starts at `public/`, without the word `public`.
6. `published: true`.

### Add an event or programme

1. Make a folder `public/images/events/<short-event-name>/` and add the photos (section 4).
2. Open `content/initiatives.ts` and copy an event.
3. Set `name`, `start` (and `end` if it ran over several days), `format` (`"online"` or `"on-campus"`), `focus` (`"technical"`, `"career"` or `"community"`), `myRole`, an optional `venue` and `summary`.
4. `stats` such as "300+ attendees" are claims: `self-reported` unless you link a public source.
5. `featured: true` gives it a large card. Otherwise it appears in the events table.
6. `published: true`.

---

## 4. Image rules

A unit test (`tests/unit/images.test.ts`) checks every image in `public/`. `pnpm test` fails if one breaks these rules:

| Rule | Why |
| --- | --- |
| **JPEG (`.jpg`/`.jpeg`) or PNG only.** Prefer JPEG for photos | Small files; the site converts to modern formats itself |
| **Longest side at most 1600 px** (portrait: 1200 × 1600) | Bigger files only slow the site down |
| **At most 1 MB per file** (aim for 100–300 KB for a JPEG) | Page speed |
| **No EXIF metadata** | Phone photos can carry your **GPS location**, the date and the device. Strip it before adding |

**On Windows, without extra software:**

1. **Resize:** open the photo in **Paint** → **Resize** (Ctrl + W) → **Pixels**, tick **Maintain aspect ratio**, and set the larger side to 1600 (or less) → **OK** → **File** → **Save as** → **JPEG picture**.
2. **Strip EXIF:** in File Explorer, right-click the file → **Properties** → **Details** → **Remove Properties and Personal Information** → **Create a copy with all possible properties removed** → **OK**. Use the copy it creates (it ends in `- Copy`) and rename it.
3. Run `pnpm test` (section 6). If an image still fails, the message names the file and the rule.

**File names:** lowercase, words joined by `-`, no spaces, for example `techrise-26-keynote.jpg`.

**Alt text** (the `alt` field, required): one short sentence about what the image shows, for people using screen readers. For example `"Keynote speaker on stage at TechRise '26"`, not `"image"` or `"photo1"`. Don't start with "Image of". For a certificate, its name is enough.

---

## 5. Replace the CV or the portrait

**CV:** save the new PDF as exactly `apps/web/public/cv.pdf`, replacing the old file. Keep the name, because every download button points at `/cv.pdf`. Check that the PDF opens and is the final version.

**Portrait:** save it as exactly `apps/web/public/portrait.jpeg`:
- 3:4 portrait shape, **1200 × 1600 px**, JPEG, no EXIF (section 4);
- your face roughly centred, a little above the middle, with your shoulders in view. The site crops it into a circle (`components/ui/Portrait.tsx`), and the current crop is tuned for the existing photo;
- the alt text is in `content/profile.ts` (`portrait.alt`).

After replacing either one, run the site locally (`pnpm dev`, then open <http://localhost:3000>) and look at the home page and `/about`.

---

## 6. Run the checks

Open **PowerShell** in the repository folder (`E:\2.0\portfolio`) and run:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- All four must pass. `pnpm build` is where the content rules run.
- For a bigger change, also run the browser tests: `pnpm --filter web test:e2e`. Close anything running on port 3000 first.
- To look at the site: `pnpm dev`, then open <http://localhost:3000>. Stop it with Ctrl + C.

**When a check fails:** read the first red message. It names the file and the field, for example `verified claims need evidence` or `dates must be "YYYY-MM"`. Fix the entry and run the check again. Some tests pin the current content (for example the exact hero text or the list of routes). If one fails only because you changed that content on purpose, update the test's expected value, or ask Claude Code to do it in a session.

---

## 7. Commit and push

Pushing to `main` deploys the site automatically within a few minutes (see `docs/DEPLOY.md`, section 9).

```powershell
cd E:\2.0\portfolio
git status                         # check the files you changed (and nothing else)
git add apps/web/content apps/web/public
git commit -m "content: add <what you added>"
git push
```

Then:

1. On GitHub, open the repository → **Actions**. The CI run should turn green.
2. On Vercel, open the web project → **Deployments**. The new deployment should say **Ready**.
3. Open the live page you changed and check it. Hard-refresh with Ctrl + F5 if you still see the old version.

Commit messages: `content: …` for content, `fix: …` for a correction. Keep each commit to one change.

**Never commit** `.env` files, API keys or private documents. `git status` shows what would be committed. If you see a `.env` file there, stop.
