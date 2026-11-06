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
  getRoles,
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
    expect(parsed.title).toBe("My presidency in numbers (2025–26)");
    expect(parsed.intro).toBe(
      "Computing Students Society, University of Peshawar, during my term as President (Oct 2025 – Sep 2026).",
    );
    expect(parsed.stats).toHaveLength(5);
    expect(parsed.stats.every((s) => s.status === "self-reported")).toBe(true);
    expect(parsed.source.label).toBe(
      "CSS Progress Report 2025–26 (submitted Sep 2026)",
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
      "certificates",
      "specializations",
      "courses",
      "training",
    ]);
    expect(groups.map((g) => g.items.length)).toEqual([1, 7, 1, 3, 9, 1]);
    expect(groups.flatMap((g) => g.items).every((item) => item.published)).toBe(
      true,
    );
  });

  it("publishes every credential, including the three IBM courses", () => {
    const shown = getCredentialGroups().flatMap((g) => g.items);

    expect(credentials.filter((c) => !c.published)).toHaveLength(0);
    expect(
      shown.filter((c) => c.kind === "course" && c.issuer === "IBM"),
    ).toHaveLength(3);
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

    expect(photos).toHaveLength(7);
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

  it("publishes the CPC 2024 award with its photo, issuer and no date", () => {
    const award = getPublishedCredentials("award").find(
      (c) =>
        c.name ===
        "Appreciation Award — Connected Pakistan Conference 2024 (CPC 2024)",
    )!;
    expect(award.issuer).toBe("Connected Pakistan");
    expect(award.note).toBe(
      "Presented by Connected Pakistan in appreciation of contributions to shaping Pakistan's tech industry.",
    );
    expect(award.date).toBeUndefined();
    expect(award.photos).toEqual([
      {
        src: "/images/awards/connected-pakistan-cpc-2024.jpg",
        alt: "Framed Connected Pakistan Conference 2024 appreciation award presented to Muhammad Ilyas, signed by the Founder CEO of Connected Pakistan.",
      },
    ]);
    expect(credentialWhen(award)).toBeUndefined();
  });

  it("publishes the HackVortex certificate without calling it an award", () => {
    const [certificate] = getPublishedCredentials("certificate");
    expect(getPublishedCredentials("certificate")).toHaveLength(1);
    expect(certificate).toMatchObject({
      name: "Certificate of Participation — HackVortex Codestorm #5",
      issuer: "HackVortex",
      date: "2025-10",
      note: "Presented for an outstanding project in HackVortex Codestorm #5.",
      photos: [
        {
          src: "/images/certificates/hackvortex-codestorm-5.jpg",
          alt: "HackVortex Codestorm #5 certificate of participation presented to Muhammad Ilyas for an outstanding project.",
        },
      ],
    });
    expect(certificate.name).not.toMatch(/award|1st place/i);
    expect(
      existsSync(join(process.cwd(), "public", certificate.photos![0].src)),
    ).toBe(true);
    expect(credentialWhen(certificate)).toBe("Oct 2025");
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
    expect(president?.myContributions[0]).toBe(
      "Led a team of about 40 students: the presidential council (President, Male Vice President and Female Vice President), the cabinet (Chief Secretary, Information Secretary and Creative Lead), four clubs (AI & DS, Cyber Security, Software Engineering, Literary), and the PR, media, content & graphics and management teams.",
    );
    expect(president?.myContributions.slice(1)).toEqual([
      "Led the CSS executive team and the Department of Computer Science's student activities as president of the department's official society.",
      "Organized 18 events during the term — technical, career and community sessions, online and on campus — from the Supabase Meetup Peshawar (Nov 2025) to a Pentesting Masterclass (Sep 2026).",
      "Initiated and planned TechRise '26 (held 22 Oct 2026, 300+ attendees).",
    ]);
  });

  it("ends every role contribution with a full stop", () => {
    for (const role of getRoles()) {
      for (const item of role.myContributions) {
        expect(item, `${role.org} — ${role.title}`).toMatch(/\.$/);
      }
    }
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

    // M8.5 B: the presidency numbers come first, then the roles.
    expect(h2s()).toEqual([
      "My presidency in numbers (2025–26)",
      "Progression",
      "Featured initiatives",
      "All events and programmes",
      "Recognition",
    ]);
    // M8.5 B: the intro line is the h1. M8.6: the ember phrase is split into
    // spans (the words around it are dimmed), so check the text.
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(
      "From a GDSC team member to leading the Computing Students Society.",
    );
    expect(
      screen.getByText(
        "Computing Students Society, University of Peshawar, during my term as President (Oct 2025 – Sep 2026).",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Source: CSS Progress Report 2025–26 (submitted Sep 2026) · Self-reported",
      ),
    ).toBeInTheDocument();
    const noteLink = screen.getByRole("link", {
      name: "All events and programmes",
    });
    expect(noteLink).toHaveAttribute("href", "#events");
    expect(noteLink.parentElement).toHaveTextContent(
      "The All events and programmes section below also includes the CSS AI Bootcamp 2025 (before my term) and TechRise '26 (after the report).",
    );
    expect(document.getElementById("events")).not.toBeNull();
    expect(
      screen.getByRole("link", { name: /See all awards/ }),
    ).toHaveAttribute("href", "/credentials#awards");
  });

  it("/credentials shows its groups in order, with Verify links", () => {
    render(<CredentialsPage />);

    expect(h2s()).toEqual([
      "Degree",
      "Awards",
      "Certificates",
      "Specializations",
      "Courses",
      "Training",
    ]);
    // 1 award + 3 specializations + 9 courses.
    expect(screen.getAllByRole("link", { name: /^Verify:/ })).toHaveLength(13);
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
