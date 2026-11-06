import Link from "next/link";
import type { ReactNode } from "react";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { buttonClasses } from "@/components/ui/Button";
import { cardClasses } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatGrid } from "@/components/ui/StatGrid";
import type { CaseStudy, Project } from "@/content/schema";
import { formatMonthRange } from "@/lib/format";

const buttonLinks = [
  { kind: "live", text: "Live demo", variant: "filled" },
  { kind: "repo", text: "Repo", variant: "outline" },
  { kind: "devpost", text: "Devpost", variant: "outline" },
] as const;

const number = (index: number) => String(index + 1).padStart(2, "0");

/** "← All projects", above the case-study eyebrow. */
export function BackToProjects() {
  return (
    <Link
      href="/projects"
      className="group/arrow inline-flex min-h-11 items-center gap-2 rounded-md font-mono text-xs tracking-[0.16em] text-text-muted uppercase transition-colors duration-150 hover:text-text"
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 group-hover/arrow:-translate-x-0.5 group-focus-visible/arrow:-translate-x-0.5"
      >
        ←
      </span>
      All projects
    </Link>
  );
}

/** The header's meta row: role, team, supervisor and period. */
export function caseStudyMeta(project: Project) {
  const period = project.period?.start
    ? formatMonthRange(project.period.start, project.period.end)
    : undefined;
  return [
    { label: "Role", value: project.role },
    project.team.length > 0 && {
      label: "Team",
      value: project.team.map((member) => member.name).join(", "),
    },
    project.supervisor && { label: "Supervisor", value: project.supervisor },
    period && {
      label: "Period",
      value: <span className="font-mono">{period}</span>,
    },
  ].filter((item) => !!item);
}

/** Live demo, Repo and Devpost buttons, only those the project has. */
export function CaseStudyActions({ project }: { project: Project }) {
  const buttons = buttonLinks.flatMap((button) => {
    const link = project.links.find((l) => l.kind === button.kind);
    return link ? [{ ...button, url: link.url }] : [];
  });

  return (
    <>
      {buttons.map((button) => (
        <a
          key={button.kind}
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${button.text} (opens in a new tab)`}
          className={buttonClasses(button.variant, "", "lg")}
        >
          {button.text}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </>
  );
}

/** The case-study eyebrow's status pill, beside the type and period. */
export function CaseStudyStatus({ project }: { project: Project }) {
  return <Pill status={project.status} />;
}

export function AtAGlance({
  project,
  caseStudy,
}: {
  project: Project;
  caseStudy: CaseStudy;
}) {
  const cells: [string, ReactNode][] = [
    ["Problem", caseStudy.problem],
    ["Approach", caseStudy.approach],
    [
      "My role",
      <>
        {project.role}
        {project.roleSummary && (
          <span className="mt-3 block text-text-muted">
            {project.roleSummary}
          </span>
        )}
      </>,
    ],
    ["Outcome", caseStudy.outcome],
  ];

  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {cells.map(([term, text], index) => (
        <div
          key={term}
          className={cardClasses({ className: "flex flex-col p-6 md:p-7" })}
        >
          {/* The number is CSS content, so the term stays the dt's only text. */}
          <dt
            data-number={number(index)}
            className="relative border-b border-border pb-4 font-mono text-xs font-medium tracking-[0.16em] text-signal uppercase after:absolute after:top-0 after:right-0 after:text-text-muted after:content-[attr(data-number)]"
          >
            {term}
          </dt>
          <dd className="mt-4 text-text/90">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A label above a block of text, for the decision and problem cards. */
function Step({
  term,
  children,
  strong = false,
}: {
  term: string;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div>
      <dt
        className={`font-mono text-xs font-medium tracking-[0.16em] uppercase ${
          strong ? "text-signal" : "text-text-muted"
        }`}
      >
        {term}
      </dt>
      <dd className="mt-2 text-text/90">{children}</dd>
    </div>
  );
}

export function Decisions({
  decisions,
}: {
  decisions: CaseStudy["decisions"];
}) {
  if (decisions.length === 0) return null;
  return (
    <ol className="grid gap-4">
      {decisions.map((item, index) => (
        <li
          key={item.decision}
          id={item.anchor}
          className={cardClasses({
            className:
              "grid scroll-mt-24 gap-6 p-6 md:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10",
          })}
        >
          <div className="flex min-w-0 flex-col items-start">
            <p
              aria-hidden="true"
              className="font-mono text-xs font-medium tracking-[0.16em] text-signal"
            >
              {number(index)}
            </p>
            <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight text-balance">
              {item.decision}
            </h3>
            <div className="mt-5 lg:mt-auto lg:pt-6">
              <EvidenceChip {...item.evidence} verified />
            </div>
          </div>
          <dl className="grid content-start gap-5 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <Step term="Why">{item.why}</Step>
            <Step term="Trade-off">{item.tradeoff}</Step>
          </dl>
        </li>
      ))}
    </ol>
  );
}

export function HardProblems({
  problems,
}: {
  problems: CaseStudy["hardProblems"];
}) {
  if (problems.length === 0) return null;
  return (
    <ol className="grid gap-4">
      {problems.map((problem, index) => (
        <li
          key={problem.title}
          className={cardClasses({ className: "p-6 md:p-8" })}
        >
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <p
                aria-hidden="true"
                className="font-mono text-xs font-medium tracking-[0.16em] text-signal"
              >
                {number(index)}
              </p>
              <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight text-balance">
                {problem.title}
              </h3>
            </div>
            <EvidenceChip {...problem.evidence} verified />
          </div>
          <dl className="mt-6 grid gap-6 border-t border-border pt-6 md:grid-cols-3 md:gap-8">
            <Step term="Symptom">{problem.symptom}</Step>
            <Step term="Root cause">{problem.rootCause}</Step>
            <Step term="Fix" strong>
              {problem.fix}
            </Step>
          </dl>
        </li>
      ))}
    </ol>
  );
}

/**
 * Results with a stat split as big numerals (each with its evidence chip),
 * then any other results as a hairline list.
 */
export function Results({ results }: { results: Project["results"] }) {
  const withStats = results.filter((result) => result.stat);
  const others = results.filter((result) => !result.stat);

  return (
    <div className="grid gap-6">
      <StatGrid claims={withStats} label="Key numbers" />
      {others.length > 0 && (
        <ul className="divide-y divide-border border-y border-border">
          {others.map((result) => (
            <li
              key={result.text}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4"
            >
              <span>{result.text}</span>
              {result.status === "verified" && result.evidence && (
                <EvidenceChip {...result.evidence} verified />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
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

function CreditList({
  heading,
  items,
  wide = false,
}: {
  heading: string;
  items: string[];
  /** The only list: spread it over two columns. */
  wide?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-mono text-xs font-medium tracking-[0.16em] text-signal uppercase">
        {heading}
      </h3>
      <ul
        className={`mt-4 grid gap-3 ${wide ? "md:grid-cols-2 md:gap-x-10" : ""}`}
      >
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-signal"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TeamAndCredit({ project }: { project: Project }) {
  const withRoles = project.team.some((member) => member.role);
  const both =
    project.myContributions.length > 0 && project.teamOutcomes.length > 0;
  return (
    <div className={cardClasses({ className: "p-6 md:p-8" })}>
      {project.thesisTitle && (
        <dl className="mb-6 border-b border-border pb-6">
          <dt className="font-mono text-xs font-medium tracking-[0.16em] text-text-muted uppercase">
            Thesis title
          </dt>
          <dd className="mt-2 max-w-[60ch] font-display text-lg leading-snug font-semibold text-balance">
            {project.thesisTitle}
          </dd>
        </dl>
      )}
      {project.team.length > 0 && <p>{teamLine(project)}</p>}
      {withRoles && (
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
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
        <div
          className={`mt-6 grid gap-8 border-t border-border pt-6 ${both ? "md:grid-cols-2" : ""}`}
        >
          <CreditList
            heading="What I did"
            items={project.myContributions}
            wide={!both}
          />
          <CreditList
            heading="What the team did"
            items={project.teamOutcomes}
            wide={!both}
          />
        </div>
      )}
    </div>
  );
}

export function Limitations({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ol className="divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <li key={item} className="flex gap-5 py-4">
          <span
            aria-hidden="true"
            className="mt-1 font-mono text-xs text-text-muted"
          >
            {number(index)}
          </span>
          <span className="max-w-[68ch]">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function PagerCard({
  project,
  direction,
  alignEnd = false,
}: {
  project: Project;
  direction: "previous" | "next";
  alignEnd?: boolean;
}) {
  const next = direction === "next";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cardClasses({
        interactive: true,
        className: `group/arrow flex h-full flex-col p-6 md:p-8 ${
          alignEnd ? "sm:items-end sm:text-right" : ""
        }`,
      })}
    >
      <span className="flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        {!next && (
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-150 group-hover/arrow:-translate-x-0.5"
          >
            ←
          </span>
        )}
        {next ? "Next project" : "Previous project"}
        {next && (
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-150 group-hover/arrow:translate-x-0.5"
          >
            →
          </span>
        )}
      </span>
      <span className="mt-4 font-display text-display-3 font-bold text-signal">
        {project.title}
      </span>
      <span className="mt-3 max-w-[48ch] text-text-muted">
        {project.summary}
      </span>
    </Link>
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
  return (
    <nav
      aria-label="More projects"
      className={`grid gap-4 border-t border-border py-14 md:py-20 ${
        previous && next ? "sm:grid-cols-2" : ""
      }`}
    >
      {previous && <PagerCard project={previous} direction="previous" />}
      {next && (
        <PagerCard project={next} direction="next" alignEnd={!!previous} />
      )}
    </nav>
  );
}

/** "On this page": anchor links to the sections, sticky from 1280px. */
export function OnThisPage({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  return (
    <nav aria-label="On this page" className="sticky top-24 py-20">
      <p className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
        On this page
      </p>
      <ol className="mt-4 grid border-l border-border">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="-ml-px flex min-h-9 items-center gap-3 border-l border-transparent py-1 pl-4 text-sm text-text-muted transition-colors duration-150 hover:border-signal hover:text-text"
            >
              <span aria-hidden="true" className="font-mono text-xs">
                {number(index)}
              </span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
