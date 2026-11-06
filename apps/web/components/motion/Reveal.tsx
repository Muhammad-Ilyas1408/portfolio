"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * A one-time gentle reveal (fade plus a 14px rise, 500ms) as the element
 * scrolls in. The content is server-rendered and visible: JS hides it only
 * after checking it is still below the fold, so with JS off, under reduced
 * motion, or for anything on screen, above it, or not rendered, nothing is
 * ever hidden. Anything hidden is shown once it is on screen or above it,
 * however fast the scroll; a safety-net sweep backs that up. The
 * effect itself is CSS (the `reveal` utility in globals.css).
 *
 * `stagger` reveals the direct children one after another (card grids).
 */
export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  stagger = false,
  ...rest
}: {
  /** A list keeps its semantics when its items stagger in. */
  as?: "div" | "ul" | "ol";
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  /** Extra delay in ms, at most a few hundred. */
  delay?: number;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = sharedObserver();
    if (!observer) return;

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      pending.delete(element);
      delete element.dataset.reveal;
    };
  }, []);

  return (
    <Tag
      {...rest}
      // One ref type for the three tags.
      ref={
        ref as RefObject<HTMLDivElement & HTMLUListElement & HTMLOListElement>
      }
      className={`reveal ${className}`}
      data-stagger={stagger ? "" : undefined}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

let observer: IntersectionObserver | null | undefined;
/** Elements currently hidden, waiting to be revealed. */
const pending = new Set<HTMLElement>();

/**
 * The observer's root is stretched far upwards, so "intersecting" means "on
 * screen or anywhere above it". An element that a fast scroll (or a jump to
 * an anchor, or End) carries past without a frame on screen is still shown
 * on the next report. Threshold 0, so tiny and very tall elements both count.
 */
const ROOT_MARGIN = "100000px 0px 0px 0px";
/** The safety net's first sweep, after load or navigation. */
const SWEEP_AFTER_LOAD_MS = 3000;
/** The safety net's sweep once scrolling has stopped. */
const SWEEP_AFTER_SCROLL_MS = 200;

function show(element: HTMLElement) {
  element.dataset.reveal = "shown";
  pending.delete(element);
  observer?.unobserve(element);
}

/** Inside a closed <details>, or with no box (display: none somewhere up). */
function notRendered(element: HTMLElement, rect: DOMRectReadOnly) {
  return (
    (rect.width === 0 && rect.height === 0) ||
    element.closest("details:not([open])") !== null
  );
}

/**
 * Safety net: content must never stay invisible. Shows any hidden element
 * that is on screen or above it, a few seconds after load and whenever
 * scrolling stops. Layout is read only then, never during hydration.
 */
let sweepTimer = 0;
function sweep() {
  sweepTimer = 0;
  for (const element of pending) {
    if (!element.isConnected) pending.delete(element);
    else if (element.getBoundingClientRect().top < window.innerHeight)
      show(element);
  }
}
function scheduleSweep(ms: number) {
  window.clearTimeout(sweepTimer);
  sweepTimer = window.setTimeout(sweep, ms);
}

/**
 * One observer for every Reveal on the page. Its first report for an element
 * says whether it is on screen or above it: if so it is left alone (never
 * hidden); if not it is hidden, and shown as soon as it reaches the screen.
 * Elements that are not rendered are never hidden. No layout reads, so
 * hydration never forces a reflow.
 */
function sharedObserver() {
  if (observer !== undefined) return observer;
  if (!("IntersectionObserver" in window)) return (observer = null);
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (element.dataset.reveal === "hidden") show(element);
          else observer?.unobserve(element);
        } else if (!element.dataset.reveal) {
          if (notRendered(element, entry.boundingClientRect)) {
            observer?.unobserve(element);
          } else {
            element.dataset.reveal = "hidden";
            pending.add(element);
            // After load or a client-side navigation: one sweep, a few
            // seconds on.
            if (!sweepTimer) scheduleSweep(SWEEP_AFTER_LOAD_MS);
          }
        }
      }
    },
    { rootMargin: ROOT_MARGIN, threshold: 0 },
  );
  window.addEventListener(
    "scroll",
    () => {
      if (pending.size > 0) scheduleSweep(SWEEP_AFTER_SCROLL_MS);
    },
    { passive: true },
  );
  return observer;
}
