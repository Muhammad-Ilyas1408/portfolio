import { expect, test } from "@playwright/test";

test.describe("home at 1280px", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("all six sections are present with their headings", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");

    await expect(
      main.getByRole("heading", { level: 1, name: "Muhammad Ilyas" }),
    ).toBeVisible();
    for (const name of [
      "Highlights",
      "Featured work",
      "Leadership",
      "Credentials",
      "Building something with LLMs, or running a tech community? Let's talk.",
    ]) {
      await expect(main.getByRole("region", { name })).toBeAttached();
      await expect(
        main.getByRole("heading", { level: 2, name }),
      ).toBeAttached();
    }
  });

  test("CTA hrefs are correct", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    const link = (name: string) =>
      main.getByRole("link", { name, exact: true });

    await expect(link("View work")).toHaveAttribute("href", "/projects");
    await expect(link("Download CV")).toHaveAttribute("href", "/cv.pdf");
    await expect(link("Download CV")).toHaveAttribute("download");
    await expect(link("Contact")).toHaveAttribute("href", "/contact");
    await expect(link("Flood-Aware case study")).toHaveAttribute(
      "href",
      "/projects/flood-aware",
    );
    await expect(link("StoryWeave case study")).toHaveAttribute(
      "href",
      "/projects/storyweave",
    );
    await expect(link("AI/ML Engineering Intern experience")).toHaveAttribute(
      "href",
      "/experience",
    );
    await expect(link("All projects")).toHaveAttribute("href", "/projects");
    await expect(link("See the full story")).toHaveAttribute(
      "href",
      "/leadership",
    );
    await expect(link("All credentials")).toHaveAttribute(
      "href",
      "/credentials",
    );
    await expect(
      link("Verify: HackVortex Codestorm 5 — 1st place (team, StoryWeave)"),
    ).toHaveAttribute("href", "https://devpost.com/software/story-weave");
    await expect(link("Email me")).toHaveAttribute(
      "href",
      "mailto:muhammadilyas.ai.eng@gmail.com",
    );
    await expect(link("Contact form")).toHaveAttribute("href", "/contact");
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
    await expect(main.getByRole("link", { name: "View work" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(main.getByRole("link", { name: "Download CV" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      main.getByRole("link", { name: "Contact", exact: true }),
    ).toBeFocused();
  });
});

test("GET /cv.pdf returns 200", async ({ request }) => {
  const response = await request.get("/cv.pdf");

  expect(response.status()).toBe(200);
});

test("the portrait sits above the label on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const portrait = page.getByRole("img", {
    name: "Portrait of Muhammad Ilyas",
  });
  const label = page.getByText("AI/ML ENGINEER", { exact: true });
  const portraitBox = await portrait.boundingBox();
  const labelBox = await label.boundingBox();

  expect(portraitBox && labelBox).toBeTruthy();
  expect(portraitBox!.y + portraitBox!.height).toBeLessThanOrEqual(labelBox!.y);
});

test("home metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Muhammad Ilyas — AI/ML Engineer");
  const description =
    "AI/ML Engineer building grounded, agentic systems — and the communities that build them.";
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
