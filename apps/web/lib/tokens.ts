/**
 * The design tokens as plain values, for generated images (ImageResponse
 * cannot read CSS variables). They mirror :root in app/globals.css; a unit
 * test fails if the two drift apart.
 */
export const tokens = {
  bg: "#0a0a14",
  surface: "#12121d",
  border: "#26263b",
  text: "#ededf3",
  "text-muted": "#8f8fa9",
  signal: "#a08cff",
  ember: "#c4f042",
} as const;
