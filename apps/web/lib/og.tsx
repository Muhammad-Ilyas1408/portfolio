import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { ReactNode } from "react";

import { tokens } from "./tokens";

export const ogSize = { width: 1200, height: 630 };

// Static TTF instances of the site's three fonts (ImageResponse cannot read
// the woff2 files next/font serves). Source and licence: assets/fonts/README.md.
const fontDir = join(process.cwd(), "assets/fonts");
const [bricolage, inter, jetbrains] = await Promise.all(
  [
    "BricolageGrotesque-Bold.ttf",
    "Inter-Regular.ttf",
    "JetBrainsMono-Medium.ttf",
  ].map((file) => readFile(join(fontDir, file))),
);

export const ogFonts = [
  { name: "Bricolage", data: bricolage, weight: 700, style: "normal" },
  { name: "Inter", data: inter, weight: 400, style: "normal" },
  { name: "JetBrains Mono", data: jetbrains, weight: 500, style: "normal" },
] as const satisfies {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 700;
  style: "normal";
}[];

export const monogramFonts = [ogFonts[0]];

/** The shared 1200×630 frame: a mono label, the body, and a footer line. */
export function OgFrame({
  label,
  footer,
  children,
}: {
  label: string;
  footer: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: tokens.bg,
        color: tokens.text,
        fontFamily: "Inter",
        borderLeft: `12px solid ${tokens.signal}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: 28,
          letterSpacing: 2,
          color: tokens.signal,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
      <div
        style={{
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: 24,
          color: tokens["text-muted"],
          borderTop: `2px solid ${tokens.border}`,
          paddingTop: 24,
        }}
      >
        {footer}
      </div>
    </div>
  );
}

/** "MI"-style monogram: Bricolage, signal on bg. */
export function Monogram({
  text,
  size,
  rounded = true,
}: {
  text: string;
  size: number;
  /** iOS masks apple-icon itself, so that one stays square. */
  rounded?: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: tokens.bg,
        color: tokens.signal,
        fontFamily: "Bricolage",
        fontSize: size * 0.5,
        letterSpacing: -size * 0.02,
        borderRadius: rounded ? size * 0.18 : 0,
      }}
    >
      {text}
    </div>
  );
}

/** Initials from a name: "Muhammad Ilyas" → "MI". */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");
}
