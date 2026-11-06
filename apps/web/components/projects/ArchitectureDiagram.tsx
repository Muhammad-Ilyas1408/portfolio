import type { CaseStudy } from "@/content/schema";

type Step = CaseStudy["architecture"]["steps"][number];

// Layout in viewBox units. The SVG scales to its container width.
const WIDTH = 1000;
const GAP_X = 56;
const GAP_Y = 56;
const BOX_H = 120;
const PAD = 18;
const LINE_H = 20;
const CHAR_W = 8; // a safe average for 15-unit Inter
const ARROW = 8;

/** Greedy word wrap to at most `max` characters per line. */
export function wrapLabel(text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** "X architecture in 4 steps: A, then B, then C, then D." */
export function diagramSummary(title: string, steps: Step[]) {
  return `${title} architecture in ${steps.length} steps: ${steps
    .map((step) => step.label)
    .join(", then ")}.`;
}

/**
 * Two rows that read as a snake: the first row left to right, then down, then
 * the second row right to left. Each box is numbered, so the order never
 * depends on reading direction alone.
 */
function layout(count: number) {
  const cols = Math.ceil(count / 2);
  const boxW = (WIDTH - (cols - 1) * GAP_X) / cols;
  const boxes = Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols);
    const inRow = index % cols;
    const col = row === 0 ? inRow : cols - 1 - inRow;
    return { x: col * (boxW + GAP_X), y: row * (BOX_H + GAP_Y), row };
  });
  return { boxW, boxes, height: 2 * BOX_H + GAP_Y };
}

function Arrow({ x1, y1, x2, y2 }: Record<"x1" | "y1" | "x2" | "y2", number>) {
  const horizontal = y1 === y2;
  const dir = horizontal ? Math.sign(x2 - x1) : Math.sign(y2 - y1);
  const head = horizontal
    ? `${x2},${y2} ${x2 - dir * ARROW},${y2 - ARROW / 1.4} ${x2 - dir * ARROW},${y2 + ARROW / 1.4}`
    : `${x2},${y2} ${x2 - ARROW / 1.4},${y2 - dir * ARROW} ${x2 + ARROW / 1.4},${y2 - dir * ARROW}`;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={horizontal ? x2 - dir * ARROW : x2}
        y2={horizontal ? y2 : y2 - dir * ARROW}
        className="stroke-signal"
        strokeWidth={2}
      />
      <polygon points={head} className="fill-signal" />
    </g>
  );
}

export function ArchitectureDiagram({
  title,
  steps,
}: {
  title: string;
  steps: Step[];
}) {
  const { boxW, boxes, height } = layout(steps.length);
  const maxChars = Math.floor((boxW - 2 * PAD) / CHAR_W);

  return (
    <div>
      {/* Large screens only; below that the numbered list carries the content. */}
      <svg
        role="img"
        aria-label={diagramSummary(title, steps)}
        viewBox={`-2 -2 ${WIDTH + 4} ${height + 4}`}
        className="hidden h-auto w-full font-sans lg:block"
      >
        {steps.map((step, index) => {
          const box = boxes[index];
          const next = boxes[index + 1];
          if (!next) return null;
          if (next.row === box.row) {
            const leftToRight = next.x > box.x;
            const y = box.y + BOX_H / 2;
            return (
              <Arrow
                key={`arrow-${step.id}`}
                x1={leftToRight ? box.x + boxW : box.x}
                y1={y}
                x2={leftToRight ? next.x : next.x + boxW}
                y2={y}
              />
            );
          }
          const x = box.x + boxW / 2;
          return (
            <Arrow
              key={`arrow-${step.id}`}
              x1={x}
              y1={box.y + BOX_H}
              x2={x}
              y2={next.y}
            />
          );
        })}
        {steps.map((step, index) => {
          const { x, y } = boxes[index];
          return (
            <g key={step.id}>
              <rect
                x={x}
                y={y}
                width={boxW}
                height={BOX_H}
                rx={8}
                className="fill-bg stroke-border"
                strokeWidth={1.5}
              />
              <text
                x={x + PAD}
                y={y + PAD + 12}
                className="fill-signal font-mono"
                fontSize={14}
              >
                {String(index + 1).padStart(2, "0")}
              </text>
              <text className="fill-text" fontSize={15} fontWeight={600}>
                {wrapLabel(step.label, maxChars).map((line, lineIndex) => (
                  <tspan
                    key={line}
                    x={x + PAD}
                    y={y + PAD + 40 + lineIndex * LINE_H}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <ol className="grid gap-x-8 gap-y-4 lg:mt-8 lg:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-signal-soft font-mono text-sm text-signal"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-semibold">{step.label}</p>
              <p className="mt-1 text-text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
