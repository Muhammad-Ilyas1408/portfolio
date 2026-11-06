"use client";

import { useEffect } from "react";

const SELECTOR = ".spotlight, .spotlight-button";

/**
 * One document-level listener for every spotlight card and button: on mouse
 * movement it writes the pointer position into --sx/--sy on the element under
 * the pointer. No React state, so nothing re-renders. Touch and pen input are
 * ignored, and nothing is attached under reduced motion or without hover.
 */
export function SpotlightTracker() {
  useEffect(() => {
    const capable = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!capable.matches) return;

    let frame = 0;
    let pending: { target: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { target, x, y } = pending;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--sx", `${x - rect.left}px`);
      target.style.setProperty("--sy", `${y - rect.top}px`);
      pending = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        SELECTOR,
      );
      if (!target) return;
      pending = { target, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
