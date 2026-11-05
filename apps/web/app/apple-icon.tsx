import { ImageResponse } from "next/og";

import { getProfile } from "@/content";
import { initials, Monogram, monogramFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <Monogram
      text={initials(getProfile().name)}
      size={size.width}
      rounded={false}
    />,
    { ...size, fonts: [...monogramFonts] },
  );
}
