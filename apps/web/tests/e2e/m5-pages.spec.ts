import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = {
  "/experience": { title: "Experience", headings: ["Industry", "Teaching"] },
  "/leadership": {
    title: "Leadership",
    // M8.5 B: the presidency numbers come first, then the roles.
    headings: [
      "My presidency in numbers (2025–26)",
      "Progression",
      "Featured initiatives",
      "All events and programmes",
      "Recognition",
    ],
  },
  "/credentials": {
    title: "Credentials",
    headings: [
      "Degree",
      "Awards",
      "Certificates",
      "Specializations",
      "Courses",
      "Training",
    ],
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
  await expect(awards.locator("img")).toHaveCount(6);
});

test("the HackVortex certificate shows under Certificates, not Awards", async ({
  page,
}) => {
  await page.goto("/credentials#certificates");

  const section = page.locator("#certificates");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "Certificates",
  );
  await expect(section).toContainText(
    "Certificate of Participation — HackVortex Codestorm #5",
  );
  await expect(section).toContainText(
    "Presented for an outstanding project in HackVortex Codestorm #5.",
  );
  await expect(
    section.getByRole("img", {
      name: "HackVortex Codestorm #5 certificate of participation presented to Muhammad Ilyas for an outstanding project.",
    }),
  ).toBeVisible();
  await expect(page.locator("#awards")).not.toContainText(
    "Certificate of Participation",
  );
});

test("the CPC 2024 award shows its whole portrait photo", async ({ page }) => {
  await page.goto("/credentials#awards");

  const award = page.locator("#awards article", {
    hasText:
      "Appreciation Award — Connected Pakistan Conference 2024 (CPC 2024)",
  });
  await expect(award).toContainText("Connected Pakistan");
  await expect(award).toContainText(
    "Presented by Connected Pakistan in appreciation of contributions to shaping Pakistan's tech industry.",
  );
  const img = award.getByRole("img", {
    name: "Framed Connected Pakistan Conference 2024 appreciation award presented to Muhammad Ilyas, signed by the Founder CEO of Connected Pakistan.",
  });
  await expect(img).toHaveCSS("object-fit", "contain");
});

test("the presidency note links to the events section", async ({ page }) => {
  await page.goto("/leadership");

  const chapter = page.locator("#chapter");
  await expect(chapter).toContainText(
    "The All events and programmes section below also includes the CSS AI Bootcamp 2025 (before my term) and TechRise '26 (after the report).",
  );
  await chapter.getByRole("link", { name: "All events and programmes" }).click();
  await expect(page).toHaveURL(/#events$/);
  await expect(page.locator("#events")).toBeInViewport();
});

test("Connected Pakistan appears once on the leadership timeline", async ({
  page,
}) => {
  await page.goto("/leadership");

  const main = page.getByRole("main");
  await expect(main).toContainText(
    "Selected as a Connected Pakistan Ambassador, then joined the Connected Pakistan team as a Team Member for the Connected Pakistan Conference 2024 (CPC 2024).",
  );
  await expect(
    main.getByText("Selected as a Connected Pakistan Ambassador", {
      exact: false,
    }),
  ).toHaveCount(1);
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

  // Two tables since M8: the 8 newest events, and the rest under "Show all".
  await page.locator("#all-events > summary").click();
  for (const head of await page.locator("#events thead").all()) {
    await expect(head).toBeHidden();
  }
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
