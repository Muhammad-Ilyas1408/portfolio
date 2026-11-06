import { expect, test, type Page } from "@playwright/test";

/**
 * Regression: a fast scroll on a phone could carry a section past the screen
 * without a frame, so the observer never saw it and it stayed
 * data-reveal="hidden" (seen on /credentials at 390px). Content must never
 * stay invisible.
 */
const routes = [
  "/",
  "/projects",
  "/projects/flood-aware",
  "/projects/storyweave",
  "/experience",
  "/leadership",
  "/credentials",
  "/about",
  "/contact",
  "/styleguide",
  "/does-not-exist",
];

/** Shorter than the 3s safety-net sweep, so the observer itself is tested. */
const OBSERVER_TIMEOUT = 1500;

/** Jumps down the page in big steps, with no pause between them. */
async function flingToBottom(page: Page) {
  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += 1500) window.scrollTo(0, y);
    window.scrollTo(0, max);
  });
}

for (const { width, height } of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test.describe(`reveal after a fast scroll at ${width}px`, () => {
    test.use({ viewport: { width, height } });

    for (const url of routes) {
      test(`nothing stays hidden on ${url}`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");
        await flingToBottom(page);
        await expect(page.locator('[data-reveal="hidden"]')).toHaveCount(0, {
          timeout: OBSERVER_TIMEOUT,
        });
        // Back at the top, everything that was shown stays shown.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        await expect(page.locator('[data-reveal="hidden"]')).toHaveCount(0);
      });
    }
  });
}
