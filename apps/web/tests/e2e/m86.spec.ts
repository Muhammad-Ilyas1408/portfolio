import { expect, test, type Page } from "@playwright/test";

/** A cheap fingerprint of the canvas pixels. */
const frame = (page: Page, selector = 'canvas[data-flow="hero"]') =>
  page
    .locator(selector)
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());

const OWNER_INTRO =
  "I build practical AI applications with Generative AI, LLMs and agentic systems, including RAG-based solutions, on a strong foundation in Machine Learning and Deep Learning. I also work on the backend, integrating AI into software that solves real-world problems.";
// Removed from the hero in the pre-M9 polish (the stats row and the
// leadership band cover it).
const REMOVED_COMMUNITY =
  "Outside of code, I was President of the Computing Students Society";

test.describe("M8.6 hero", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows the owner's text, with the name as the only h1", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.getByRole("region", { name: "Muhammad Ilyas" });

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Muhammad Ilyas",
    );
    for (const text of [
      "Hello, I'm",
      "AI/ML Engineer",
      "Engineering Intelligent Systems,",
      "Creating Real-World Impact",
      OWNER_INTRO,
    ]) {
      await expect(hero.getByText(text, { exact: true })).toBeVisible();
    }
    await expect(
      hero.getByRole("list", { name: "Focus areas" }).getByRole("listitem"),
    ).toHaveText([
      "Generative AI & Agentic Systems",
      "LLM Engineering, RAG & FastAPI",
      "Deep Learning & NLP",
    ]);
    await expect(hero).not.toContainText("Muhammad Ilyas · AI/ML Engineer");
    await expect(hero).not.toContainText(REMOVED_COMMUNITY);
    // The name is the largest text, the role line clearly smaller.
    const size = (text: string) =>
      hero
        .getByText(text, { exact: true })
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const nameSize = await page
      .getByRole("heading", { level: 1 })
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(nameSize).toBeGreaterThan(
      await size("Engineering Intelligent Systems,"),
    );
    expect(await size("Engineering Intelligent Systems,")).toBeGreaterThan(
      await size("AI/ML Engineer"),
    );
  });
});

test.describe("M8.6 motion at normal settings", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the flow lines animate, and pause once scrolled off-screen", async ({
    page,
  }) => {
    await page.goto("/");
    const canvas = page.locator('canvas[data-flow="hero"]');
    await expect(canvas).toHaveAttribute("data-ready", "");
    await expect(canvas).toHaveAttribute("aria-hidden", "true");

    const first = await frame(page);
    await page.waitForTimeout(600);
    expect(await frame(page)).not.toBe(first);

    // Off-screen: no more frames are drawn.
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(400);
    const paused = await frame(page);
    await page.waitForTimeout(600);
    expect(await frame(page)).toBe(paused);
  });

  test("sections below the fold reveal once as they scroll in", async ({
    page,
  }) => {
    await page.goto("/");
    const grid = page.locator("#how-i-work .reveal").last();
    await expect(grid).toHaveAttribute("data-reveal", "hidden");

    await grid.scrollIntoViewIfNeeded();
    await expect(grid).toHaveAttribute("data-reveal", "shown");
    await expect(grid.locator("> li").first()).toHaveCSS("opacity", "1");
  });

  test("interactive cards get the pointer spotlight", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("#what-i-build li > div").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover({ position: { x: 40, y: 60 } });
    await expect(card).toHaveClass(/spotlight/);
    // Within a few px: the card lifts 2px on hover.
    await expect
      .poll(async () =>
        parseFloat(
          await card.evaluate((el) => el.style.getPropertyValue("--sx")),
        ),
      )
      .toBeGreaterThan(36);
    const sx = parseFloat(
      await card.evaluate((el) => el.style.getPropertyValue("--sx")),
    );
    expect(sx).toBeLessThan(44);
  });
});

test.describe("M8.6 motion under reduced motion", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });

  test("the flow lines draw one still frame", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator('canvas[data-flow="hero"]');
    await expect(canvas).toHaveAttribute("data-ready", "");
    const first = await frame(page);
    await page.waitForTimeout(800);
    expect(await frame(page)).toBe(first);
  });

  test("nothing is hidden for a reveal, and cards don't move", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-reveal="hidden"]')).toHaveCount(0);

    const card = page.locator("#what-i-build li > div").first();
    await card.hover();
    await expect(card).toHaveCSS("transform", "none");
    // No spotlight position is ever written.
    expect(await card.evaluate((el) => el.style.getPropertyValue("--sx"))).toBe(
      "",
    );
  });
});

test.describe("M8.6 without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("all content on / is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Muhammad Ilyas",
    );
    await expect(page.locator("[data-reveal]")).toHaveCount(0);
    const reveals = page.locator(".reveal");
    expect(await reveals.count()).toBeGreaterThan(5);
    for (const element of await reveals.all()) {
      await expect(element).toHaveCSS("opacity", "1");
    }
    for (const name of [
      "What I build",
      "Tools I work with",
      "Featured work",
      "How I work",
      "Awards and recognition",
    ]) {
      const heading = page.getByRole("heading", { level: 2, name });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
  });
});

test.describe("M8.6 content additions", () => {
  test("home has a Tech stack section with marked skills", async ({ page }) => {
    await page.goto("/");
    const stack = page.getByRole("region", { name: "Tools I work with" });
    await expect(
      stack.getByRole("list", { name: "GenAI & LLMs" }),
    ).toContainText("LangGraph");
    await expect(
      stack.getByText("(used in a featured project)").first(),
    ).toBeAttached();
  });

  test("timelines show each period's length", async ({ page }) => {
    await page.goto("/experience");
    await expect(
      page.getByRole("list", { name: "Industry roles" }),
    ).toContainText("4 months");

    await page.goto("/leadership");
    await expect(
      page.getByRole("list", { name: "Leadership roles, newest first" }),
    ).toContainText("1 year");
  });

  test("the footer's Back to top link returns to the top", async ({ page }) => {
    await page.goto("/about");
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.getByRole("link", { name: /Back to top/ }).click();
    await expect(page).toHaveURL(/#main$/);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(100);
  });

  test("the theme colour follows the background token", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#0a0a14",
    );
  });
});

test.describe("M8.6 follow-ups: lime accents and the tagline gradient", () => {
  test("the leadership headings put their accent phrase in lime", async ({
    page,
  }) => {
    const lime = "rgb(196, 240, 66)";
    for (const [url, heading] of [
      ["/leadership", page.getByRole("heading", { level: 1 })],
      ["/", page.locator("#leadership-heading")],
    ] as const) {
      await page.goto(url);
      await expect(heading).toHaveText(
        "From a GDSC team member to leading the Computing Students Society.",
      );
      await expect(
        heading.getByText("leading the Computing Students Society.", {
          exact: true,
        }),
      ).toHaveCSS("color", lime);
      // The words before the phrase keep the normal text colour.
      await expect(heading).toHaveCSS("color", "rgb(237, 237, 243)");
    }
  });

  test("the tagline's second line is the palette A preview gradient", async ({
    page,
  }) => {
    await page.goto("/");
    const gradient = page.locator(".text-gradient");
    await expect(gradient).toHaveText("Creating Real-World Impact");
    const image = await gradient.evaluate(
      (el) => getComputedStyle(el).backgroundImage,
    );
    // Plain sRGB, violet to lime at 85% (owner's choice, as in the preview).
    expect(image).toBe(
      "linear-gradient(90deg, rgb(160, 140, 255), rgb(196, 240, 66) 85%)",
    );
    await expect(gradient).toHaveCSS("box-decoration-break", "clone");
    // The first line stays white.
    await expect(
      page.getByText("Engineering Intelligent Systems,", { exact: true }),
    ).toHaveCSS("color", "rgb(237, 237, 243)");
  });
});
