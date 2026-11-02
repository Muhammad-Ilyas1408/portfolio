import type { ComponentProps } from "react";

export function Container({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={`mx-auto w-full max-w-[1200px] px-4 md:px-6 ${className}`}
    />
  );
}
