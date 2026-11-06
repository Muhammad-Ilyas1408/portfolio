import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const caseStudies = {
  "flood-aware": {
    title: "Flood-Aware",
    // M8.5 B order; the page ends with the home contact band.
    headings: [
      "At a glance",
      "Results",
      "Architecture",
      "Key decisions",
      "Hard problems",
      "What I'd do next",
      "Team & credit",
      "Building something with LLMs, or running a tech community? Let's talk.",
    ],
  },
  storyweave: {
    title: "StoryWeave",
    headings: [
      "At a glance",
      "Results",
      "Architecture",
      "Team & credit",
      "Building something with LLMs, or running a tech community? Let's talk.",
    ],
  },
} as const;

test("/projects shows one card per project", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projects");
  const cards = page.getByRole("main").getByRole("article");
  await expect(cards).toHaveCount(2);
  await expect(
    page.getByRole("heading", { level: 2, name: "Flood-Aware" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "StoryWeave" }),
  ).toBeVisible();
  await expect(
    // M8.5 B: the same card as Featured work on home.
    page.getByRole("link", { name: "Read case study: Flood-Aware" }),
  ).toHaveAttribute("href", "/projects/flood-aware");
});

for (const [slug, { title, headings }] of Object.entries(caseStudies)) {
  test(`${slug} case study renders its sections in order`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 2 }),
    ).toHaveText([...headings]);
    await expect(page).toHaveTitle(`${title} — Case study · Muhammad Ilyas`);
  });
}

test("Flood-Aware shows team credit and its own contributions", async ({
  page,
}) => {
  await page.goto("/projects/flood-aware");

  await expect(
    page.getByText(
      "Team of 2: Muhammad Ilyas, Abdullah Ahmad · Supervised by Dr. Asim Jalal",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "What I did" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What the team did" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", {
      name: "REPO: README: Grounded Multi-Tool Reasoning (opens in a new tab)",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "CHANGELOG: Hotfix 22 (opens in a new tab)",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Live demo (opens in a new tab)" }),
  ).toHaveAttribute("href", "https://flood-aware.vercel.app");
  await expect(
    page.getByRole("navigation", { name: "More projects" }).getByRole("link"),
  ).toHaveAttribute("href", "/projects/storyweave");
});

test("Flood-Aware shows its role card, summary and thesis title", async ({
  page,
}) => {
  await page.goto("/projects/flood-aware");

  const roleCard = page
    .locator("#at-a-glance dt", { hasText: "My role" })
    .locator("..");
  await expect(roleCard).toContainText(
    "Co-developer, BS CS Final Year Project (team of 2)",
  );
  await expect(roleCard).toContainText(
    "Built the LangGraph decision agent, the GIS pipeline, the RAG pipeline, the Next.js frontend, the deployment, and the backend test suite and evaluation.",
  );
  await expect(page.locator("header p.text-lg")).toHaveText(
    "LLM-driven multi-source flood monitoring and decision support for the River Swat Basin.",
  );
  await expect(page.getByText("Thesis title", { exact: true })).toHaveCount(1);
  await expect(
    page.getByText(
      "Flood-Aware: LLM-Driven Multi-Source Flood Monitoring and Decision Support System for the River Swat Basin",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("main")).not.toContainText("Swat River Basin");
});

test("StoryWeave shows the Devpost button and links back", async ({ page }) => {
  await page.goto("/projects/storyweave");

  await expect(
    page.getByRole("link", {
      name: "Devpost (opens in a new tab)",
      exact: true,
    }),
  ).toHaveAttribute("href", "https://devpost.com/software/story-weave");
  await expect(
    page.getByRole("link", {
      name: "DEVPOST: Devpost project page (opens in a new tab)",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "More projects" }).getByRole("link"),
  ).toHaveAttribute("href", "/projects/flood-aware");
});

test("an unknown project slug returns 404", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found",
  );
});

test("the architecture diagram is shown on desktop and the list on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/projects/flood-aware");
  const diagram = page.getByRole("img", { name: /^Flood-Aware architecture/ });
  await expect(diagram).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(diagram).toBeHidden();
  await expect(
    page.locator("section[aria-labelledby='architecture-heading'] ol > li"),
  ).toHaveCount(8);
});

for (const url of [
  "/projects",
  "/projects/flood-aware",
  "/projects/storyweave",
]) {
  test(`${url} has zero axe violations`, async ({ page }) => {
    await page.goto(url);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  for (const width of [360, 390, 768, 1280]) {
    test(`${url} has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(url);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
}
