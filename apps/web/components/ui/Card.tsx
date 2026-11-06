import type { ComponentProps } from "react";

export type CardVariant = "default" | "numbered" | "stat";

/** Surface, hairline border, top-edge highlight; brighter border and a 2px lift on hover/focus-within. */
export function cardClasses({
  interactive = false,
  className = "",
}: { interactive?: boolean; className?: string } = {}) {
  return `edge-highlight relative rounded-xl border border-border bg-surface ${
    interactive
      ? "transition duration-150 hover:border-text-muted/50 focus-within:border-text-muted/50 motion-safe:hover:-translate-y-0.5 motion-safe:focus-within:-translate-y-0.5"
      : ""
  } ${className}`;
}

type CardProps = ComponentProps<"div"> & {
  variant?: CardVariant;
  /** For the numbered variant: "01", "02", … */
  number?: string;
  interactive?: boolean;
};

export function Card({
  variant = "default",
  number,
  interactive = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const padding = variant === "stat" ? "p-5 md:p-6" : "p-6 md:p-7";

  return (
    <div
      {...rest}
      className={cardClasses({
        interactive,
        className: `${padding} ${className}`,
      })}
    >
      {variant === "numbered" && number && (
        <p
          aria-hidden="true"
          className="font-mono text-3xl leading-none font-medium tracking-tight text-text-muted/70"
        >
          {number}
        </p>
      )}
      {children}
    </div>
  );
}
