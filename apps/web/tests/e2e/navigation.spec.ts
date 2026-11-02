import { expect, type Page, test } from "@playwright/test";

async function openMenu(page: Page) {
  const button = page.getByRole("button", { name: "Menu" });
  // Retries until hydration has attached the click handler.
  await expect(async () => {
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true", {
      timeout: 500,
    });
  }).toPass();
  return button;
}

test.describe("at 1280px", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the header nav is visible and the menu button is not", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Work" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Download CV" }),
    ).toBeVisible();
  });

  test("the skip link moves focus to main", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });
});

test.describe("at 375px", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("Escape closes the menu and returns focus to the button", async ({
    page,
  }) => {
    await page.goto("/");

    const button = await openMenu(page);
    const panel = page.locator("#mobile-nav-panel");
    await expect(panel.getByRole("link", { name: "Work" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("a menu link click closes the menu and returns focus", async ({
    page,
  }) => {
    // /about doesn't exist until M5, and a 404 forces a full reload that resets
    // focus. Never answering the request keeps this page alive. Remove after M5.
    await page.route("**/about**", () => {});
    await page.goto("/");

    const button = await openMenu(page);
    const panel = page.locator("#mobile-nav-panel");
    await panel.getByRole("link", { name: "About" }).click();

    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
  });
});

test("footer links are in order and only external ones open a new tab", async ({
  page,
}) => {
  await page.goto("/");

  const links = page.getByRole("contentinfo").getByRole("link");
  await expect(links).toHaveText([
    "Email",
    "GitHub",
    "LinkedIn",
    "Kaggle",
    "Source on GitHub",
  ]);

  const email = links.first();
  await expect(email).toHaveAttribute(
    "href",
    "mailto:muhammadilyas.ai.eng@gmail.com",
  );
  await expect(email).not.toHaveAttribute("target");
  await expect(email).not.toHaveAttribute("rel");

  for (const index of [1, 2, 3, 4]) {
    await expect(links.nth(index)).toHaveAttribute("target", "_blank");
    await expect(links.nth(index)).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  }
});

for (const width of [360, 390, 768, 1024]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });

    for (const url of ["/", "/styleguide"]) {
      await page.goto(url);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    }
  });
}
