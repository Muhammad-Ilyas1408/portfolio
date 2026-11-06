import type { ComponentProps } from "react";

/** Max content width with the site's gutters (20px phone, 24px tablet, 32px desktop). */
export function Container({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      {...rest}
      className={`mx-auto w-full max-w-[1264px] px-5 sm:px-6 lg:px-8 ${className}`}
    />
  );
}
