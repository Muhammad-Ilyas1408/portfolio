import Link from "next/link";
import type { ComponentProps } from "react";

import { accentText, type Accent } from "./Eyebrow";

export const arrowLinkClasses = (accent: Accent = "signal", className = "") =>
  `group/arrow inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold underline-offset-4 transition-colors duration-150 hover:underline ${accentText[accent]} ${className}`;

/** The arrow shifts 2px on hover and focus (off under reduced motion). */
export function Arrow({ symbol = "→" }: { symbol?: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-150 group-hover/arrow:translate-x-0.5 group-focus-visible/arrow:translate-x-0.5"
    >
      {symbol}
    </span>
  );
}

/** A text link ending in an arrow: "View all →". */
export function ArrowLink({
  accent = "signal",
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { accent?: Accent }) {
  return (
    <Link {...rest} className={arrowLinkClasses(accent, className)}>
      {children}
      <Arrow />
    </Link>
  );
}
