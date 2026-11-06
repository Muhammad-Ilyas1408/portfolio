import { ImageResponse } from "next/og";

import { getHomeHero, getProfile } from "@/content";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";
import { tokens } from "@/lib/tokens";

const profile = getProfile();
const { tagline } = getHomeHero();

export const alt = `${profile.name} — ${profile.title}`;
export const size = ogSize;
export const contentType = "image/png";

/** The default share image for every route without its own. */
export default function Image() {
  // The headline's segments after the title, e.g. "Generative AI & Agentic Systems".
  const segments = profile.headline.split(" | ").slice(1);

  return new ImageResponse(
    <OgFrame label={profile.title.toUpperCase()} footer={tagline.join(" ")}>
      <div
        style={{
          display: "flex",
          fontFamily: "Bricolage",
          fontSize: 104,
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        {profile.name}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 40,
        }}
      >
        {segments.map((segment) => (
          <div
            key={segment}
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 26,
              color: tokens.text,
              background: tokens.surface,
              border: `2px solid ${tokens.border}`,
              borderRadius: 8,
              padding: "10px 18px",
            }}
          >
            {segment}
          </div>
        ))}
      </div>
    </OgFrame>,
    { ...size, fonts: [...ogFonts] },
  );
}
