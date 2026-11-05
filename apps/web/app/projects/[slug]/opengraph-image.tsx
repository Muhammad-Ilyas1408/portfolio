import { ImageResponse } from "next/og";

import { getCaseStudySlugs, getProfile, getProject } from "@/content";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";
import { tokens } from "@/lib/tokens";

const profile = getProfile();

export const alt = `Case study by ${profile.name}`;
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

/** Share image for one case study: title, summary and a "Case study" label. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  if (!project) return new Response(null, { status: 404 });

  return new ImageResponse(
    <OgFrame label="CASE STUDY" footer={`${profile.name} · ${profile.title}`}>
      <div
        style={{
          display: "flex",
          fontFamily: "Bricolage",
          fontSize: 96,
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        {project.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 34,
          lineHeight: 1.4,
          color: tokens["text-muted"],
          maxWidth: 1000,
        }}
      >
        {project.summary}
      </div>
    </OgFrame>,
    { ...size, fonts: [...ogFonts] },
  );
}
