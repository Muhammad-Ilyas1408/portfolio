import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const [name, url] of [
  ["home", "/"],
  ["styleguide", "/styleguide"],
  ["404", "/this-page-does-not-exist"],
]) {
  test(`${name} page has zero axe violations`, async ({ page }) => {
    await page.goto(url);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

test("the 404 page responds 404 and links to Home and Work", async ({
  page,
}) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Work" })).toBeVisible();
});

test("the styleguide is noindex", async ({ page }) => {
  await page.goto("/styleguide");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
