import { ImageResponse } from "next/og";

import { getProfile } from "@/content";
import { initials, Monogram, monogramFonts } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <Monogram text={initials(getProfile().name)} size={size.width} />,
    { ...size, fonts: [...monogramFonts] },
  );
}
