import { describe, expect, it } from "vitest";

import {
  getFeaturedProjects,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  getPublishedInitiatives,
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
    expect(initiatives).toHaveLength(2);
    expect(credentials).toHaveLength(11);
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
  it("returns the profile without an availability line", () => {
    expect(getProfile().location).toBe("Peshawar, Pakistan");
    expect(getProfile().availability).toBeUndefined();
  });

  it("never returns unpublished credentials", () => {
    const published = getPublishedCredentials();

    expect(published).toHaveLength(2);
    expect(published.every((item) => item.published)).toBe(true);
    expect(getPublishedCredentials("degree").map((c) => c.name)).toEqual([
      "BS Computer Science",
    ]);
    expect(getPublishedCredentials("award")).toHaveLength(1);
    expect(getPublishedCredentials("specialization")).toHaveLength(0);
  });

  it("never returns unpublished initiatives", () => {
    expect(getPublishedInitiatives()).toHaveLength(0);
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
    expect(result.at(-1)?.title).toBe("AI/ML Team Lead");
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

  it("does not invent personal contributions for Flood-Aware", () => {
    expect(getProject("flood-aware")?.myContributions).toEqual([]);
  });
});
