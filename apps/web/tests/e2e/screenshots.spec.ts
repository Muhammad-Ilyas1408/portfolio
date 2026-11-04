import { expect, test } from "@playwright/test";

const dir = "tests/screenshots";

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
] as const) {
  test(`screenshot ${name} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
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
