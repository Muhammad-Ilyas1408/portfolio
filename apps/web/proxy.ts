import { NextResponse, type NextRequest } from "next/server";

import { getCaseStudySlugs } from "@/content";

// With Cache Components, an unknown /projects/[slug] would stream the page
// shell (status 200) before notFound() runs. Rewriting unknown slugs to an
// unmatched path here, before rendering, serves the 404 page with a 404 status.
const slugs = new Set(getCaseStudySlugs());

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(slug)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
}

export const config = { matcher: "/projects/:slug" };
