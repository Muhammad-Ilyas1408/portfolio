import type { ComponentProps } from "react";

export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={`rounded-lg border border-border bg-surface p-6 ${className}`}
    />
  );
}
