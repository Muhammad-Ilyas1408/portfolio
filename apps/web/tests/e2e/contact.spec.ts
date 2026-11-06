import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type Route, test } from "@playwright/test";

// playwright.config.ts sets this before the build; every request to it is mocked.
const api = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");
const endpoint = `${api}/contact`;

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-expose-headers": "Retry-After, X-Request-ID",
};

type Reply = {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
};

/** Mocks POST /contact. Returns the JSON bodies the page sent. */
async function mockContact(
  page: Page,
  reply: Reply | ((route: Route) => Promise<void>),
) {
  const sent: unknown[] = [];
  await page.route(endpoint, async (route) => {
    const request = route.request();
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    sent.push(request.postDataJSON());
    if (typeof reply === "function") {
      await reply(route);
      return;
    }
    await route.fulfill({
      status: reply.status,
      headers: { ...corsHeaders, ...reply.headers },
      contentType: "application/json",
      body: JSON.stringify(reply.body ?? {}),
    });
  });
  return sent;
}

const field = (page: Page, label: string) =>
  page.getByRole("main").getByLabel(label, { exact: true });

async function fillValid(page: Page, reason = "Collaboration") {
  await field(page, "Name").fill("Ada Lovelace");
  await field(page, "Email").fill("ada@example.com");
  await field(page, "Reason").selectOption({ label: reason });
  await field(page, "Message").fill(
    "Hello, I would like to talk about an engineering role.",
  );
}

const submit = (page: Page) =>
  page.getByRole("button", { name: /Send message|Sending/ }).click();

test.describe("/contact", () => {
  test("has its metadata, intro and direct links", async ({ page }) => {
    await page.goto("/contact");

    await expect(page).toHaveTitle("Contact · Muhammad Ilyas");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/contact$/,
    );
    // M8.5 B: the intro is now the h1 ("… Let's talk.") and its line.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Building something with LLMs, or running a tech community? Let's talk.",
    );
    await expect(page.getByRole("main")).toContainText(
      "Send a message and I'll reply by email.",
    );

    const aside = page.getByRole("complementary", { name: "Direct links" });
    await expect(aside.getByRole("link", { name: /@/ })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
    await expect(aside.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      /linkedin\.com/,
    );
    await expect(aside.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      /github\.com/,
    );
    await expect(
      aside.getByRole("link", { name: "Download CV" }),
    ).toHaveAttribute("href", "/cv.pdf");
  });

  test("success flow moves focus to the success panel", async ({ page }) => {
    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    const sent = await mockContact(page, async (route) => {
      await held;
      await route.fulfill({
        status: 202,
        headers: corsHeaders,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto("/contact");
    await fillValid(page);
    await field(page, "Message").fill(
      "  Hello, I would like to talk about an engineering role.  ",
    );
    await expect(page.getByText("58 / 5000")).toBeVisible();

    await submit(page);

    const button = page.getByRole("button", { name: "Sending…" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
    release();

    const panel = page.getByTestId("contact-success");
    await expect(panel).toBeFocused();
    await expect(panel).toContainText(
      "Thanks — your message is on its way. I'll reply by email.",
    );
    expect(sent).toEqual([
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        reason: "collaboration",
        message: "Hello, I would like to talk about an engineering role.",
        website: "",
      },
    ]);

    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(field(page, "Name")).toBeFocused();
    await expect(field(page, "Name")).toHaveValue("");
    await expect(field(page, "Message")).toHaveValue("");
  });

  test("client validation blocks an empty submit and focuses the first field", async ({
    page,
  }) => {
    const sent = await mockContact(page, { status: 202, body: { ok: true } });
    await page.goto("/contact");

    await submit(page);

    const name = field(page, "Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    for (const [label, text] of [
      ["Name", "Enter your name (2–80 characters)."],
      ["Email", "Enter a valid email address."],
      ["Reason", "Choose a reason."],
      ["Message", "Write a message of 20–5000 characters."],
    ]) {
      await expect(field(page, label)).toHaveAccessibleDescription(
        new RegExp(text.replace(/[.()]/g, "\\$&")),
      );
    }
    expect(sent).toEqual([]);
  });

  test("a server 422 shows the field error", async ({ page }) => {
    await mockContact(page, {
      status: 422,
      body: { ok: false, errors: { email: "Enter a valid email address." } },
    });
    await page.goto("/contact");
    await fillValid(page);

    await submit(page);

    const email = field(page, "Email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );
    await expect(email).toBeFocused();
  });

  test("a 422 on an unknown field shows a general error", async ({ page }) => {
    await mockContact(page, {
      status: 422,
      body: {
        ok: false,
        errors: { body: "The request body must be valid JSON." },
      },
    });
    await page.goto("/contact");
    await fillValid(page);

    await submit(page);

    await expect(page.getByTestId("contact-status")).toHaveText(
      "The request body must be valid JSON.",
    );
  });

  test("a 429 shows the minutes message", async ({ page }) => {
    await mockContact(page, {
      status: 429,
      body: { ok: false, error: "rate_limited" },
      headers: { "Retry-After": "600" },
    });
    await page.goto("/contact");
    await fillValid(page);

    await submit(page);

    await expect(page.getByTestId("contact-status")).toHaveText(
      "You've sent several messages recently. Please try again in 10 minutes.",
    );
  });

  test("a 413 asks for a shorter message", async ({ page }) => {
    await mockContact(page, {
      status: 413,
      body: { ok: false, error: "payload_too_large" },
    });
    await page.goto("/contact");
    await fillValid(page);

    await submit(page);

    await expect(page.getByTestId("contact-status")).toHaveText(
      "Your message is too long. Please shorten it.",
    );
  });

  const fallbackCases: [string, Reply | ((route: Route) => Promise<void>)][] = [
    ["a 503", { status: 503, body: { ok: false, error: "email_unavailable" } }],
    ["an aborted request", (route) => route.abort("failed")],
  ];
  for (const [name, reply] of fallbackCases) {
    test(`${name} shows the mailto fallback`, async ({ page }) => {
      await mockContact(page, reply);
      await page.goto("/contact");
      await fillValid(page, "Speaking or community");

      await submit(page);

      const status = page.getByTestId("contact-status");
      await expect(status).toContainText(
        "The message service is unavailable right now.",
      );
      await expect(status.getByRole("link")).toHaveAttribute(
        "href",
        /^mailto:[^?]+\?subject=Portfolio%20contact%3A%20Speaking%20or%20community$/,
      );
    });
  }

  test("a request that times out after 15 s shows the mailto fallback", async ({
    page,
  }) => {
    await page.clock.install();
    await mockContact(page, async () => {
      // Never answer; the form's 15 s timeout aborts the request.
    });
    await page.goto("/contact");
    await fillValid(page);

    await submit(page);
    await expect(page.getByRole("button", { name: "Sending…" })).toBeVisible();
    await page.clock.runFor(15_000);

    await expect(page.getByTestId("contact-status")).toContainText(
      "The message service is unavailable right now.",
    );
  });

  test("the honeypot is not reachable by keyboard", async ({ page }) => {
    await page.goto("/contact");
    await field(page, "Name").focus();

    const order: string[] = [];
    for (let i = 0; i < 5; i++) {
      order.push(
        await page.evaluate(() => {
          const active = document.activeElement as HTMLElement | null;
          return active?.getAttribute("name") ?? active?.textContent ?? "";
        }),
      );
      await page.keyboard.press("Tab");
    }

    expect(order).toEqual([
      "name",
      "email",
      "reason",
      "message",
      "Send message",
    ]);
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(honeypot).toHaveAttribute("autocomplete", "off");
  });

  test("has zero axe violations when idle, with errors and on success", async ({
    page,
  }) => {
    // Three full axe scans: about 5s alone, but past the default 30s when
    // the whole suite runs in parallel. Same assertions, more time.
    test.slow();
    await mockContact(page, { status: 202, body: { ok: true } });
    await page.goto("/contact");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

    await submit(page);
    await expect(field(page, "Name")).toHaveAttribute("aria-invalid", "true");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

    await fillValid(page);
    await submit(page);
    await expect(page.getByTestId("contact-success")).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  for (const width of [360, 390, 768, 1280]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/contact");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
});
