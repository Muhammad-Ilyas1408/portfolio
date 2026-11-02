import Link from "next/link";
import type { ComponentProps } from "react";

export type ButtonVariant = "filled" | "outline" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  filled: "bg-signal text-bg hover:bg-signal/85",
  outline: "border border-signal text-text hover:bg-surface-raised",
  ghost: "text-text hover:bg-surface-raised",
};

type SharedProps = { variant?: ButtonVariant };
type AsLink = SharedProps &
  Omit<ComponentProps<typeof Link>, "href"> & { href: string };
type AsButton = SharedProps & ComponentProps<"button"> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

function classes(variant: ButtonVariant = "filled", className = "") {
  return `inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors duration-150 ${variantClasses[variant]} ${className}`;
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, className, ...rest } = props;
    return <Link {...rest} className={classes(variant, className)} />;
  }

  const { variant, className, ...rest } = props;
  return (
    <button type="button" {...rest} className={classes(variant, className)} />
  );
}
