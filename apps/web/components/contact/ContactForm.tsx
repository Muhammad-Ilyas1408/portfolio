"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { buttonClasses } from "@/components/ui/Button";
import {
  buildMailto,
  charCount,
  contactFields,
  type ContactInput,
  contactLimits,
  type ContactPayload,
  contactSchema,
  reasonOptions,
  statusMessages,
  submitContact,
} from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; messages: string[]; mailto: boolean };

const fieldClasses =
  "mt-2 block w-full min-h-12 rounded-lg border border-border bg-bg px-4 py-2.5 text-base text-text transition-colors duration-150 placeholder:text-text-muted hover:border-text-muted/60 focus-visible:border-signal aria-invalid:border-danger aria-invalid:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60";

const labelClasses = "text-sm font-semibold text-text";

const defaultValues = { name: "", email: "", message: "", website: "" };

/**
 * The /contact form. Posts JSON to `${apiUrl}/contact` (docs/API.md).
 * Form contents are never logged or stored in the browser.
 */
export function ContactForm({
  email,
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
}: {
  /** The owner's email as a mailto: href, used for the fallback link. */
  email: string;
  apiUrl?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [formKey, setFormKey] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);
  const focusNameOnMount = useRef(false);
  const id = useId();
  const address = email.replace(/^mailto:/, "");

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    reset,
    setFocus,
    control,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    shouldFocusError: true,
  });

  const message = useWatch({ control, name: "message" }) ?? "";

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  useEffect(() => {
    if (focusNameOnMount.current) {
      focusNameOnMount.current = false;
      setFocus("name");
    }
  }, [formKey, setFocus]);

  const enabled = Boolean(apiUrl);
  const sending = status.kind === "sending";

  async function onValid(payload: ContactPayload) {
    if (!apiUrl) return;
    setStatus({ kind: "sending" });
    const result = await submitContact(apiUrl, payload);

    switch (result.kind) {
      case "success":
        setStatus({ kind: "success" });
        return;
      case "validation": {
        let focused = false;
        for (const field of contactFields) {
          const fieldMessage = result.fieldErrors[field];
          if (!fieldMessage) continue;
          setError(
            field,
            { type: "server", message: fieldMessage },
            { shouldFocus: !focused },
          );
          focused = true;
        }
        setStatus(
          result.general.length > 0
            ? { kind: "error", messages: result.general, mailto: false }
            : { kind: "idle" },
        );
        return;
      }
      case "rate_limited":
        setStatus({ kind: "error", messages: [result.message], mailto: false });
        return;
      case "too_large":
        setStatus({
          kind: "error",
          messages: [statusMessages.tooLarge],
          mailto: false,
        });
        return;
      case "unavailable":
        setStatus({
          kind: "error",
          messages: [statusMessages.unavailable],
          mailto: true,
        });
        return;
    }
  }

  function sendAnother() {
    reset(defaultValues);
    focusNameOnMount.current = true;
    setFormKey((key) => key + 1);
    setStatus({ kind: "idle" });
  }

  const describedBy = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(" ") || undefined;

  const errorId = (field: string) => `${id}-${field}-error`;

  const liveText =
    status.kind === "sending"
      ? "Sending your message…"
      : status.kind === "success"
        ? "Message sent."
        : "";

  return (
    <div>
      {/* Every state change is announced from here; it stays mounted. */}
      <div aria-live="polite" aria-atomic="true">
        <p className="sr-only">{liveText}</p>
        {status.kind === "error" && (
          <div
            data-testid="contact-status"
            className="mb-8 rounded-lg border border-danger/60 bg-danger-soft p-5 text-text"
          >
            {status.messages.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {status.mailto && (
              <p className="mt-2">
                <a
                  href={buildMailto(email, getValues("reason"))}
                  className="font-semibold text-signal underline underline-offset-4"
                >
                  Email me at {address}
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      {status.kind === "success" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          data-testid="contact-success"
          className="rounded-lg border border-signal/50 bg-signal-soft p-6 outline-none focus-visible:outline-2 md:p-8"
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full border border-signal/50 font-mono text-signal"
          >
            ✓
          </span>
          <h2 className="mt-5 font-display text-display-3 font-bold">
            Message sent
          </h2>
          <p className="mt-3 text-lg text-text/90">{statusMessages.success}</p>
          <button
            type="button"
            onClick={sendAnother}
            className={buttonClasses("outline", "mt-6")}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          key={formKey}
          noValidate
          aria-labelledby={`${id}-heading`}
          onSubmit={(event) => {
            setStatus((current) =>
              current.kind === "error" ? { kind: "idle" } : current,
            );
            void handleSubmit(onValid)(event);
          }}
        >
          <h2 id={`${id}-heading`} className="sr-only">
            Send a message
          </h2>

          {!enabled && (
            <div className="mb-8 rounded-lg border border-danger/60 bg-danger-soft p-5">
              <p>{statusMessages.unavailable}</p>
              <p className="mt-2">
                <a
                  href={buildMailto(email)}
                  className="font-semibold text-signal underline underline-offset-4"
                >
                  Email me at {address}
                </a>
              </p>
            </div>
          )}

          <fieldset disabled={!enabled} className="m-0 min-w-0 border-0 p-0">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor={`${id}-name`} className={labelClasses}>
                  Name
                </label>
                <input
                  id={`${id}-name`}
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy(errors.name && errorId("name"))}
                  className={fieldClasses}
                  {...register("name")}
                />
                <FieldError
                  id={errorId("name")}
                  message={errors.name?.message}
                />
              </div>

              <div>
                <label htmlFor={`${id}-email`} className={labelClasses}>
                  Email
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy(
                    errors.email && errorId("email"),
                  )}
                  className={fieldClasses}
                  {...register("email")}
                />
                <FieldError
                  id={errorId("email")}
                  message={errors.email?.message}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor={`${id}-reason`} className={labelClasses}>
                Reason
              </label>
              <select
                id={`${id}-reason`}
                defaultValue=""
                aria-invalid={errors.reason ? true : undefined}
                aria-describedby={describedBy(
                  errors.reason && errorId("reason"),
                )}
                className={fieldClasses}
                {...register("reason")}
              >
                <option value="" disabled>
                  Choose a reason
                </option>
                {reasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError
                id={errorId("reason")}
                message={errors.reason?.message}
              />
            </div>

            <div className="mt-6">
              <label htmlFor={`${id}-message`} className={labelClasses}>
                Message
              </label>
              <textarea
                id={`${id}-message`}
                rows={8}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={describedBy(
                  `${id}-message-count`,
                  errors.message && errorId("message"),
                )}
                className={`${fieldClasses} resize-y`}
                {...register("message")}
              />
              <div className="mt-1 flex flex-wrap items-start justify-between gap-x-4">
                <FieldError
                  id={errorId("message")}
                  message={errors.message?.message}
                />
                <p
                  id={`${id}-message-count`}
                  className={`ml-auto font-mono text-sm ${
                    charCount(message) > contactLimits.message.max
                      ? "text-danger"
                      : "text-text-muted"
                  }`}
                >
                  {charCount(message)} / {contactLimits.message.max}
                </p>
              </div>
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor={`${id}-website`}>Leave this field empty</label>
              <input
                id={`${id}-website`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <button
              type="submit"
              aria-busy={sending || undefined}
              disabled={sending || !enabled}
              className={buttonClasses(
                "filled",
                "mt-8 w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
                "lg",
              )}
            >
              {sending && (
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-bg border-t-transparent motion-reduce:animate-none"
                />
              )}
              {sending ? "Sending…" : "Send message"}
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm text-text">
      {/* The icon is decorative (CSS content, not text); the message carries
          the error, so it never relies on color alone. */}
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-danger font-mono text-[0.625rem] leading-none font-bold text-bg before:content-['!']"
      />
      <span className="text-danger">{message}</span>
    </p>
  );
}
