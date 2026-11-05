/**
 * Security headers for every route (applied in next.config.ts).
 *
 * script-src and style-src allow 'unsafe-inline': every page is prerendered,
 * and Next.js 16 can only add nonces to dynamically rendered pages (nonces
 * also rule out Partial Prerendering / Cache Components). Its inline RSC
 * payload scripts and next/image's inline styles need 'unsafe-inline' on a
 * static page. See docs/PLAN.md section 7.
 */

/** The origin of NEXT_PUBLIC_API_URL, or undefined when it is unset or invalid. */
export function apiOrigin(apiUrl: string | undefined) {
  if (!apiUrl?.trim()) return undefined;
  try {
    return new URL(apiUrl).origin;
  } catch {
    return undefined;
  }
}

export function contentSecurityPolicy({
  apiUrl,
  isDev = false,
}: {
  apiUrl?: string;
  isDev?: boolean;
}) {
  const api = apiOrigin(apiUrl);
  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    // React needs eval in development only, for its error overlays.
    [
      "script-src",
      ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    ],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "data:", "blob:"]],
    ["font-src", ["'self'"]],
    ["connect-src", ["'self'", ...(api ? [api] : [])]],
    ["frame-ancestors", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["object-src", ["'none'"]],
  ];
  return directives
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

export function securityHeaders(options: { apiUrl?: string; isDev?: boolean }) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(options) },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ];
}
