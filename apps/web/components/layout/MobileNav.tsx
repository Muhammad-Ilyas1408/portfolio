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
    <div className="lg:hidden">
      <Button
        ref={buttonRef}
        variant="outline"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((current) => !current)}
        className="gap-2.5"
      >
        <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
          <span
            className={`h-px w-full bg-current transition-transform duration-150 ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-full bg-current transition-transform duration-150 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </span>
        Menu
      </Button>
      <nav
        id={PANEL_ID}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-bg px-5 pt-4 pb-10 opacity-100 transition-opacity duration-150 sm:px-6 starting:opacity-0"
      >
        <ul className="divide-y divide-border border-b border-border">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className="group flex min-h-16 items-center justify-between font-display text-2xl font-semibold tracking-tight text-text transition-colors duration-150 hover:text-signal aria-[current=page]:text-signal"
              >
                {label}
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-signal opacity-0 group-aria-[current=page]:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
        <Button
          href={cvHref}
          variant="outline"
          size="lg"
          download
          prefetch={false}
          onClick={close}
          className="mt-8 w-full"
        >
          Download CV
        </Button>
      </nav>
    </div>
  );
}
