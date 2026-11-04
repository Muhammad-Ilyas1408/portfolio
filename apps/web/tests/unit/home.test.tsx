import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import { homeResults } from "@/components/projects/ProjectCard";
import { Hero, roleLine } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import {
  getHomeProof,
  getLeadershipPath,
  getProfile,
  getProject,
} from "@/content";
import type { Claim } from "@/content/schema";
import {
  formatEventRange,
  formatMonthRange,
  formatYearSpan,
} from "@/lib/format";

describe("roleLine", () => {
  it("drops the title segment and joins the rest with ·", () => {
    expect(roleLine(getProfile().headline)).toBe(
      "Generative AI & Agentic Systems · LLM Engineering, RAG & FastAPI · Deep Learning & NLP",
    );
  });
});

describe("Hero", () => {
  it("shows the label, name and role line", () => {
    render(<Hero profile={getProfile()} />);

    expect(screen.getByText("AI/ML ENGINEER")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Muhammad Ilyas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(roleLine(getProfile().headline)),
    ).toBeInTheDocument();
  });

  it("shows the portrait when it is set", () => {
    render(<Hero profile={getProfile()} />);

    expect(
      screen.getByRole("img", { name: "Portrait of Muhammad Ilyas" }),
    ).toBeInTheDocument();
  });

  it("hides the portrait when it is unset", () => {
    const profile = { ...getProfile(), portrait: undefined };
    render(<Hero profile={profile} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("ProofStrip", () => {
  const items: Claim[] = [
    {
      text: "Verified fact",
      status: "verified",
      evidence: { kind: "repo", label: "Repo", url: "https://example.com/r" },
    },
    { text: "Self-reported fact", status: "self-reported" },
  ];

  it("shows an EvidenceChip only for verified items", () => {
    render(<ProofStrip items={items} />);

    const [verified, selfReported] = screen.getAllByRole("listitem");
    expect(within(verified).getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/r",
    );
    expect(within(verified).getByRole("link")).toHaveAttribute(
      "data-verified",
      "true",
    );
    expect(within(selfReported).queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the four home proof items, two with chips", () => {
    render(<ProofStrip items={getHomeProof()} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("homeResults", () => {
  it("shows Flood-Aware's three highlighted results, in order", () => {
    expect(homeResults(getProject("flood-aware")!).map((r) => r.text)).toEqual([
      "348 backend tests passing (53 skipped) in the latest recorded run",
      "Production GIS warm-up takes about 2 s on Railway",
      "7 evidence tools",
    ]);
  });

  it("falls back to the first 3 verified results when none are highlighted", () => {
    const project = getProject("flood-aware")!;
    const results = [
      { text: "Self", status: "self-reported" as const },
      ...project.results.map((result) => ({ ...result, highlight: undefined })),
    ];
    expect(homeResults({ ...project, results }).map((r) => r.text)).toEqual(
      project.results
        .filter((r) => r.status === "verified")
        .slice(0, 3)
        .map((r) => r.text),
    );
  });
});

describe("leadership path", () => {
  it("runs oldest to newest with the exact titles", () => {
    expect(
      getLeadershipPath().map(
        (role) => `${role.title} ${formatYearSpan(role.start, role.end)}`,
      ),
    ).toEqual([
      "AI/ML Team Member 2023–24",
      "Executive Team Member 2024–25",
      "AI/DS Club Lead 2024–25",
      "President 2025–26",
    ]);
  });
});

describe("format", () => {
  it("formats month and event ranges", () => {
    expect(formatMonthRange("2025-01", "2025-04")).toBe("Jan 2025 – Apr 2025");
    expect(formatEventRange("2026-10-22")).toBe("22 Oct 2026");
    expect(formatEventRange("2026-07-04", "2026-09-20")).toBe(
      "4 Jul – 20 Sep 2026",
    );
    expect(formatEventRange("2025-06", "2025-08")).toBe("Jun – Aug 2025");
    expect(formatEventRange("2025-12-29", "2026-01-02")).toBe(
      "29 Dec 2025 – 2 Jan 2026",
    );
  });
});

describe("Home", () => {
  it("renders all six sections", () => {
    render(<Home />);

    for (const name of [
      "Muhammad Ilyas",
      "Highlights",
      "Featured work",
      "Leadership",
      "Credentials",
      "Building something with LLMs, or running a tech community? Let's talk.",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });
});
