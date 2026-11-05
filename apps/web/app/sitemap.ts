import type { MetadataRoute } from "next";

import { getCaseStudySlugs } from "@/content";
import { absoluteUrl, publicRoutes } from "@/lib/site";

// No lastModified: the content files carry no reliable per-page dates.
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes(getCaseStudySlugs()).map((path) => ({
    url: absoluteUrl(path),
  }));
}
