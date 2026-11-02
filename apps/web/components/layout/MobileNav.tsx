"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

import { cvHref, isActive, navLinks } from "./nav";

const PANEL_ID = "mobile-nav-panel";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        ref={buttonRef}
        variant="ghost"
        className="border border-border"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </Button>
      <nav
        id={PANEL_ID}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-10 border-b border-border bg-surface px-4 py-4 opacity-100 transition-opacity duration-150 starting:opacity-0"
      >
        <ul>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className="flex min-h-11 items-center text-text underline-offset-4 aria-[current=page]:text-signal aria-[current=page]:underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Button
          href={cvHref}
          variant="outline"
          download
          prefetch={false}
          onClick={close}
          className="mt-4 w-full"
        >
          Download CV
        </Button>
      </nav>
    </div>
  );
}
