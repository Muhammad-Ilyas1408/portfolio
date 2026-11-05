import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getFeaturedInitiatives,
  getFeaturedProjects,
  getInitiatives,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  getRoles,
  getSkills,
} from "@/content";
import { credentials } from "@/content/credentials";
import { initiatives } from "@/content/initiatives";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { roles } from "@/content/roles";
import {
  Claim,
  Credential,
  Evidence,
  Initiative,
  Profile,
  ProjectList,
  Role,
  SkillGroup,
} from "@/content/schema";
import { skills } from "@/content/skills";

const evidence = {
  kind: "repo",
  label: "Repo",
  url: "https://example.com/repo",
};

const project = {
  slug: "a",
  title: "A",
  summary: "A project.",
  role: "Solo",
  status: "complete",
  tags: ["fundamentals"],
  stack: ["Python"],
  featured: false,
  order: 1,
};

const initiative = {
  name: "Event",
  start: "2026-10-22",
  format: "online",
  focus: "technical",
  myRole: "Organizer",
  featured: false,
  published: true,
};

const role = {
  org: "Org",
  title: "Member",
  start: "2025-01",
  track: "community",
  published: true,
};

describe("content files", () => {
  it("all parse with their schemas", () => {
    expect(Profile.safeParse(profile).success).toBe(true);
    expect(ProjectList.safeParse(projects).success).toBe(true);
    expect(roles.every((item) => Role.safeParse(item).success)).toBe(true);
    expect(
      initiatives.every((item) => Initiative.safeParse(item).success),
    ).toBe(true);
    expect(
      credentials.every((item) => Credential.safeParse(item).success),
    ).toBe(true);
    expect(skills.every((item) => SkillGroup.safeParse(item).success)).toBe(
      true,
    );
  });

  it("have the expected counts", () => {
    expect(projects).toHaveLength(2);
    expect(roles).toHaveLength(7);
    expect(initiatives).toHaveLength(20);
    expect(credentials).toHaveLength(20);
    expect(skills).toHaveLength(6);
    expect(skills.flatMap((group) => group.skills)).toHaveLength(30);
  });
});

describe("schema rules", () => {
  it("rejects a verified claim without evidence", () => {
    expect(Claim.safeParse({ text: "x", status: "verified" }).success).toBe(
      false,
    );
    expect(
      Claim.safeParse({ text: "x", status: "verified", evidence }).success,
    ).toBe(true);
    expect(
      Claim.safeParse({ text: "x", status: "self-reported" }).success,
    ).toBe(true);
  });

  it("rejects an http:// evidence URL", () => {
    expect(
      Evidence.safeParse({ ...evidence, url: "http://example.com" }).success,
    ).toBe(false);
    expect(Evidence.safeParse(evidence).success).toBe(true);
  });

  it("rejects a bad date", () => {
    expect(Role.safeParse({ ...role, start: "2025/01" }).success).toBe(false);
    expect(Role.safeParse({ ...role, start: "2025-13" }).success).toBe(false);
    expect(Role.safeParse(role).success).toBe(true);
  });

  it("accepts initiative dates as YYYY-MM-DD or YYYY-MM only", () => {
    const parse = (start: string) =>
      Initiative.safeParse({ ...initiative, start }).success;

    expect(parse("2026-10-22")).toBe(true);
    expect(parse("2026-10")).toBe(true);
    expect(parse("2026/10/22")).toBe(false);
    expect(parse("2026-02-30")).toBe(false);
    expect(parse("2026-13")).toBe(false);
  });

  it("rejects an initiative that ends before it starts", () => {
    expect(
      Initiative.safeParse({ ...initiative, end: "2026-10-21" }).success,
    ).toBe(false);
    expect(
      Initiative.safeParse({ ...initiative, end: "2026-10-23" }).success,
    ).toBe(true);
  });

  it("defaults an initiative's org to the Computing Students Society", () => {
    expect(Initiative.parse(initiative).org).toBe("Computing Students Society");
  });

  it("rejects duplicate slugs and duplicate orders", () => {
    expect(
      ProjectList.safeParse([project, { ...project, order: 2 }]).success,
    ).toBe(false);
    expect(
      ProjectList.safeParse([project, { ...project, slug: "b" }]).success,
    ).toBe(false);
    expect(
      ProjectList.safeParse([project, { ...project, slug: "b", order: 2 }])
        .success,
    ).toBe(true);
  });
});

describe("getters", () => {
  it("returns the profile with a headline and intro, and no availability line", () => {
    const result = getProfile();

    expect(result.location).toBe("Pakistan");
    expect(result.headline).toMatch(/^AI\/ML Engineer \| Generative AI/);
    expect(result.intro).toContain("President (2025–26)");
    expect(result).not.toHaveProperty("availability");
  });

  it("never returns unpublished credentials", () => {
    const published = getPublishedCredentials();

    expect(published).toHaveLength(17);
    expect(published.every((item) => item.published)).toBe(true);
    expect(getPublishedCredentials("degree").map((c) => c.name)).toEqual([
      "BS Computer Science",
    ]);
    expect(getPublishedCredentials("award")).toHaveLength(6);
    expect(getPublishedCredentials("specialization")).toHaveLength(3);
    expect(getPublishedCredentials("course")).toHaveLength(6);
    expect(getPublishedCredentials("training")).toHaveLength(1);
  });

  it("returns published initiatives, newest first", () => {
    const result = getInitiatives();
    const starts = result.map((item) => item.start);

    expect(result).toHaveLength(20);
    expect(result.every((item) => item.published)).toBe(true);
    expect(starts).toEqual(starts.toSorted().toReversed());
    expect(result[0].name).toBe("TechRise '26");
    expect(result.at(-1)?.name).toBe("CSS AI Bootcamp 2025");
  });

  it("features exactly three initiatives", () => {
    expect(
      getFeaturedInitiatives()
        .map((item) => item.name)
        .toSorted(),
    ).toEqual(
      [
        "TechRise '26",
        "CSS Summer Bootcamp 2026 (3 tracks)",
        "CSS AI Bootcamp 2025",
      ].toSorted(),
    );
  });

  it("sorts projects by order", () => {
    expect(getProjects().map((item) => item.slug)).toEqual([
      "flood-aware",
      "storyweave",
    ]);
  });

  it("returns featured projects and projects by slug", () => {
    expect(getFeaturedProjects().map((item) => item.slug)).toEqual([
      "flood-aware",
      "storyweave",
    ]);
    expect(getProject("storyweave")?.title).toBe("StoryWeave");
    expect(getProject("missing")).toBeUndefined();
  });

  it("sorts roles newest first", () => {
    const result = getRoles();
    const starts = result.map((item) => item.start);

    expect(result).toHaveLength(7);
    expect(starts).toEqual(starts.toSorted().toReversed());
    expect(result[0].title).toBe("President");
    expect(result.at(-1)?.title).toBe("AI/ML Team Member");
    expect(result.at(-1)?.org).toBe(
      "Google Developer Student Clubs (GDSC), University of Peshawar",
    );
  });

  it("links skills only to known projects or the internship", () => {
    const known = [...getProjects().map((item) => item.slug), "internship"];
    const usedIn = getSkills().flatMap((group) =>
      group.skills.flatMap((skill) => skill.usedIn),
    );

    expect(usedIn.every((target) => known.includes(target))).toBe(true);
  });
});

describe("evidence", () => {
  it("every project result is a verified claim with evidence", () => {
    const results = getProjects().flatMap((item) => item.results);

    expect(results).toHaveLength(8);
    expect(
      results.every((item) => item.status === "verified" && item.evidence),
    ).toBe(true);
  });

  it("credits both Flood-Aware members and lists the owner's six contributions", () => {
    const floodAware = getProject("flood-aware");

    expect(floodAware?.team).toEqual([
      { name: "Muhammad Ilyas" },
      { name: "Abdullah Ahmad" },
    ]);
    expect(floodAware?.myContributions).toHaveLength(6);
    expect(floodAware?.myContributions).toEqual(
      expect.arrayContaining([
        "Designed and built the LangGraph decision agent with severity-based tool routing and citation validation",
        "Built the GIS analysis pipeline (GeoPandas, Rasterio) for population and infrastructure exposure, including regional data extraction and in-memory caching",
        "Built the ChromaDB RAG pipeline over PDMA/NDMP disaster-management documents with relevance-thresholded retrieval",
        "Built the Next.js production frontend: Flood Guide, Policy Advisor and Situation Room",
        "Deployed the FastAPI backend to Railway and the frontend to Vercel, including production CORS hardening",
        "Wrote the backend test suite and the real-API golden-set evaluation",
      ]),
    );
  });

  it("every initiative photo exists under public/", () => {
    const publicDir = join(process.cwd(), "public");
    const photos = getInitiatives().flatMap((item) => item.photos);

    expect(photos.length).toBeGreaterThan(0);
    for (const { src } of photos) {
      expect(existsSync(join(publicDir, src)), src).toBe(true);
    }
  });
});
