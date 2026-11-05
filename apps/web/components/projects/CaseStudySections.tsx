import Link from "next/link";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { buttonClasses } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { CaseStudy, Project } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

const buttonLinks = [
  { kind: "live", text: "Live demo", variant: "filled" },
  { kind: "repo", text: "Repo", variant: "outline" },
  { kind: "devpost", text: "Devpost", variant: "outline" },
] as const;

export function CaseStudyHeader({ project }: { project: Project }) {
  const period = project.period?.start
    ? formatMonthRange(project.period.start, project.period.end)
    : undefined;
  const buttons = buttonLinks.flatMap((button) => {
    const link = project.links.find((l) => l.kind === button.kind);
    return link ? [{ ...button, url: link.url }] : [];
  });

  return (
    <header className="pt-12 md:pt-16">
      <p className="font-mono text-sm text-signal">Case study</p>
      <h1 className="mt-2">{project.title}</h1>
      <p className="mt-4 max-w-[68ch] text-lg">{project.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="text-text-muted">{project.role}</span>
        {period && <span className="font-mono text-text-muted">{period}</span>}
        <Pill status={project.status} />
      </div>
      {buttons.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {buttons.map((button) => (
            <a
              key={button.kind}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${button.text} (opens in a new tab)`}
              className={buttonClasses(button.variant)}
            >
              {button.text}
              <span aria-hidden="true" className="ml-1">
                ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function AtAGlance({
  project,
  caseStudy,
}: {
  project: Project;
  caseStudy: CaseStudy;
}) {
  const cells = [
    ["Problem", caseStudy.problem],
    ["Approach", caseStudy.approach],
    ["My role", project.role],
    ["Outcome", caseStudy.outcome],
  ] as const;

  return (
    <dl className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cells.map(([term, text]) => (
        <div
          key={term}
          className="rounded-lg border border-border bg-surface p-6"
        >
          <dt className="font-mono text-sm text-signal">{term}</dt>
          <dd className="mt-2">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Decisions({
  decisions,
}: {
  decisions: CaseStudy["decisions"];
}) {
  if (decisions.length === 0) return null;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {decisions.map((item) => (
        <li
          key={item.decision}
          id={item.anchor}
          className="flex scroll-mt-20 flex-col rounded-lg border border-border bg-surface p-6"
        >
          <h3>{item.decision}</h3>
          <dl className="mt-4 grid flex-1 gap-3">
            <div>
              <dt className="font-mono text-sm text-signal">Why</dt>
              <dd className="mt-1">{item.why}</dd>
            </div>
            <div>
              <dt className="font-mono text-sm text-signal">Trade-off</dt>
              <dd className="mt-1">{item.tradeoff}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <EvidenceChip {...item.evidence} verified />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function HardProblems({
  problems,
}: {
  problems: CaseStudy["hardProblems"];
}) {
  if (problems.length === 0) return null;
  return (
    <ul className="grid gap-4">
      {problems.map((problem) => (
        <li
          key={problem.title}
          className="rounded-lg border border-border bg-surface p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3>{problem.title}</h3>
            <EvidenceChip {...problem.evidence} verified />
          </div>
          <dl className="mt-4 grid gap-4 md:grid-cols-3">
            {(
              [
                ["Symptom", problem.symptom],
                ["Root cause", problem.rootCause],
                ["Fix", problem.fix],
              ] as const
            ).map(([term, text]) => (
              <div key={term}>
                <dt className="font-mono text-sm text-signal">{term}</dt>
                <dd className="mt-1">{text}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function Results({ results }: { results: Project["results"] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {results.map((result) => (
        <li
          key={result.text}
          className="flex flex-col items-start gap-2 border-l border-signal/40 pl-3"
        >
          <span>{result.text}</span>
          {result.status === "verified" && result.evidence && (
            <EvidenceChip {...result.evidence} verified />
          )}
        </li>
      ))}
    </ul>
  );
}

/** "Team of 2: A, B · Supervised by C". Names move to a list when roles exist. */
export function teamLine(project: Project) {
  const { team, supervisor } = project;
  const withRoles = team.some((member) => member.role);
  let line = `Team of ${team.length}`;
  if (!withRoles) line += `: ${team.map((member) => member.name).join(", ")}`;
  if (supervisor) line += ` · Supervised by ${supervisor}`;
  return line;
}

function CreditList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3>{heading}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-signal">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function TeamAndCredit({ project }: { project: Project }) {
  const withRoles = project.team.some((member) => member.role);
  return (
    <div>
      {project.team.length > 0 && <p>{teamLine(project)}</p>}
      {withRoles && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {project.team.map((member) => (
            <li key={member.name}>
              {member.name}
              {member.role && (
                <span className="text-text-muted"> — {member.role}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {(project.myContributions.length > 0 ||
        project.teamOutcomes.length > 0) && (
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <CreditList heading="What I did" items={project.myContributions} />
          <CreditList
            heading="What the team did"
            items={project.teamOutcomes}
          />
        </div>
      )}
    </div>
  );
}

export function Limitations({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="max-w-[68ch] list-disc space-y-2 pl-5 marker:text-signal">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ProjectPager({
  previous,
  next,
}: {
  previous?: Project;
  next?: Project;
}) {
  if (!previous && !next) return null;
  const linkClasses =
    "flex min-h-11 flex-col justify-center rounded-lg border border-border bg-surface px-6 py-4 transition-colors duration-150 hover:border-signal/40 hover:bg-surface-raised";
  return (
    <nav
      aria-label="More projects"
      className="grid gap-4 border-t border-border py-12 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={`/projects/${previous.slug}`} className={linkClasses}>
          <span className="font-mono text-sm text-text-muted">
            <span aria-hidden="true">← </span>Previous project
          </span>
          <span className="mt-1 font-semibold text-signal">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={`/projects/${next.slug}`}
          className={`${linkClasses} sm:items-end sm:text-right`}
        >
          <span className="font-mono text-sm text-text-muted">
            Next project<span aria-hidden="true"> →</span>
          </span>
          <span className="mt-1 font-semibold text-signal">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
