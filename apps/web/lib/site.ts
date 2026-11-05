/**
 * The public origin of the site, used for metadataBase, canonicals, Open
 * Graph URLs, the sitemap and JSON-LD. Set NEXT_PUBLIC_SITE_URL on Vercel
 * (M9); locally it falls back to the dev server.
 */
export function resolveSiteUrl(value: string | undefined) {
  const url = new URL(value?.trim() || "http://localhost:3000");
  return url.origin;
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** An absolute URL on this site for a path such as "/projects". */
export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

/** Every public, indexable route, in sitemap order (not /styleguide). */
export function publicRoutes(caseStudySlugs: string[]) {
  return [
    "/",
    "/projects",
    ...caseStudySlugs.map((slug) => `/projects/${slug}`),
    "/experience",
    "/leadership",
    "/credentials",
    "/about",
    "/contact",
  ];
}
