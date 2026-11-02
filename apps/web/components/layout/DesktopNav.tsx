"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActive, navLinks } from "./nav";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-4">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className="text-sm text-text-muted underline-offset-4 transition-colors duration-150 hover:text-text aria-[current=page]:text-signal aria-[current=page]:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
