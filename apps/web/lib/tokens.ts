/**
 * The design tokens as plain values, for generated images (ImageResponse
 * cannot read CSS variables). They mirror :root in app/globals.css; a unit
 * test fails if the two drift apart.
 */
export const tokens = {
  bg: "#0b0f14",
  surface: "#11161d",
  border: "#232b36",
  text: "#e6eaf0",
  "text-muted": "#8a96a6",
  signal: "#5eead4",
  ember: "#f5b454",
} as const;
