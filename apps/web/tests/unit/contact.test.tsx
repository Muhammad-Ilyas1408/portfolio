import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/contact/ContactForm";
import {
  buildMailto,
  contactEndpoint,
  contactSchema,
  formatRetryAfter,
  mapApiErrors,
  messages,
  rateLimitMessage,
  reasonOptions,
  submitContact,
} from "@/lib/contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  reason: "job",
  message: "Hello, I would like to talk about an engineering role.",
  website: "",
};

function fieldError(input: unknown, field: string) {
  const result = contactSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("contact schema", () => {
  it("accepts a valid submission and trims it", () => {
    const result = contactSchema.parse({ ...valid, name: "  Ada  " });
    expect(result.name).toBe("Ada");
  });

  it("enforces name length 2–80 after trimming", () => {
    expect(fieldError({ ...valid, name: "A" }, "name")).toBe(messages.name);
    expect(fieldError({ ...valid, name: "  A  " }, "name")).toBe(messages.name);
    expect(fieldError({ ...valid, name: "Ab" }, "name")).toBeUndefined();
    expect(fieldError({ ...valid, name: "a".repeat(80) }, "name")).toBe(
      undefined,
    );
    expect(fieldError({ ...valid, name: "a".repeat(81) }, "name")).toBe(
      messages.name,
    );
  });

  it("rejects control characters in the name", () => {
    expect(fieldError({ ...valid, name: "Ada\u0000Love" }, "name")).toBe(
      messages.nameControl,
    );
    expect(
      fieldError(
        { ...valid, name: `Ada${String.fromCharCode(0x2028)}Love` },
        "name",
      ),
    ).toBe(messages.nameControl);
  });

  it("enforces message length 20–5000 after trimming", () => {
    expect(fieldError({ ...valid, message: "a".repeat(19) }, "message")).toBe(
      messages.message,
    );
    expect(
      fieldError({ ...valid, message: ` ${"a".repeat(19)} ` }, "message"),
    ).toBe(messages.message);
    expect(
      fieldError({ ...valid, message: "a".repeat(20) }, "message"),
    ).toBeUndefined();
    expect(
      fieldError({ ...valid, message: "a".repeat(5000) }, "message"),
    ).toBeUndefined();
    expect(fieldError({ ...valid, message: "a".repeat(5001) }, "message")).toBe(
      messages.message,
    );
  });

  it("counts an emoji as one character, like the API", () => {
    expect(
      fieldError({ ...valid, message: "😀".repeat(5000) }, "message"),
    ).toBeUndefined();
  });

  it("requires a valid email and a known reason", () => {
    expect(fieldError({ ...valid, email: "not-an-email" }, "email")).toBe(
      messages.email,
    );
    expect(fieldError({ ...valid, reason: "" }, "reason")).toBe(
      messages.reason,
    );
    expect(fieldError({ ...valid, reason: undefined }, "reason")).toBe(
      messages.reason,
    );
  });

  it("offers exactly the API's reasons", () => {
    expect(reasonOptions).toEqual([
      { value: "job", label: "Job opportunity" },
      { value: "collaboration", label: "Collaboration" },
      { value: "speaking", label: "Speaking or community" },
      { value: "other", label: "Other" },
    ]);
  });
});

describe("mapApiErrors", () => {
  it("maps known fields and collects the rest as general errors", () => {
    expect(
      mapApiErrors({
        email: "Enter a valid email address.",
        message: "Write a message of 20–5000 characters.",
        body: "The request body must be valid JSON.",
      }),
    ).toEqual({
      fieldErrors: {
        email: "Enter a valid email address.",
        message: "Write a message of 20–5000 characters.",
      },
      general: ["The request body must be valid JSON."],
    });
  });

  it("ignores non-object input and non-string values", () => {
    expect(mapApiErrors(null)).toEqual({ fieldErrors: {}, general: [] });
    expect(mapApiErrors(["x"])).toEqual({ fieldErrors: {}, general: [] });
    expect(mapApiErrors({ name: 3 })).toEqual({ fieldErrors: {}, general: [] });
  });
});

describe("formatRetryAfter", () => {
  it.each([
    ["600", "10 minutes"],
    ["30", "1 minute"],
    ["60", "1 minute"],
    ["61", "2 minutes"],
    ["412", "7 minutes"],
    [null, "a few minutes"],
    [undefined, "a few minutes"],
    ["", "a few minutes"],
    ["0", "a few minutes"],
    ["soon", "a few minutes"],
    ["Wed, 21 Oct 2026 07:28:00 GMT", "a few minutes"],
  ])("%s → %s", (header, expected) => {
    expect(formatRetryAfter(header)).toBe(expected);
  });

  it("builds the full rate-limit message", () => {
    expect(rateLimitMessage("600")).toBe(
      "You've sent several messages recently. Please try again in 10 minutes.",
    );
  });
});

describe("buildMailto", () => {
  const email = "mailto:owner@example.com";

  it("URL-encodes the subject with the reason label", () => {
    expect(buildMailto(email, "speaking")).toBe(
      "mailto:owner@example.com?subject=Portfolio%20contact%3A%20Speaking%20or%20community",
    );
  });

  it("does not prefill a body", () => {
    expect(buildMailto(email, "job")).not.toContain("body=");
  });

  it("falls back to a plain subject without a reason", () => {
    expect(buildMailto(email)).toBe(
      "mailto:owner@example.com?subject=Portfolio%20contact",
    );
    expect(buildMailto("owner@example.com", "other")).toBe(
      "mailto:owner@example.com?subject=Portfolio%20contact%3A%20Other",
    );
  });
});

describe("submitContact", () => {
  const payload = contactSchema.parse(valid);

  function respond(status: number, body: unknown, headers = {}) {
    return vi.fn<typeof fetch>(async () =>
      Response.json(body, { status, headers }),
    );
  }

  it("posts JSON to <api>/contact", async () => {
    const fetchImpl = respond(202, { ok: true });
    const result = await submitContact("http://api.test/", payload, {
      fetchImpl,
    });

    expect(result).toEqual({ kind: "success" });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("http://api.test/contact");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual(valid);
  });

  it("maps each status to a result", async () => {
    const cases: [number, unknown, Record<string, string>, unknown][] = [
      [
        422,
        { ok: false, errors: { email: "Enter a valid email address." } },
        {},
        {
          kind: "validation",
          fieldErrors: { email: "Enter a valid email address." },
          general: [],
        },
      ],
      [
        429,
        { ok: false, error: "rate_limited" },
        { "Retry-After": "120" },
        {
          kind: "rate_limited",
          message:
            "You've sent several messages recently. Please try again in 2 minutes.",
        },
      ],
      [413, { ok: false }, {}, { kind: "too_large" }],
      [503, { ok: false }, {}, { kind: "unavailable" }],
      [500, { ok: false }, {}, { kind: "unavailable" }],
    ];
    for (const [status, body, headers, expected] of cases) {
      const result = await submitContact("http://api.test", payload, {
        fetchImpl: respond(status, body, headers),
      });
      expect(result).toEqual(expected);
    }
  });

  it("treats a network error or a timeout as unavailable", async () => {
    const failing = vi.fn<typeof fetch>(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(
      await submitContact("http://api.test", payload, { fetchImpl: failing }),
    ).toEqual({ kind: "unavailable" });

    const hanging = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    expect(
      await submitContact("http://api.test", payload, {
        fetchImpl: hanging,
        timeoutMs: 10,
      }),
    ).toEqual({ kind: "unavailable" });
  });

  it("joins the endpoint without a double slash", () => {
    expect(contactEndpoint("http://api.test//")).toBe(
      "http://api.test/contact",
    );
  });
});

describe("ContactForm", () => {
  it("is disabled with a mailto link when the API URL is missing", () => {
    render(<ContactForm email="mailto:owner@example.com" apiUrl="" />);

    expect(
      screen.getByText("The message service is unavailable right now."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Email me at owner@example.com" }),
    ).toHaveAttribute(
      "href",
      "mailto:owner@example.com?subject=Portfolio%20contact",
    );
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("labels every field and hides the honeypot from keyboard and AT", () => {
    render(
      <ContactForm email="mailto:owner@example.com" apiUrl="http://api.test" />,
    );

    for (const label of ["Name", "Email", "Reason", "Message"]) {
      expect(screen.getByLabelText(label)).toBeEnabled();
    }
    expect(screen.getByText("0 / 5000")).toBeInTheDocument();

    const honeypot = screen.getByLabelText("Leave this field empty");
    expect(honeypot).toHaveAttribute("name", "website");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
