"use client";

import { useEffect, useRef } from "react";

export type FlowVariant = "hero" | "band" | "page";
export type FlowAccent = "signal" | "ember";

type Settings = {
  /** Lines in the bundle (capped further on narrow screens). */
  lines: number;
  /** Peak wave height as a share of the canvas height. */
  amplitude: number;
  /** Vertical spread of the bundle as a share of the height. */
  spread: number;
  /** Where the bundle's centre sits, 0 = top, 1 = bottom. */
  centre: number;
  /** Phase drift per second; small = slow. */
  speed: number;
  /** Strongest line opacity. */
  alpha: number;
};

const settings: Record<FlowVariant, Settings> = {
  hero: {
    lines: 26,
    amplitude: 0.16,
    spread: 0.34,
    centre: 0.56,
    speed: 0.11,
    alpha: 0.42,
  },
  band: {
    lines: 18,
    amplitude: 0.18,
    spread: 0.4,
    centre: 0.62,
    speed: 0.09,
    alpha: 0.34,
  },
  page: {
    lines: 14,
    amplitude: 0.12,
    spread: 0.3,
    centre: 0.5,
    speed: 0.06,
    alpha: 0.26,
  },
};

const MAX_DPR = 1.5;
/** 30 fps is plenty for a slow drift and halves the work. */
const FRAME_MS = 1000 / 30;
/** Horizontal step between points on a line, in CSS px. */
const STEP = 14;

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * Ambient background: a bundle of thin lines drifting like a slow wave, in
 * the accent and flow colours at low opacity, faded at the edges. Decorative
 * and aria-hidden. It starts after the page is idle (the hero text is
 * server-rendered and paints first), pauses when off-screen or when the tab
 * is hidden, and draws a single still frame under reduced motion.
 */
export function FlowLines({
  variant = "hero",
  accent = "signal",
  className = "",
}: {
  variant?: FlowVariant;
  accent?: FlowAccent;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const config = settings[variant];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Violet lines (deep violet to lavender), or lime only on leadership
    // pages: the two accents never blend.
    const colorA = cssColor(accent === "ember" ? "--ember" : "--flow-a", "");
    const colorB = accent === "ember" ? colorA : cssColor("--flow-b", colorA);
    if (!colorA) return;
    // Lime is bright: its lines are kept fainter so they never look harsh.
    const alphaScale = accent === "ember" ? 0.5 : 1;

    let width = 0;
    let height = 0;
    let lineCount = config.lines;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let visible = false;
    let started = false;

    // The size comes from ResizeObserver, so nothing here forces a layout.
    let box = { width: 0, height: 0 };
    const resize = () => {
      const rect = box;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Fewer lines on phones: same look, less work.
      lineCount = width < 640 ? Math.ceil(config.lines * 0.6) : config.lines;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, colorA);
      gradient.addColorStop(0.55, colorB);
      gradient.addColorStop(1, colorA);
      context.strokeStyle = gradient;
      context.lineWidth = 1;

      const t = time * config.speed;
      const amp = height * config.amplitude;
      const centre = height * config.centre;
      const spread = height * config.spread;
      const k1 = (Math.PI * 2) / Math.max(width * 0.9, 600);
      const k2 = (Math.PI * 2) / Math.max(width * 0.45, 320);

      for (let i = 0; i < lineCount; i++) {
        const p = lineCount === 1 ? 0.5 : i / (lineCount - 1);
        // Lines near the middle of the bundle are brightest.
        context.globalAlpha =
          alphaScale * config.alpha * (0.25 + 0.75 * Math.sin(Math.PI * p));
        const offset = (p - 0.5) * spread;
        const phase = p * 1.4;
        context.beginPath();
        for (let x = -STEP; x <= width + STEP; x += STEP) {
          const y =
            centre +
            offset * (0.6 + 0.4 * Math.sin(x * k1 * 0.5 + t * 0.7)) +
            amp * Math.sin(x * k1 + t + phase) +
            amp * 0.35 * Math.sin(x * k2 - t * 1.3 + phase * 2);
          if (x === -STEP) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      // Advance by real time but never jump after a pause.
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      draw(elapsed);
    };

    const play = () => {
      if (!started || frame || reduced.matches || !visible || document.hidden)
        return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      started = true;
      resize();
      draw(elapsed);
      canvas.dataset.ready = "";
      play();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    observer.observe(canvas);

    const sizeObserver = new ResizeObserver(([entry]) => {
      box = entry.contentRect;
      if (!started) return;
      resize();
      draw(elapsed);
    });
    sizeObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      if (reduced.matches) {
        pause();
        draw(elapsed);
      } else play();
    };
    reduced.addEventListener("change", onMotionChange);

    // Wait until the browser is idle so the hero's text paints first.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 300);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      pause();
      observer.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
    };
  }, [variant, accent]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-flow={variant}
      className={`flow-canvas pointer-events-none absolute inset-0 size-full ${className}`}
    />
  );
}
