import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { notFoundRoute, publicRoutes } from "./routes";

// /contact error and success states are covered in contact.spec.ts.
for (const url of [...publicRoutes, "/styleguide", notFoundRoute]) {
  test(`${url} has zero axe violations`, async ({ page }) => {
    await page.goto(url);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

test("/leadership has zero axe violations with every event shown", async ({
  page,
}) => {
  await page.goto("/leadership");
  await page.locator("#all-events > summary").click();
  await expect(page.locator("#all-events")).toHaveAttribute("open", "");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("the 404 page responds 404 and links to Home and Work", async ({
  page,
}) => {
  const response = await page.goto(notFoundRoute);

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
