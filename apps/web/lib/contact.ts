import { z } from "zod";

/**
 * The contact form's contract, mirroring `POST /contact` in docs/API.md.
 * Both the client form and the unit tests use this file.
 */

export const reasonOptions = [
  { value: "job", label: "Job opportunity" },
  { value: "collaboration", label: "Collaboration" },
  { value: "speaking", label: "Speaking or community" },
  { value: "other", label: "Other" },
] as const;

export type Reason = (typeof reasonOptions)[number]["value"];

const reasonValues = reasonOptions.map((option) => option.value) as [
  Reason,
  ...Reason[],
];

export const contactLimits = {
  name: { min: 2, max: 80 },
  message: { min: 20, max: 5000 },
} as const;

/** The visible fields, in form order (used to pick the first invalid one). */
export const contactFields = ["name", "email", "reason", "message"] as const;
export type ContactField = (typeof contactFields)[number];

export const messages = {
  name: `Enter your name (${contactLimits.name.min}–${contactLimits.name.max} characters).`,
  nameControl: "Name must not contain control characters.",
  email: "Enter a valid email address.",
  reason: "Choose a reason.",
  message: `Write a message of ${contactLimits.message.min}–${contactLimits.message.max} characters.`,
} as const;

/**
 * Counts characters the way the API does (Python `len`, code points), so an
 * emoji counts as one character, not two UTF-16 units.
 */
export function charCount(value: string) {
  return Array.from(value).length;
}

// The same set the API rejects: C0 (CR, LF, tab, NUL…), DEL, C1, U+2028/U+2029.
const controlCharacters = /[\u0000-\u001f\u007f-\u009f\p{Zl}\p{Zp}]/u;

const lengthBetween = (min: number, max: number) => (value: string) => {
  const count = charCount(value);
  return count >= min && count <= max;
};

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(lengthBetween(contactLimits.name.min, contactLimits.name.max), {
      error: messages.name,
    })
    .refine((value) => !controlCharacters.test(value), {
      error: messages.nameControl,
    }),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: messages.email })),
  reason: z.enum(reasonValues, { error: messages.reason }),
  message: z
    .string()
    .trim()
    .refine(
      lengthBetween(contactLimits.message.min, contactLimits.message.max),
      { error: messages.message },
    ),
  website: z.string().trim().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;

export function reasonLabel(reason: string | undefined) {
  return reasonOptions.find((option) => option.value === reason)?.label;
}

/** A mailto link to `emailHref` with a "Portfolio contact: <reason>" subject. */
export function buildMailto(emailHref: string, reason?: string) {
  const label = reasonLabel(reason);
  const subject = label ? `Portfolio contact: ${label}` : "Portfolio contact";
  const base = emailHref.startsWith("mailto:")
    ? emailHref
    : `mailto:${emailHref}`;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

/** Retry-After seconds → "N minutes" (rounded up); anything else → "a few minutes". */
export function formatRetryAfter(header: string | null | undefined) {
  const value = header?.trim();
  if (!value || !/^\d+$/.test(value)) return "a few minutes";
  const seconds = Number(value);
  if (seconds <= 0) return "a few minutes";
  const minutes = Math.ceil(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function rateLimitMessage(header: string | null | undefined) {
  return `You've sent several messages recently. Please try again in ${formatRetryAfter(header)}.`;
}

export const statusMessages = {
  success: "Thanks — your message is on its way. I'll reply by email.",
  tooLarge: "Your message is too long. Please shorten it.",
  unavailable: "The message service is unavailable right now.",
} as const;

export type FieldErrors = Partial<Record<ContactField, string>>;

/** Splits the API's 422 `errors` object into form-field errors and general ones. */
export function mapApiErrors(errors: unknown): {
  fieldErrors: FieldErrors;
  general: string[];
} {
  const fieldErrors: FieldErrors = {};
  const general: string[] = [];
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return { fieldErrors, general };
  }
  for (const [key, value] of Object.entries(errors)) {
    if (typeof value !== "string") continue;
    if ((contactFields as readonly string[]).includes(key)) {
      fieldErrors[key as ContactField] = value;
    } else {
      general.push(value);
    }
  }
  return { fieldErrors, general };
}

export type SubmitResult =
  | { kind: "success" }
  | { kind: "validation"; fieldErrors: FieldErrors; general: string[] }
  | { kind: "rate_limited"; message: string }
  | { kind: "too_large" }
  | { kind: "unavailable" };

export const SUBMIT_TIMEOUT_MS = 15_000;

/** Joins the base URL and path without a double slash. */
export function contactEndpoint(apiUrl: string) {
  return `${apiUrl.replace(/\/+$/, "")}/contact`;
}

/** POSTs the payload and turns the response into a `SubmitResult`. Never logs. */
export async function submitContact(
  apiUrl: string,
  payload: ContactPayload,
  { timeoutMs = SUBMIT_TIMEOUT_MS, fetchImpl = fetch } = {},
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(contactEndpoint(apiUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, website: payload.website ?? "" }),
      signal: controller.signal,
    });

    switch (response.status) {
      case 202:
        return { kind: "success" };
      case 422: {
        const body: unknown = await response.json().catch(() => null);
        const errors =
          body && typeof body === "object" && "errors" in body
            ? body.errors
            : undefined;
        const mapped = mapApiErrors(errors);
        if (
          Object.keys(mapped.fieldErrors).length === 0 &&
          mapped.general.length === 0
        ) {
          return { kind: "unavailable" };
        }
        return { kind: "validation", ...mapped };
      }
      case 429:
        return {
          kind: "rate_limited",
          message: rateLimitMessage(response.headers.get("Retry-After")),
        };
      case 413:
        return { kind: "too_large" };
      default:
        return { kind: "unavailable" };
    }
  } catch {
    // Network error, CORS failure or timeout (abort).
    return { kind: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
