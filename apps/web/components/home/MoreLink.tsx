import Link from "next/link";
import type { ReactNode } from "react";

/** A "See more →" text link at the end of a home section. */
export function MoreLink({
  href,
  accent = "signal",
  children,
}: {
  href: string;
  accent?: "signal" | "ember";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold underline-offset-4 transition-colors duration-150 hover:underline ${
        accent === "ember" ? "text-ember" : "text-signal"
      }`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
