import type { Metadata } from "next";

import { getProfile } from "@/content";

type OgImage = {
  url: string;
  width: number;
  height: number;
  type: string;
  alt: string;
};

const profile = getProfile();

function ogImage(url: string, alt: string): OgImage {
  return { url, width: 1200, height: 630, type: "image/png", alt };
}

/** The default share image (app/opengraph-image.tsx). */
export const defaultOgImage = ogImage(
  "/opengraph-image",
  `${profile.name} — ${profile.title}`,
);

/** A case study's share image (app/projects/[slug]/opengraph-image.tsx). */
export const caseStudyOgImage = (slug: string) =>
  ogImage(`/projects/${slug}/opengraph-image`, `Case study by ${profile.name}`);

/**
 * Metadata for one route: title, description, canonical, Open Graph and a
 * large Twitter card. Next.js merges `openGraph` and `twitter` shallowly, and
 * a page that sets `openGraph` drops the parent's file-based image, so every
 * page sets them in full here, image included.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image = defaultOgImage,
}: {
  title: string;
  description: string;
  /** The canonical path, e.g. "/projects". Omit for pages without one (404). */
  path?: string;
  type?: "website" | "article";
  image?: OgImage;
}): Metadata {
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      title,
      description,
      ...(path && { url: path }),
      type,
      siteName: profile.name,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
