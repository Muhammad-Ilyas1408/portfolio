import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Reveal robustness (fast-scroll bug on /credentials at 390px). A fake
 * IntersectionObserver lets each test say what the browser would report.
 */
type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let report: Callback;
let options: IntersectionObserverInit | undefined;

class FakeObserver {
  constructor(callback: Callback, init?: IntersectionObserverInit) {
    report = callback;
    options = init;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

const box = (width: number, height: number, top = 2000) =>
  ({ width, height, top, bottom: top + height }) as DOMRectReadOnly;

async function mount(ui: React.ReactElement) {
  // A fresh module per test: the shared observer is module state.
  vi.resetModules();
  const { Reveal } = await import("@/components/motion/Reveal");
  const view = render(<Reveal>{ui}</Reveal>);
  return view.container.querySelector<HTMLElement>(".reveal")!;
}

const first = (target: HTMLElement, isIntersecting: boolean, rect = box(300, 200)) =>
  act(() =>
    report([{ target, isIntersecting, boundingClientRect: rect }]),
  );

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Reveal (fast-scroll fix)", () => {
  it("counts anything above the screen as seen, at threshold 0", async () => {
    await mount(<p>Text</p>);
    expect(options?.threshold).toBe(0);
    // A huge top margin: on screen or scrolled past both intersect.
    expect(parseInt(options?.rootMargin ?? "")).toBeGreaterThanOrEqual(10000);
  });

  it("hides a below-the-fold element, then shows it once reported", async () => {
    const element = await mount(<p>Text</p>);
    first(element, false);
    expect(element).toHaveAttribute("data-reveal", "hidden");
    first(element, true);
    expect(element).toHaveAttribute("data-reveal", "shown");
  });

  it("never hides an element that is on screen or above it", async () => {
    const element = await mount(<p>Text</p>);
    first(element, true, box(300, 200, -5000));
    expect(element).not.toHaveAttribute("data-reveal");
  });

  it("never hides an element with no box (display: none above it)", async () => {
    const element = await mount(<p>Text</p>);
    first(element, false, box(0, 0, 0));
    expect(element).not.toHaveAttribute("data-reveal");
  });

  it("never hides an element inside a closed <details>", async () => {
    vi.resetModules();
    const { Reveal } = await import("@/components/motion/Reveal");
    const view = render(
      <details>
        <summary>More</summary>
        <Reveal>
          <p>Text</p>
        </Reveal>
      </details>,
    );
    const element = view.container.querySelector<HTMLElement>(".reveal")!;
    first(element, false);
    expect(element).not.toHaveAttribute("data-reveal");
  });

  it("safety net: shows a hidden element that is on screen a few seconds after load", async () => {
    vi.useFakeTimers();
    const element = await mount(<p>Text</p>);
    first(element, false);
    expect(element).toHaveAttribute("data-reveal", "hidden");
    // The observer missed it, but it is on screen now.
    element.getBoundingClientRect = () => box(300, 200, 100) as DOMRect;
    act(() => vi.advanceTimersByTime(3000));
    expect(element).toHaveAttribute("data-reveal", "shown");
  });

  it("safety net: shows it once scrolling stops, and leaves elements below the fold for their reveal", async () => {
    vi.useFakeTimers();
    const element = await mount(<p>Text</p>);
    first(element, false);
    element.getBoundingClientRect = () => box(300, 200, 5000) as DOMRect;
    act(() => vi.advanceTimersByTime(3000));
    expect(element).toHaveAttribute("data-reveal", "hidden");

    element.getBoundingClientRect = () => box(300, 200, -800) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      vi.advanceTimersByTime(200);
    });
    expect(element).toHaveAttribute("data-reveal", "shown");
  });
});
