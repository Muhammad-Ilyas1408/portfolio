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
    // Contact is the header's primary button, not a nav link, on desktop.
    await expect(nav.getByRole("link")).toHaveText([
      "Home",
      "Work",
      "Experience",
      "Leadership",
      "Credentials",
      "About",
    ]);
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("href", "/contact");
  });

  test("the active page has aria-current and an accent underline", async ({
    page,
  }) => {
    await page.goto("/leadership");

    const active = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Leadership" });
    await expect(active).toHaveAttribute("aria-current", "page");
    const underline = await active.evaluate(
      (link) => getComputedStyle(link, "::after").opacity,
    );
    expect(underline).toBe("1");
  });

  test("Home is the first nav link, current on / only; the logo links home too", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    const home = nav.getByRole("link").first();
    await expect(home).toHaveText("Home");
    await expect(home).toHaveAttribute("href", "/");
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(
      page.getByRole("banner").locator('a[href="/"]').first(),
    ).toContainText("Muhammad Ilyas");

    await page.goto("/projects");
    await expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("the header and footer never show the phone or WhatsApp", async ({
    page,
  }) => {
    await page.goto("/contact");
    for (const region of ["banner", "contentinfo"] as const) {
      const links = page.getByRole(region).locator('a[href^="tel:"], a[href*="wa.me"]');
      await expect(links).toHaveCount(0);
      await expect(page.getByRole(region)).not.toContainText("315 4710472");
    }
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
    await expect(panel.getByRole("link").first()).toHaveText("Home");
    await expect(panel.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );

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

test("footer columns hold the right links; only external ones open a new tab", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const column = (name: string) =>
    footer
      .getByRole("navigation", { name: `Footer: ${name}` })
      .getByRole("link");

  await expect(column("Navigate")).toHaveText([
    "Home",
    "Work",
    "Experience",
    "Leadership",
    "Credentials",
    "About",
    "Contact",
  ]);
  await expect(column("Work")).toHaveText(["Flood-Aware", "StoryWeave"]);
  await expect(column("Community")).toHaveText(["Leadership", "Credentials"]);
  await expect(column("Connect")).toHaveText([
    "Email",
    "LinkedIn↗",
    "GitHub↗",
    "Download CV",
  ]);

  const email = column("Connect").first();
  await expect(email).toHaveAttribute(
    "href",
    "mailto:muhammadilyas.ai.eng@gmail.com",
  );
  await expect(email).not.toHaveAttribute("target");
  await expect(column("Connect").last()).toHaveAttribute("download");

  for (const index of [1, 2]) {
    await expect(column("Connect").nth(index)).toHaveAttribute(
      "target",
      "_blank",
    );
    await expect(column("Connect").nth(index)).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  }
  // The owner chose to skip Kaggle (M8.5 follow-up).
  await expect(footer.getByRole("link", { name: /Kaggle/ })).toHaveCount(0);
  await expect(
    footer.getByRole("link", { name: "Source on GitHub" }),
  ).toHaveAttribute("target", "_blank");
  await expect(footer).toContainText(
    `© ${new Date().getFullYear()} Muhammad Ilyas`,
  );
  await expect(footer).toContainText("Built with Next.js & FastAPI");
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
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
