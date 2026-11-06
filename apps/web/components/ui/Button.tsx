import Link from "next/link";
import type { ComponentProps } from "react";

/** filled = primary (accent fill), outline = secondary, ghost = quiet. */
export type ButtonVariant = "filled" | "outline" | "ghost";
export type ButtonSize = "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  // The only place bg-colored text sits on a full-strength accent fill.
  // M8.6: plus a pointer-follow sheen (spotlight-button, globals.css).
  filled: "spotlight-button bg-signal text-bg hover:bg-signal/90",
  outline:
    "border border-border bg-bg/40 text-text hover:border-text-muted/60 hover:bg-surface-raised",
  ghost: "text-text hover:bg-surface-raised",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

type SharedProps = { variant?: ButtonVariant; size?: ButtonSize };
type AsLink = SharedProps &
  Omit<ComponentProps<typeof Link>, "href"> & { href: string };
type AsButton = SharedProps & ComponentProps<"button"> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

export function buttonClasses(
  variant: ButtonVariant = "filled",
  className = "",
  size: ButtonSize = "md",
) {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, ...rest } = props;
    return (
      <Link {...rest} className={buttonClasses(variant, className, size)} />
    );
  }

  const { variant, size, className, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      className={buttonClasses(variant, className, size)}
    />
  );
}
