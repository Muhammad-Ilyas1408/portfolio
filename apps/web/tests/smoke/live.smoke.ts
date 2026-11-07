import { expect, test } from "@playwright/test";

import { notFoundRoute, publicRoutes } from "../e2e/routes";

/**
 * Read-only checks of the live site. Run with
 *   SMOKE_BASE_URL=https://muhammad-ilyas.vercel.app pnpm --filter web test:smoke
 * It never submits the contact form and never POSTs anything.
 */
const baseUrl = process.env.SMOKE_BASE_URL;
test.skip(
  !baseUrl,
  "SMOKE_BASE_URL is not set; the live smoke test is skipped.",
);

const siteOrigin = baseUrl ? new URL(baseUrl).origin : "";

/** The API origin from the CSP's connect-src (the only entry besides 'self'). */
function apiOriginFromCsp(csp: string) {
  const connect = csp
    .split(";")
    .map((directive) => directive.trim().split(/\s+/))
    .find(([name]) => name === "connect-src");
  return connect?.slice(1).find((source) => source.startsWith("https://"));
}

test.describe("live site", () => {
  for (const route of [...publicRoutes, "/styleguide"]) {
    test(`${route} returns 200`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
    });
  }

  test("an unknown route returns 404", async ({ request }) => {
    expect((await request.get(notFoundRoute)).status()).toBe(404);
  });

  test("security headers are set and connect-src names the API", async ({
    request,
  }) => {
    const headers = (await request.get("/")).headers();
    const csp = headers["content-security-policy"];

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("unsafe-eval");
    const api = apiOriginFromCsp(csp);
    expect(api, "connect-src has no https API origin").toBeTruthy();
    expect(api).not.toContain("localhost");

    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("robots.txt allows the site, hides /styleguide and names the sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Disallow: /styleguide");
    expect(body).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  });

  test("sitemap.xml lists every public route on this origin", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const locs = [
      ...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g),
    ].map(([, loc]) => loc);
    expect(locs.sort()).toEqual(
      publicRoutes.map((route) => new URL(route, siteOrigin).toString()).sort(),
    );
  });

  test("canonical and Open Graph image use this origin, and the image loads", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBe(`${siteOrigin}/`);

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    expect(ogImage?.startsWith(`${siteOrigin}/`)).toBe(true);
    const image = await request.get(ogImage!);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
  });

  test("the API answers /health to this origin (CORS)", async ({
    page,
    request,
  }) => {
    const csp = (await request.get("/")).headers()["content-security-policy"];
    const api = apiOriginFromCsp(csp);
    expect(api).toBeTruthy();

    // A GET from the live page, so the browser enforces both the site's CSP
    // and the API's CORS rules, exactly as the contact form would.
    await page.goto("/contact");
    const result = await page.evaluate(async (url) => {
      try {
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        return { status: response.status, body: await response.json() };
      } catch (error) {
        return { status: 0, body: String(error) };
      }
    }, `${api}/health`);

    expect(
      result,
      "blocked: check CORS_ALLOW_ORIGINS on the API",
    ).toMatchObject({
      status: 200,
      body: { status: "ok" },
    });
  });
});
