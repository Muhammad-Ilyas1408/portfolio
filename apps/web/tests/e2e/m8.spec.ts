import { expect, type Page, test } from "@playwright/test";

import { notFoundRoute, publicRoutes } from "./routes";

const caseStudies = ["/projects/flood-aware", "/projects/storyweave"];

/** The heading levels in document order, from h1 to h6. */
const headingLevels = (page: Page) =>
  page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((all) => all.map((h) => Number(h.tagName[1])));

test.describe("heading order", () => {
  for (const url of [...publicRoutes, notFoundRoute]) {
    test(`${url} has one h1 and skips no level`, async ({ page }) => {
      await page.goto(url);
      // Count headings inside closed <details> too: they are still in the outline.
      const levels = await headingLevels(page);

      expect(levels.filter((level) => level === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(
          levels[i] - levels[i - 1],
          `h${levels[i - 1]} → h${levels[i]} at heading ${i + 1}`,
        ).toBeLessThanOrEqual(1);
      }
    });
  }
});

test("every internal link and anchor resolves", async ({ page, request }) => {
  test.setTimeout(120_000);
  const links = new Map<string, string>(); // href → first page it was found on

  for (const url of publicRoutes) {
    await page.goto(url);
    const origin = new URL(page.url()).origin;
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((all) => all.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      // External sites and mailto: links are out of scope (link checker: v1.1).
      if (new URL(href).origin !== origin) continue;
      if (!links.has(href)) links.set(href, url);
    }
  }
  expect(links.size).toBeGreaterThan(20);

  const html = new Map<string, string>();
  for (const [href, foundOn] of links) {
    const target = new URL(href);
    const path = target.pathname + target.search;
    if (!html.has(path)) {
      const response = await request.get(path);
      expect(response.status(), `${path} (linked from ${foundOn})`).toBe(200);
      const type = response.headers()["content-type"] ?? "";
      html.set(path, type.includes("text/html") ? await response.text() : "");
    }
    if (target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      expect(
        html.get(path),
        `#${id} on ${path} (linked from ${foundOn})`,
      ).toContain(`id="${id}"`);
    }
  }
});

test("security headers are set on a built page", async ({ request }) => {
  for (const url of ["/", "/contact", notFoundRoute]) {
    const headers = (await request.get(url)).headers();

    expect(headers["content-security-policy"]).toBe(
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' http://localhost:8000; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
    );
    expect(headers["strict-transport-security"]).toBe(
      "max-age=63072000; includeSubDomains",
    );
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
  }
});

test("no page triggers a CSP violation", async ({ page }) => {
  // The browser fires securitypolicyviolation even for violations that a
  // script catches (e.g. an eval probe), which never reach the console.
  await page.addInitScript(() => {
    const log: string[] = [];
    Object.assign(window, { __cspViolations: log });
    document.addEventListener("securitypolicyviolation", (event) =>
      log.push(
        `${event.violatedDirective} ${event.blockedURI} ${event.sourceFile}`,
      ),
    );
  });

  for (const url of [...publicRoutes, notFoundRoute]) {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const violations = await page.evaluate(
      () =>
        (window as unknown as { __cspViolations: string[] }).__cspViolations,
    );
    expect(violations, url).toEqual([]);
  }
});

test.describe("SEO tags", () => {
  for (const url of publicRoutes) {
    test(`${url} has canonical, Open Graph and Twitter tags`, async ({
      page,
      request,
    }) => {
      await page.goto(url);
      const meta = (selector: string) =>
        page.locator(selector).first().getAttribute("content");

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical!).pathname).toBe(url);
      expect(await meta('meta[property="og:url"]')).toBe(canonical);
      expect(await meta('meta[property="og:title"]')).toBe(await page.title());
      expect(await meta('meta[property="og:description"]')).toBe(
        await meta('meta[name="description"]'),
      );
      expect(await meta('meta[property="og:type"]')).toBe(
        caseStudies.includes(url) ? "article" : "website",
      );
      expect(await meta('meta[name="twitter:card"]')).toBe(
        "summary_large_image",
      );

      const image = await meta('meta[property="og:image"]');
      expect(new URL(image!).pathname).toBe(
        caseStudies.includes(url)
          ? `${url}/opengraph-image`
          : "/opengraph-image",
      );
      expect(await meta('meta[name="twitter:image"]')).toBe(image);
      const response = await request.get(new URL(image!).pathname);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
    });
  }

  test("titles and descriptions are unique across routes", async ({ page }) => {
    const seen = { titles: new Set<string>(), descriptions: new Set<string>() };
    for (const url of publicRoutes) {
      await page.goto(url);
      seen.titles.add(await page.title());
      seen.descriptions.add(
        (await page
          .locator('meta[name="description"]')
          .getAttribute("content"))!,
      );
    }

    expect(seen.titles.size).toBe(publicRoutes.length);
    expect(seen.descriptions.size).toBe(publicRoutes.length);
  });

  test("the icons replace the scaffold favicon", async ({ page, request }) => {
    await page.goto("/");

    const icon = await page.locator('link[rel="icon"]').getAttribute("href");
    const apple = await page
      .locator('link[rel="apple-touch-icon"]')
      .getAttribute("href");
    expect(icon).toMatch(/^\/icon/);
    expect(apple).toMatch(/^\/apple-icon/);
    expect((await request.get(icon!)).status()).toBe(200);
    expect((await request.get(apple!)).status()).toBe(200);
    expect((await request.get("/favicon.ico")).status()).toBe(404);
  });

  test("robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /styleguide");
    expect(robots).toMatch(/Sitemap: http\S+\/sitemap\.xml/);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>(.+?)<\/loc>/g)].map(
      ([, loc]) => new URL(loc).pathname,
    );
    expect(locs).toEqual([...publicRoutes]);
  });
});

test.describe("JSON-LD", () => {
  const jsonLd = (page: Page) =>
    page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((all) => all.map((s) => JSON.parse(s.textContent ?? "")));

  test("every page carries the Person", async ({ page }) => {
    await page.goto("/about");
    const [person] = await jsonLd(page);

    expect(person).toMatchObject({
      "@type": "Person",
      name: "Muhammad Ilyas",
      jobTitle: "AI/ML Engineer",
      alumniOf: { name: "University of Peshawar" },
    });
    expect(person.sameAs).toHaveLength(3);
  });

  test("case studies add a CreativeWork that references the Person", async ({
    page,
  }) => {
    await page.goto("/projects/storyweave");
    const [person, work] = await jsonLd(page);

    expect(work).toMatchObject({ "@type": "CreativeWork", name: "StoryWeave" });
    expect(work.author[0]["@id"]).toBe(person["@id"]);
    expect(work.author).toHaveLength(4);
    expect(work.sameAs).toContain("https://github.com/JawadGigyani/StoryWeave");
  });
});

test.describe("all events toggle", () => {
  test("shows 8 events and opens the rest with the keyboard", async ({
    page,
  }) => {
    await page.goto("/leadership");
    const details = page.locator("#all-events");
    const summary = details.locator("> summary");

    await expect(page.locator("#events tbody tr:visible")).toHaveCount(8);
    await expect(summary).toHaveText(/^Show all \d+ events$/);
    await expect(details).not.toHaveAttribute("open");

    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(page.locator("tr#css-ai-bootcamp-2025")).toBeVisible();
  });

  test("a link to a hidden event opens the disclosure", async ({ page }) => {
    await page.goto("/leadership#css-ai-bootcamp-2025");

    await expect(page.locator("#all-events")).toHaveAttribute("open", "");
    await expect(page.locator("tr#css-ai-bootcamp-2025")).toBeInViewport();
  });

  test("works after a client-side navigation from /experience", async ({
    page,
  }) => {
    await page.goto("/experience");
    await page
      .getByRole("link", {
        name: "CSS AI Bootcamp 2025 on the Leadership page",
      })
      .click();

    await expect(page).toHaveURL(/\/leadership#css-ai-bootcamp-2025$/);
    await expect(page.locator("tr#css-ai-bootcamp-2025")).toBeInViewport();
  });
});
