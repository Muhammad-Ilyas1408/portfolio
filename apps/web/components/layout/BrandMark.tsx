import Link from "next/link";

/** "MI" monogram plus the name; links home. */
export function BrandMark({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-3 rounded-md"
    >
      <span
        aria-hidden="true"
        className="edge-highlight grid size-9 place-items-center rounded-lg border border-border bg-surface font-display text-sm font-bold tracking-tight text-signal transition-colors duration-150 group-hover:border-signal/50"
      >
        {initials}
      </span>
      <span className="font-display text-base font-semibold tracking-tight">
        {name}
      </span>
    </Link>
  );
}
