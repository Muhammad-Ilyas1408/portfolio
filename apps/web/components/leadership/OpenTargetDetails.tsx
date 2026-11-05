"use client";

import { useEffect } from "react";

/**
 * Opens any closed <details> around the element the URL hash points at, then
 * scrolls it into view, so links like /leadership#css-ai-bootcamp-2025 reach
 * events inside "Show all N events". Without JavaScript the disclosure still
 * works by hand.
 */
export function openDetailsForHash(hash: string, doc: Document = document) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;
  const target = doc.getElementById(id);
  if (!target) return false;

  let opened = false;
  for (
    let details = target.closest("details");
    details;
    details = details.parentElement?.closest("details") ?? null
  ) {
    if (!details.open) {
      details.open = true;
      opened = true;
    }
  }
  if (opened) target.scrollIntoView();
  return opened;
}

export function OpenTargetDetails() {
  useEffect(() => {
    const open = () => openDetailsForHash(window.location.hash);
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return null;
}
