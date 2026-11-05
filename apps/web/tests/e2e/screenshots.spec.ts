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

for (const [name, url] of [
  ["home", "/"],
  ["styleguide", "/styleguide"],
] as const) {
  for (const width of [390, 1280]) {
    test(`screenshot ${name} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(url);
      await page.screenshot({
        path: `${dir}/${name}-${width}.png`,
        fullPage: true,
      });
    });
  }
}

for (const [name, url, width] of [
  ["projects", "/projects", 1280],
  ["flood-aware", "/projects/flood-aware", 390],
  ["flood-aware", "/projects/flood-aware", 1280],
  ["storyweave", "/projects/storyweave", 1280],
  ["experience", "/experience", 1280],
  ["leadership", "/leadership", 1280],
  ["leadership", "/leadership", 390],
  ["credentials", "/credentials", 1280],
  ["about", "/about", 1280],
] as const) {
  test(`screenshot ${name} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
    await loadLazyImages(page);
    await page.screenshot({
      path: `${dir}/${name}-${width}.png`,
      fullPage: true,
    });
  });
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

for (const width of [390, 1280]) {
  test(`screenshot contact at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/contact");
    await page.screenshot({
      path: `${dir}/contact-${width}.png`,
      fullPage: true,
    });
  });
}

test("screenshot contact errors at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByRole("main").getByLabel("Name", { exact: true }),
  ).toBeFocused();
  await page.screenshot({
    path: `${dir}/contact-errors-390.png`,
    fullPage: true,
  });
});

test("screenshot contact success at 1280px", async ({ page }) => {
  await page.route(contactEndpoint, (route) =>
    route.fulfill({
      status: 202,
      headers: { "access-control-allow-origin": "*" },
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.setViewportSize({ width: 1280, height: 844 });
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
    path: `${dir}/contact-success-1280.png`,
    fullPage: true,
  });
});
