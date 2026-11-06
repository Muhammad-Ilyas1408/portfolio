import { expect, test } from "@playwright/test";

const sectionHeadings = [
  "Highlights",
  "Where I've worked and led",
  "What I build",
  "Tools I work with",
  "Featured work",
  "How I work",
  "From a GDSC team member to leading the Computing Students Society.",
  "Awards and recognition",
  "Building something with LLMs, or running a tech community? Let's talk.",
];

test.describe("home at 1440px", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("every section is present, in order, with its heading", async ({
    page,
  }) => {
    await page.goto("/");
    const main = page.getByRole("main");

    await expect(
      main.getByRole("heading", {
        level: 1,
        name: "Muhammad Ilyas",
      }),
    ).toBeVisible();
    await expect(main.getByRole("heading", { level: 2 })).toHaveText(
      sectionHeadings,
    );
    for (const name of sectionHeadings) {
      await expect(main.getByRole("region", { name })).toBeAttached();
    }
  });

  test("CTA hrefs are correct", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    const link = (name: string) =>
      main.getByRole("link", { name, exact: true });

    await expect(link("View projects")).toHaveAttribute("href", "/projects");
    await expect(link("Download CV")).toHaveAttribute("href", "/cv.pdf");
    await expect(link("Download CV")).toHaveAttribute("download");
    await expect(
      main.getByRole("link", { name: "Leadership & community" }).first(),
    ).toHaveAttribute("href", "/leadership");
    await expect(link("Read case study: Flood-Aware")).toHaveAttribute(
      "href",
      "/projects/flood-aware",
    );
    await expect(link("Read case study: StoryWeave")).toHaveAttribute(
      "href",
      "/projects/storyweave",
    );
    await expect(link("AI/ML Engineering Intern experience")).toHaveAttribute(
      "href",
      "/experience",
    );
    await expect(link("All projects")).toHaveAttribute("href", "/projects");
    await expect(link("All awards")).toHaveAttribute(
      "href",
      "/credentials#awards",
    );
    await expect(link("Contact me")).toHaveAttribute("href", "/contact");
    await expect(link("muhammadilyas.ai.eng@gmail.com")).toHaveAttribute(
      "href",
      "mailto:muhammadilyas.ai.eng@gmail.com",
    );
  });

  test("stats link to their sources and keep their evidence", async ({
    page,
  }) => {
    await page.goto("/");
    const stats = page.getByRole("region", { name: "Highlights" });

    await expect(stats.getByRole("listitem")).toHaveCount(4);
    await expect(
      stats.getByRole("link", { name: /^2 Live AI projects/ }),
    ).toHaveAttribute("href", "/projects");
    await expect(
      stats.getByRole("link", { name: /^1st Place at HackVortex/ }),
    ).toHaveAttribute("href", "/projects/storyweave");
    await expect(
      stats.getByRole("link", { name: /^3 Coursera specializations/ }),
    ).toHaveAttribute("href", "/credentials#specializations");
    await expect(stats.locator("a[data-verified]")).toHaveCount(1);
    await expect(stats).not.toContainText("348");
  });

  test("the case-study covers are decorative and never repeat the title", async ({
    page,
  }) => {
    await page.goto("/");
    const work = page.getByRole("region", { name: "Featured work" });

    for (const title of ["Flood-Aware", "StoryWeave"]) {
      const card = work.getByRole("article").filter({
        has: page.getByRole("heading", { level: 3, name: title }),
      });
      const cover = card.locator("> div[aria-hidden='true']");
      await expect(cover).toBeAttached();
      await expect(cover).not.toContainText(title);
      await expect(cover.locator("ol > li")).toHaveCount(4);
    }
  });

  test("the stat and hero links resolve to real anchors", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .getByRole("main")
      .locator('a[href^="/"][href*="#"]')
      .evaluateAll((links) => [
        ...new Set(links.map((a) => a.getAttribute("href")!)),
      ]);

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const [path, id] = href.split("#");
      await page.goto(path);
      await expect(page.locator(`[id="${id}"]`)).toBeAttached();
    }
  });

  test("the portrait sits to the right of the h1", async ({ page }) => {
    await page.goto("/");
    const portrait = await page
      .getByRole("img", { name: "Portrait of Muhammad Ilyas" })
      .boundingBox();
    const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();

    expect(portrait!.x).toBeGreaterThan(h1!.x + h1!.width);
  });

  test("Tab reaches the hero CTAs right after the header", async ({ page }) => {
    await page.goto("/");
    const inHeader = () =>
      page.evaluate(() => !!document.activeElement?.closest("body > header"));

    // Skip link, then every header control.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    expect(await inHeader()).toBe(true);
    for (let i = 0; i < 20 && (await inHeader()); i++) {
      await page.keyboard.press("Tab");
    }

    const main = page.getByRole("main");
    await expect(
      main.getByRole("link", { name: "View projects" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(main.getByRole("link", { name: "Download CV" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      main.getByRole("link", { name: "Leadership & community" }).first(),
    ).toBeFocused();
  });

  test("the header stays on screen while scrolling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 2000));
    const header = await page.getByRole("banner").boundingBox();

    expect(header!.y).toBe(0);
  });
});

test("GET /cv.pdf returns 200", async ({ request }) => {
  const response = await request.get("/cv.pdf");

  expect(response.status()).toBe(200);
});

test("the portrait stacks under the hero text on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const portrait = await page
    .getByRole("img", { name: "Portrait of Muhammad Ilyas" })
    .boundingBox();
  const cta = await page
    .getByRole("main")
    .getByRole("link", { name: "View projects" })
    .boundingBox();

  expect(portrait!.y).toBeGreaterThan(cta!.y + cta!.height);
});

test("award photos are shown whole, never cropped", async ({ page }) => {
  await page.goto("/");
  const images = page
    .getByRole("region", { name: "Awards and recognition" })
    .getByRole("img");

  await expect(images).toHaveCount(4);
  for (const image of await images.all()) {
    await expect(image).toHaveCSS("object-fit", "contain");
  }
});

test("hover lifts cards only when motion is allowed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const card = page
    .getByRole("region", { name: "What I build" })
    .getByRole("listitem")
    .first()
    .locator("> div");

  await card.hover();
  await expect(card).toHaveCSS("transform", "none");
});

test("home metadata keeps the name", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Muhammad Ilyas — AI/ML Engineer");
  // M8.6: the owner's tagline and the first sentence of the intro.
  const description =
    "Engineering Intelligent Systems, Creating Real-World Impact. I'm an AI/ML Engineer with a background in Computer Science and a passion for building practical AI applications.";
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    description,
  );
  // Resolved against metadataBase (NEXT_PUBLIC_SITE_URL, localhost here).
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^http:\/\/localhost:3000\/?$/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Muhammad Ilyas — AI/ML Engineer",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    description,
  );
});
