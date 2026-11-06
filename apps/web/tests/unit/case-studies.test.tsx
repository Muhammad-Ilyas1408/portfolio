import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ArchitectureDiagram,
  diagramSummary,
  wrapLabel,
} from "@/components/projects/ArchitectureDiagram";
import {
  AtAGlance,
  Decisions,
  HardProblems,
  Limitations,
  TeamAndCredit,
  teamLine,
} from "@/components/projects/CaseStudySections";
import {
  getAdjacentProjects,
  getCaseStudy,
  getProject,
  getProjects,
} from "@/content";
import { caseStudies } from "@/content/case-studies";
import {
  assertCaseStudiesMatchProjects,
  CaseStudy,
  CaseStudyList,
  type CaseStudyInput,
} from "@/content/schema";

const evidence = {
  kind: "changelog",
  label: "Hotfix 1",
  url: "https://example.com/changelog",
} as const;

const decision = {
  decision: "A decision",
  why: "A reason",
  tradeoff: "A cost",
  evidence,
};

const hardProblem = {
  title: "A bug",
  symptom: "What broke",
  rootCause: "Why",
  fix: "How",
  evidence,
};

const base: CaseStudyInput = {
  slug: "sample",
  problem: "Problem.",
  approach: "Approach.",
  outcome: "Outcome.",
  architecture: {
    steps: ["a", "b", "c", "d"].map((id) => ({
      id,
      label: `Step ${id}`,
      description: `Does ${id}`,
    })),
  },
  decisions: [],
  hardProblems: [],
};

describe("CaseStudy schema", () => {
  it("parses the real case studies, one per project slug", () => {
    expect(() => CaseStudyList.parse(caseStudies)).not.toThrow();
    expect(() =>
      assertCaseStudiesMatchProjects(caseStudies, getProjects()),
    ).not.toThrow();
    expect(caseStudies.map((c) => c.slug).sort()).toEqual([
      "flood-aware",
      "storyweave",
    ]);
  });

  it("rejects a case study whose slug matches no project", () => {
    expect(() =>
      assertCaseStudiesMatchProjects([{ slug: "nope" }], getProjects()),
    ).toThrow(/no matching project/);
  });

  it("rejects duplicate case studies", () => {
    expect(CaseStudyList.safeParse([base, base]).success).toBe(false);
  });

  it("gives every real hard problem and decision https evidence", () => {
    for (const study of caseStudies) {
      for (const item of [...study.hardProblems, ...study.decisions]) {
        expect(item.evidence.url).toMatch(/^https:\/\//);
        expect(item.evidence.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("requires https evidence on hard problems", () => {
    expect(
      CaseStudy.safeParse({ ...base, hardProblems: [hardProblem] }).success,
    ).toBe(true);
    const { evidence: _omit, ...noEvidence } = hardProblem;
    void _omit;
    expect(
      CaseStudy.safeParse({ ...base, hardProblems: [noEvidence] }).success,
    ).toBe(false);
    expect(
      CaseStudy.safeParse({
        ...base,
        hardProblems: [
          {
            ...hardProblem,
            evidence: { ...evidence, url: "http://example.com" },
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("allows at most 3 hard problems", () => {
    expect(
      CaseStudy.safeParse({ ...base, hardProblems: Array(4).fill(hardProblem) })
        .success,
    ).toBe(false);
  });

  it("allows no decisions or 3–5", () => {
    for (const [count, ok] of [
      [0, true],
      [1, false],
      [2, false],
      [3, true],
      [5, true],
      [6, false],
    ] as const) {
      expect(
        CaseStudy.safeParse({ ...base, decisions: Array(count).fill(decision) })
          .success,
      ).toBe(ok);
    }
  });

  it("needs 4–8 architecture steps with unique ids", () => {
    const step = (id: string) => ({ id, label: id, description: id });
    const withSteps = (ids: string[]) =>
      CaseStudy.safeParse({ ...base, architecture: { steps: ids.map(step) } })
        .success;
    expect(withSteps(["a", "b", "c"])).toBe(false);
    expect(withSteps(["a", "b", "c", "d", "e", "f", "g", "h", "i"])).toBe(
      false,
    );
    expect(withSteps(["a", "b", "c", "c"])).toBe(false);
  });
});

describe("case-study content", () => {
  it("Flood-Aware has 3–5 decisions, 3 hard problems and limitations", () => {
    const study = getCaseStudy("flood-aware")!;
    expect(study.decisions.length).toBeGreaterThanOrEqual(3);
    expect(study.decisions.length).toBeLessThanOrEqual(5);
    expect(study.hardProblems.map((p) => p.evidence.label)).toEqual([
      "Hotfix 20",
      "Hotfix 21",
      "Hotfix 22",
    ]);
    expect(study.limitations.length).toBeGreaterThan(0);
  });

  it("StoryWeave has six architecture steps and no decisions or hard problems", () => {
    const study = getCaseStudy("storyweave")!;
    expect(study.architecture.steps).toHaveLength(6);
    expect(study.decisions).toEqual([]);
    expect(study.hardProblems).toEqual([]);
  });

  it("links projects in order without wrapping", () => {
    expect(getAdjacentProjects("flood-aware")).toEqual({
      previous: undefined,
      next: getProject("storyweave"),
    });
    expect(getAdjacentProjects("storyweave")).toEqual({
      previous: getProject("flood-aware"),
      next: undefined,
    });
  });
});

describe("case-study template", () => {
  it("renders nothing for empty decisions, hard problems and limitations", () => {
    const { container } = render(
      <>
        <Decisions decisions={[]} />
        <HardProblems problems={[]} />
        <Limitations items={[]} />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each decision with why, trade-off and its evidence chip", () => {
    render(
      <Decisions
        decisions={[decision, decision, decision].map((d, i) => ({
          ...d,
          decision: `D${i}`,
        }))}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(
      screen.getAllByRole("link", {
        name: "CHANGELOG: Hotfix 1 (opens in a new tab)",
      }),
    ).toHaveLength(3);
  });

  it("builds the Flood-Aware team line", () => {
    expect(teamLine(getProject("flood-aware")!)).toBe(
      "Team of 2: Muhammad Ilyas, Abdullah Ahmad · Supervised by Dr. Asim Jalal",
    );
    expect(teamLine(getProject("storyweave")!)).toBe("Team of 4");
  });

  it("shows myContributions verbatim under What I did", () => {
    const project = getProject("flood-aware")!;
    render(<TeamAndCredit project={project} />);
    const heading = screen.getByRole("heading", { name: "What I did" });
    const items = heading.parentElement!.querySelectorAll("li");
    expect([...items].map((li) => li.textContent)).toEqual(
      project.myContributions,
    );
  });

  it("leaves out a credit list that is empty", () => {
    const project = { ...getProject("storyweave")!, teamOutcomes: [] };
    render(<TeamAndCredit project={project} />);
    expect(
      screen.getByRole("heading", { name: "What I did" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "What the team did" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Hamad Khan")).toBeInTheDocument();
  });
});

describe("Flood-Aware role card and title", () => {
  it("shows the role and what I built in the My role card", () => {
    const project = getProject("flood-aware")!;
    render(
      <AtAGlance project={project} caseStudy={getCaseStudy("flood-aware")!} />,
    );
    const card = screen.getByText("My role").parentElement!;
    expect(card).toHaveTextContent(
      "Co-developer, BS CS Final Year Project (team of 2)",
    );
    expect(card).toHaveTextContent(
      "Built the LangGraph decision agent, the GIS pipeline, the RAG pipeline, the Next.js frontend, the deployment, and the backend test suite and evaluation.",
    );
  });

  it("renders no role summary when a project has none", () => {
    const project = getProject("storyweave")!;
    expect(project.roleSummary).toBeUndefined();
    render(
      <AtAGlance project={project} caseStudy={getCaseStudy("storyweave")!} />,
    );
    const card = screen.getByText("My role").parentElement!;
    expect(card.querySelector("dd")!.textContent).toBe(project.role);
  });

  it("uses the new summary and shows the thesis title once", () => {
    const project = getProject("flood-aware")!;
    expect(project.summary).toBe(
      "LLM-driven multi-source flood monitoring and decision support for the River Swat Basin.",
    );
    render(<TeamAndCredit project={project} />);
    expect(screen.getAllByText("Thesis title")).toHaveLength(1);
    expect(
      screen.getByText(
        "Flood-Aware: LLM-Driven Multi-Source Flood Monitoring and Decision Support System for the River Swat Basin",
      ),
    ).toBeInTheDocument();
  });

  it("never says Swat River Basin", () => {
    const text = JSON.stringify([
      getProject("flood-aware"),
      getCaseStudy("flood-aware"),
    ]);
    expect(text).not.toContain("Swat River Basin");
  });

  it("gives every project a non-empty role", () => {
    for (const project of getProjects()) {
      expect(project.role.trim().length, project.slug).toBeGreaterThan(0);
    }
  });
});

describe("ArchitectureDiagram", () => {
  const steps = getCaseStudy("storyweave")!.architecture.steps;

  it("summarizes the flow in its accessible name and lists every step", () => {
    render(<ArchitectureDiagram title="StoryWeave" steps={steps} />);
    const img = screen.getByRole("img", { hidden: true });
    expect(img).toHaveAttribute(
      "aria-label",
      diagramSummary("StoryWeave", steps),
    );
    expect(img.getAttribute("aria-label")).toMatch(
      /^StoryWeave architecture in 6 steps: Story Generation, then Music Prompt Creation, .*Audio Mixing\.$/,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(6);
    steps.forEach((step, index) =>
      expect(items[index]).toHaveTextContent(step.description),
    );
  });

  it("wraps labels by words", () => {
    expect(
      wrapLabel("Evidence Aggregation + Grounding Validation", 21),
    ).toEqual(["Evidence Aggregation", "+ Grounding", "Validation"]);
  });
});
