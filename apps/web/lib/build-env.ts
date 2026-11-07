/**
 * Build-time checks for the two public variables (M9).
 *
 * NEXT_PUBLIC_SITE_URL feeds metadataBase, canonicals, Open Graph URLs, the
 * sitemap, robots and JSON-LD; NEXT_PUBLIC_API_URL feeds the contact form and
 * the CSP's connect-src. Both are fixed when `next build` runs, so a missing
 * value cannot be fixed later without a rebuild.
 *
 * A Vercel production build (VERCEL_ENV=production) FAILS when either is
 * missing or wrong: a failed build keeps the previous deployment live, while
 * a "successful" one would ship localhost canonicals, a sitemap pointing at
 * localhost and a disabled contact form, and share previews (LinkedIn,
 * WhatsApp) would cache the wrong URLs. Vercel preview builds only warn.
 * Local builds (no VERCEL_ENV) use the localhost defaults silently.
 */

type Env = Record<string, string | undefined>;

export type BuildEnvReport = { errors: string[]; warnings: string[] };

function checkPublicUrl(name: string, value: string | undefined) {
  if (!value?.trim()) return `${name} is not set.`;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return `${name} is not a valid URL: "${value}".`;
  }
  if (url.protocol !== "https:") return `${name} must use https: "${value}".`;
  if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    return `${name} points at ${url.hostname}: "${value}".`;
  }
  return undefined;
}

export function checkBuildEnv(env: Env): BuildEnvReport {
  const vercelEnv = env.VERCEL_ENV;
  if (vercelEnv !== "production" && vercelEnv !== "preview") {
    return { errors: [], warnings: [] };
  }
  const problems = [
    checkPublicUrl("NEXT_PUBLIC_SITE_URL", env.NEXT_PUBLIC_SITE_URL),
    checkPublicUrl("NEXT_PUBLIC_API_URL", env.NEXT_PUBLIC_API_URL),
  ].filter((problem): problem is string => problem !== undefined);

  return vercelEnv === "production"
    ? { errors: problems, warnings: [] }
    : { errors: [], warnings: problems };
}

/** Throws on errors and prints warnings; called from next.config.ts. */
export function assertBuildEnv(env: Env) {
  const { errors, warnings } = checkBuildEnv(env);
  for (const warning of warnings) {
    console.warn(`\n⚠ ${warning} See docs/DEPLOY.md (step 4).\n`);
  }
  if (errors.length > 0) {
    throw new Error(
      [
        "Production build stopped: fix these Vercel environment variables, then redeploy.",
        ...errors.map((error) => `  - ${error}`),
        "See docs/DEPLOY.md, step 4.",
      ].join("\n"),
    );
  }
}
