import { writeFileSync } from "node:fs";

import { expect, type Page, test } from "@playwright/test";

const dir = "tests/screenshots";

/** Scrolls through the page so lazy images load before a full-page capture. */
async function loadLazyImages(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() =>
    [...document.images].every(
      (image) => image.complete || !image.checkVisibility(),
    ),
  );
}

// M8.5 design review: 1440×900 desktop and 390×844 phone.
const reviewSizes = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
] as const;

// M8.5 B: every route at both review sizes.
for (const [name, url] of [
  ["home", "/"],
  ["styleguide", "/styleguide"],
  ["projects", "/projects"],
  ["flood-aware", "/projects/flood-aware"],
  ["storyweave", "/projects/storyweave"],
  ["experience", "/experience"],
  ["leadership", "/leadership"],
  ["credentials", "/credentials"],
  ["about", "/about"],
  ["not-found", "/does-not-exist"],
] as const) {
  for (const { width, height } of reviewSizes) {
    test(`screenshot ${name} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(url);
      await loadLazyImages(page);
      await page.screenshot({
        path: `${dir}/${name}-${width}.png`,
        fullPage: true,
      });
    });
  }
}

test("screenshot open mobile menu at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const button = page.getByRole("button", { name: "Menu" });
  await expect(async () => {
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true", {
      timeout: 500,
    });
  }).toPass();

  await expect(page.locator("#mobile-nav-panel")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: `${dir}/mobile-menu-open-390.png` });
});

// The contact API is mocked (see contact.spec.ts); no request leaves the page.
const contactEndpoint = `${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "")}/contact`;

for (const { width, height } of reviewSizes) {
  test(`screenshot contact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/contact");
    await page.screenshot({
      path: `${dir}/contact-${width}.png`,
      fullPage: true,
    });
  });

  test(`screenshot contact errors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("main").getByLabel("Name", { exact: true }),
    ).toBeFocused();
    await page.screenshot({
      path: `${dir}/contact-errors-${width}.png`,
      fullPage: true,
    });
  });

  test(`screenshot contact success at ${width}px`, async ({ page }) => {
    await page.route(contactEndpoint, (route) =>
      route.fulfill({
        status: 202,
        headers: { "access-control-allow-origin": "*" },
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );
    await page.setViewportSize({ width, height });
    await page.goto("/contact");
    const main = page.getByRole("main");
    await main.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await main.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await main.getByLabel("Reason", { exact: true }).selectOption("job");
    await main
      .getByLabel("Message", { exact: true })
      .fill("Hello, I would like to talk about an engineering role.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByTestId("contact-success")).toBeFocused();
    await page.screenshot({
      path: `${dir}/contact-success-${width}.png`,
      fullPage: true,
    });
  });
}

for (const [name, url] of [
  ["og-default", "/opengraph-image"],
  ["og-flood-aware", "/projects/flood-aware/opengraph-image"],
  ["og-storyweave", "/projects/storyweave/opengraph-image"],
] as const) {
  test(`save ${name}.png`, async ({ request }) => {
    const response = await request.get(url);
    expect(response.headers()["content-type"]).toBe("image/png");
    const body = await response.body();
    // PNG width and height live at bytes 16–23 of the IHDR chunk.
    expect([body.readUInt32BE(16), body.readUInt32BE(20)]).toEqual([1200, 630]);
    writeFileSync(`${dir}/${name}.png`, body);
  });
}
