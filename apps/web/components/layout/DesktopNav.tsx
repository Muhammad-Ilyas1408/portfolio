"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { desktopNavLinks, isActive } from "./nav";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1">
        {desktopNavLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className="relative inline-flex min-h-11 items-center rounded-md px-3 text-sm text-text-muted transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-2 after:h-px after:bg-signal after:opacity-0 after:transition-opacity after:duration-150 hover:text-text aria-[current=page]:text-text aria-[current=page]:after:opacity-100"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
