import { existsSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import CredentialsPage from "@/app/credentials/page";
import ExperiencePage from "@/app/experience/page";
import LeadershipPage from "@/app/leadership/page";
import { credentialWhen } from "@/components/credentials/CredentialItem";
import { evidenceChipName } from "@/components/evidence/EvidenceChip";
import { EventsTable } from "@/components/leadership/EventsTable";
import {
  getChapter,
  getCommunityRoles,
  getCredentialGroups,
  getDpSgdExplainer,
  getHomeCredentials,
  getInitiativeByName,
  getInitiatives,
  getInternship,
  getProfile,
  getPublishedCredentials,
  initiativeId,
} from "@/content";
import { chapter } from "@/content/chapter";
import { credentials } from "@/content/credentials";
import { initiatives } from "@/content/initiatives";
import { Chapter, Credential, Evidence } from "@/content/schema";
import { monthsInRange } from "@/lib/format";

describe("chapter", () => {
  it("parses, with five self-reported stats and an unlinked source", () => {
    expect(Chapter.safeParse(chapter).success).toBe(true);

    const parsed = getChapter();
    expect(parsed.title).toBe("CSS Chapter 2 (2025–26) in numbers");
    expect(parsed.stats).toHaveLength(5);
    expect(parsed.stats.every((s) => s.status === "self-reported")).toBe(true);
    expect(parsed.source.label).toBe(
      "CSS Chapter 2 Progress Report 2025–26 (submitted Sep 2026)",
    );
    expect(parsed.source.url).toBeUndefined();
  });

  it("rejects a chapter with no stats or a verified stat without evidence", () => {
    expect(Chapter.safeParse({ ...chapter, stats: [] }).success).toBe(false);
    expect(
      Chapter.safeParse({
        ...chapter,
        stats: [{ text: "1 event", status: "verified" }],
      }).success,
    ).toBe(false);
  });
});

describe("website evidence", () => {
  const website = {
    kind: "website",
    label: "CSS alumni page",
    url: "https://cssuop.org/alumni",
  };

  it("is an accepted kind, shown as WEBSITE", () => {
    expect(Evidence.safeParse(website).success).toBe(true);
    expect(evidenceChipName("website", "CSS alumni page")).toBe(
      "WEBSITE: CSS alumni page (opens in a new tab)",
    );
  });

  it("backs the President and AI/DS Club Lead roles", () => {
    const withEvidence = getCommunityRoles()
      .filter((role) => role.evidence.some((e) => e.kind === "website"))
      .map((role) => role.title);

    expect(withEvidence).toEqual(["President", "AI/DS Club Lead"]);
  });
});

describe("credentials", () => {
  it("groups published credentials in page order", () => {
    const groups = getCredentialGroups();

    expect(groups.map((g) => g.id)).toEqual([
      "degree",
      "awards",
      "specializations",
      "courses",
      "training",
    ]);
    expect(groups.map((g) => g.items.length)).toEqual([1, 6, 3, 6, 1]);
    expect(groups.flatMap((g) => g.items).every((item) => item.published)).toBe(
      true,
    );
  });

  it("hides the three courses whose issuer is unconfirmed", () => {
    const hidden = credentials.filter((c) => !c.published);
    const shown = getCredentialGroups().flatMap((g) => g.items);

    expect(hidden).toHaveLength(3);
    for (const { name } of hidden) {
      expect(shown.some((c) => c.name === name)).toBe(false);
    }
  });

  it("requires an issuer once published, and https verify links", () => {
    const base = { name: "X", kind: "course", published: true } as const;

    expect(Credential.safeParse(base).success).toBe(false);
    expect(Credential.safeParse({ ...base, published: false }).success).toBe(
      true,
    );
    expect(
      Credential.safeParse({
        ...base,
        issuer: "Y",
        verifyUrl: "http://example.com",
      }).success,
    ).toBe(false);
  });

  it("has no Kaggle or IBM Architecture and Data Preparation entries", () => {
    const names = credentials.map((c) => `${c.name} ${c.issuer ?? ""}`);

    expect(names.some((n) => n.includes("Kaggle"))).toBe(false);
    expect(
      names.some((n) => n.includes("Architecture and Data Preparation")),
    ).toBe(false);
  });

  it("every award photo exists under public/, with alt text", () => {
    const publicDir = join(process.cwd(), "public");
    const photos = getPublishedCredentials("award").flatMap(
      (c) => c.photos ?? [],
    );

    expect(photos).toHaveLength(6);
    for (const { src, alt } of photos) {
      expect(alt.length).toBeGreaterThan(0);
      expect(existsSync(join(publicDir, src)), src).toBe(true);
    }
  });

  it("formats when each credential was earned", () => {
    const find = (name: string) =>
      getPublishedCredentials().find((c) => c.name === name)!;

    expect(monthsInRange("2024-01", "2024-08")).toBe(8);
    expect(credentialWhen(find("Python Programming (Batch-01)"))).toBe(
      "Jan 2024 – Aug 2024 · 8 months",
    );
    expect(credentialWhen(find("BS Computer Science"))).toBe(
      "2022–2026 · Completed Nov 2026",
    );
    expect(
      credentialWhen(
        find("Award of Appreciation — President, CSS Chapter 2025–26"),
      ),
    ).toBe("Oct 2026");
  });

  it("keeps the home row to the degree and the verifiable award", () => {
    expect(getHomeCredentials().map((c) => c.name)).toEqual([
      "BS Computer Science",
      "HackVortex Codestorm 5 — 1st place (team, StoryWeave)",
    ]);
  });
});

describe("initiatives", () => {
  it("count TechRise '26 sponsors without naming them", () => {
    const techRise = getInitiativeByName("TechRise '26")!;
    expect(techRise.stats.map((s) => s.text)).toEqual([
      "300+ attendees",
      "9 speakers",
      "3 sponsors",
    ]);

    // The only mention of sponsors anywhere in the initiatives is the count.
    const mentions = JSON.stringify(initiatives).match(/"[^"]*sponsor[^"]*"/gi);
    expect(mentions).toEqual(['"3 sponsors"']);
  });

  it("have unique, readable anchors", () => {
    const ids = getInitiatives().map(initiativeId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(initiativeId({ name: "TechRise '26" })).toBe("techrise-26");
    expect(initiativeId({ name: "CSS × SMIT: Free IT Courses Session" })).toBe(
      "css-smit-free-it-courses-session",
    );
  });

  it("render one table row per initiative, each with its anchor id", () => {
    const { container } = render(
      <EventsTable initiatives={getInitiatives()} />,
    );
    const rows = container.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(20);
    expect(rows[0].id).toBe("techrise-26");
    expect(
      within(rows[0] as HTMLElement).getByText("Photos (4)"),
    ).toBeInTheDocument();
  });

  it("update the Summer Bootcamp 2026 track figures", () => {
    const summer = getInitiativeByName("CSS Summer Bootcamp 2026 (3 tracks)")!;

    expect(summer.stats.map((s) => s.text)).toEqual([
      "70+ students across 3 tracks (AI & Data Science, Web Development, Cyber Security)",
      "35+ students in the 9-week AI & Data Science track",
    ]);
    expect(summer.summary).toMatch(/supervised by Dr\. Waheed Ur Rehman\.$/);
  });
});

describe("profile and roles", () => {
  it("has the five-sentence About text", () => {
    expect(getProfile().about.split(/(?<=\.)\s+/)).toHaveLength(5);
  });

  it("gives the internship a summary and the President a team line first", () => {
    expect(getInternship()?.summary).toMatch(/^Worked on low-resource/);
    const president = getCommunityRoles().find((r) => r.title === "President");
    expect(president?.myContributions[0]).toMatch(
      /^Led a team of about 40 students/,
    );
  });

  it("has a three-sentence DP-SGD explainer", () => {
    expect(getDpSgdExplainer().sentences).toHaveLength(3);
  });
});

describe("pages", () => {
  const h2s = () =>
    screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

  it("/experience shows Industry and Teaching", () => {
    render(<ExperiencePage />);

    expect(h2s()).toEqual(["Industry", "Teaching"]);
    expect(screen.getByText("DP-SGD in three sentences")).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", {
      name: /on the Leadership page$/,
    })) {
      expect(link.getAttribute("href")).toMatch(/^\/leadership#[a-z0-9-]+$/);
    }
  });

  it("/leadership shows its five sections in order", () => {
    render(<LeadershipPage />);

    expect(h2s()).toEqual([
      "Progression",
      "Chapter 2 in numbers",
      "Featured initiatives",
      "All events and programmes",
      "Recognition",
    ]);
    expect(
      screen.getByText(
        "From a GDSC team member to leading the Computing Students Society.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /See all awards/ }),
    ).toHaveAttribute("href", "/credentials#awards");
  });

  it("/credentials shows its groups in order, with Verify links", () => {
    render(<CredentialsPage />);

    expect(h2s()).toEqual([
      "Degree",
      "Awards",
      "Specializations",
      "Courses",
      "Training",
    ]);
    // 1 award + 3 specializations + 6 courses.
    expect(screen.getAllByRole("link", { name: /^Verify:/ })).toHaveLength(10);
  });

  it("/about shows principles, skills and education", () => {
    render(<AboutPage />);

    expect(h2s()).toEqual(["Engineering principles", "Skills", "Education"]);
    expect(
      screen.getByRole("link", { name: /Citation validation in Flood-Aware/ }),
    ).toHaveAttribute("href", "/projects/flood-aware#citation-validation");
    expect(
      screen.getAllByRole("link", { name: "Flood-Aware" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/Supervised by Dr\. Asim Jalal/),
    ).toBeInTheDocument();
  });
});
