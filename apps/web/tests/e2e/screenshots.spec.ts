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
