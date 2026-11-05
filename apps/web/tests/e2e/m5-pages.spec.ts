import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = {
  "/experience": { title: "Experience", headings: ["Industry", "Teaching"] },
  "/leadership": {
    title: "Leadership",
    headings: [
      "Progression",
      "Chapter 2 in numbers",
      "Featured initiatives",
      "All events and programmes",
      "Recognition",
    ],
  },
  "/credentials": {
    title: "Credentials",
    headings: ["Degree", "Awards", "Specializations", "Courses", "Training"],
  },
  "/about": {
    title: "About",
    headings: ["Engineering principles", "Skills", "Education"],
  },
} as const;

for (const [url, { title, headings }] of Object.entries(pages)) {
  test(`${url} renders its section headings and metadata`, async ({ page }) => {
    await page.goto(url);

    await expect(
      page.getByRole("main").getByRole("heading", { level: 2 }),
    ).toHaveText([...headings]);
    await expect(page).toHaveTitle(`${title} — Muhammad Ilyas`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${url}$`),
    );
  });

  test(`${url} gives every image non-empty alt text`, async ({ page }) => {
    await page.goto(url);
    // Open every disclosure so hidden photos are checked too.
    for (const summary of await page.locator("details > summary").all()) {
      await summary.click();
    }

    const alts = await page
      .locator("img")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("alt")?.trim() ?? ""),
      );
    // /experience has no images; the others must have some.
    if (url !== "/experience") expect(alts.length).toBeGreaterThan(0);
    for (const alt of alts) expect(alt).not.toBe("");
  });

  test(`${url} has zero axe violations`, async ({ page }) => {
    await page.goto(url);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

test("/credentials#awards resolves to the Awards section", async ({ page }) => {
  await page.goto("/credentials#awards");

  const awards = page.locator("#awards");
  await expect(awards).toBeInViewport();
  await expect(awards.getByRole("heading", { level: 2 })).toHaveText("Awards");
  await expect(awards.locator("img")).toHaveCount(5);
});

test("/leadership#<id> resolves to that event's row", async ({ page }) => {
  await page.goto("/leadership#pentesting-masterclass");

  const row = page.locator("tr#pentesting-masterclass");
  await expect(row).toBeInViewport();
  await expect(row).toContainText("Pentesting Masterclass");
});

test("/experience teaching cards link to existing /leadership rows", async ({
  page,
}) => {
  await page.goto("/experience");
  const links = page.getByRole("link", { name: /on the Leadership page$/ });
  await expect(links).toHaveCount(2);
  const hrefs = await links.evaluateAll((all) =>
    all.map((link) => link.getAttribute("href") ?? ""),
  );

  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator(`tr#${href.split("#")[1]}`)).toBeInViewport();
  }
});

test("/about principle links resolve on the Flood-Aware case study", async ({
  page,
}) => {
  await page.goto("/about");
  const hrefs = await page
    .locator("#principles a")
    .evaluateAll((all) => all.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs).toHaveLength(3);

  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator(`#${href.split("#")[1]}`)).toBeInViewport();
  }
});

test("the TechRise '26 row's Photos disclosure shows its photos", async ({
  page,
}) => {
  await page.goto("/leadership");
  const row = page.locator("tr#techrise-26");
  const photos = row.locator("details img");

  await expect(photos.first()).toBeHidden();
  await row.getByText("Photos (4)").click();
  await expect(photos).toHaveCount(4);
  await expect(photos.first()).toBeVisible();
});

test("the events table stacks as cards on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/leadership");

  await expect(page.locator("#events thead")).toBeHidden();
  await expect(
    page.locator("tr#techrise-26").getByText("Format:", { exact: false }),
  ).toBeVisible();
});

for (const width of [360, 390, 768, 1280]) {
  test(`no horizontal scroll on the M5 pages at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });

    for (const url of Object.keys(pages)) {
      await page.goto(url);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, url).toBe(0);
    }
  });
}
