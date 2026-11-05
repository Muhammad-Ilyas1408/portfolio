import Link from "next/link";
import type { ComponentProps } from "react";

/** An inline accent text link with a 44px tap target. */
export function TextLink({
  accent = "signal",
  className = "",
  ...rest
}: ComponentProps<typeof Link> & { accent?: "signal" | "ember" }) {
  return (
    <Link
      {...rest}
      className={`inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold underline-offset-4 transition-colors duration-150 hover:underline ${
        accent === "ember" ? "text-ember" : "text-signal"
      } ${className}`}
    />
  );
}
