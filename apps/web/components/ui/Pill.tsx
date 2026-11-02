export type PillStatus =
  "live" | "complete" | "in-progress" | "experiment" | "concept";

const statuses: Record<
  PillStatus,
  { label: string; dot: string; className: string }
> = {
  live: {
    label: "Live",
    dot: "bg-verified",
    className: "border-verified text-text",
  },
  complete: {
    label: "Complete",
    dot: "bg-text",
    className: "border-border text-text",
  },
  "in-progress": {
    label: "In progress",
    dot: "bg-signal",
    className: "border-border text-text",
  },
  experiment: {
    label: "Experiment",
    dot: "bg-text-muted",
    className: "border-border text-text-muted",
  },
  concept: {
    label: "Concept",
    dot: "bg-text-muted",
    className: "border-dashed border-border text-text-muted",
  },
};

export function Pill({ status }: { status: PillStatus }) {
  const { label, dot, className } = statuses[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-0.5 text-sm ${className}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
