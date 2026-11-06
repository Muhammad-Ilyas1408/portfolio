import { readFileSync } from "node:fs";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { skillsUsedIn, TechStack } from "@/components/home/TechStack";
import { Timeline } from "@/components/leadership/Timeline";
import { Reveal } from "@/components/motion/Reveal";
import {
  getCommunityRoles,
  getFeaturedProjects,
  getHomeLeadership,
  getHomeContact,
  getHomeHero,
  getProfile,
  getSiteDescription,
  getSkills,
} from "@/content";
import { formatDuration } from "@/lib/format";
import { tokens } from "@/lib/tokens";

describe("formatDuration", () => {
  it("counts months inclusively, in plain words", () => {
    expect(formatDuration("2025-01", "2025-04")).toBe("4 months");
    expect(formatDuration("2025-06", "2025-06")).toBe("1 month");
    expect(formatDuration("2025-10", "2026-09")).toBe("1 year");
    expect(formatDuration("2024-12", "2026-02")).toBe("1 year 3 months");
    expect(formatDuration("2023-09", "2025-09")).toBe("2 years 1 month");
  });

  it("shows nothing for an ongoing role", () => {
    expect(formatDuration("2025-01")).toBeUndefined();
  });
});

describe("leadership timeline durations", () => {
  it("shows each role's length next to its period", () => {
    const roles = getCommunityRoles();
    render(<Timeline roles={roles} />);
    for (const role of roles) {
      const duration = formatDuration(role.start, role.end);
      if (duration)
        expect(screen.getAllByText(duration).length).toBeGreaterThan(0);
    }
    // The presidency, Oct 2025 – Sep 2026.
    expect(screen.getAllByText("1 year").length).toBeGreaterThan(0);
  });
});

describe("TechStack", () => {
  const groups = getSkills();
  const featured = getFeaturedProjects();

  it("groups every skill by category, with no bars or percentages", () => {
    const { container } = render(
      <TechStack groups={groups} featured={featured} number="02" />,
    );
    for (const group of groups) {
      const list = screen.getByRole("list", { name: group.name });
      expect(within(list).getAllByRole("listitem")).toHaveLength(
        group.skills.length,
      );
    }
    expect(container).not.toHaveTextContent("%");
    expect(container.querySelector("img, progress, meter")).toBeNull();
  });

  it("marks exactly the skills used in featured projects", () => {
    render(<TechStack groups={groups} featured={featured} number="02" />);
    const used = skillsUsedIn(groups, featured);
    expect([...used]).toContain("LangGraph");
    expect([...used]).not.toContain("LoRA/QLoRA"); // internship only
    const marked = screen
      .getAllByText("(used in a featured project)")
      .map((note) => note.parentElement?.firstChild?.nextSibling?.textContent);
    expect(marked.sort()).toEqual([...used].sort());
  });
});

describe("hero copy in metadata", () => {
  it("builds the description from the owner's tagline and first sentence", () => {
    expect(getSiteDescription()).toBe(
      "Engineering Intelligent Systems, Creating Real-World Impact. I'm an AI/ML Engineer with a background in Computer Science and a passion for building practical AI applications.",
    );
  });

  it("keeps the owner's facts in the community line", () => {
    const { community } = getHomeHero();
    expect(community).toContain("about 40");
    expect(community).toContain("18 events");
    expect(community).toContain("2025–26");
  });
});

describe("copy pass", () => {
  it("rewrites the footer line and contact line without em dashes", () => {
    expect(getProfile().positioning).toBe(
      "I build LLM-powered and agentic systems, and I led the Computing Students Society at the University of Peshawar.",
    );
    expect(getHomeContact().line).toBe(
      "Send a message and I'll reply by email.",
    );
  });
});

describe("footer", () => {
  it("has a Back to top link to the main landmark", async () => {
    render(await SiteFooter());
    expect(screen.getByRole("link", { name: /Back to top/ })).toHaveAttribute(
      "href",
      "#main",
    );
  });
});

describe("Reveal", () => {
  it("renders its content visible by default (no JS state needed)", () => {
    render(
      <Reveal as="ul" stagger>
        <li>One</li>
      </Reveal>,
    );
    const list = screen.getByRole("list");
    expect(list).not.toHaveAttribute("data-reveal");
    expect(list).toHaveAttribute("data-stagger");
  });
});

describe("palette A", () => {
  it("uses the owner-chosen tokens for generated images", () => {
    expect(tokens.bg).toBe("#0a0a14");
    expect(tokens.signal).toBe("#a08cff");
    expect(tokens.ember).toBe("#c4f042");
  });
});

describe("lime accents and gradients (M8.6 follow-up)", () => {
  it("puts the full leadership phrase, with its full stop, in lime", () => {
    const { headline } = getHomeLeadership();
    expect(headline.text).toBe(
      "From a GDSC team member to leading the Computing Students Society.",
    );
    expect(headline.accent).toBe("leading the Computing Students Society.");
  });

  const css = readFileSync("app/globals.css", "utf8");

  /** Every gradient call in globals.css, with its property name. */
  function gradients() {
    const found: { property: string; body: string }[] = [];
    const pattern = /(radial|linear)-gradient\(/g;
    for (const match of css.matchAll(pattern)) {
      let depth = 1;
      let end = match.index + match[0].length;
      while (depth > 0) {
        if (css[end] === "(") depth++;
        if (css[end] === ")") depth--;
        end++;
      }
      const before = css.slice(0, match.index);
      const property = before
        .slice(before.lastIndexOf(";") + 1)
        .match(/([a-z-]+)\s*:/g);
      found.push({
        property: property ? property[property.length - 1] : "",
        body: css.slice(match.index + match[0].length, end - 1).trim(),
      });
    }
    return found;
  }

  it("interpolates every colour gradient in oklch", () => {
    const colour = gradients().filter(
      ({ property, body }) =>
        !property.startsWith("mask") &&
        // Hard 1px stops (dot grid, grid lines) never blend two colours.
        !/ 1px,\s*transparent 1px$/.test(body),
    );
    expect(colour.length).toBeGreaterThan(10);
    // The one documented exception: the owner chose the palette A preview's
    // plain-sRGB violet-to-lime look for the hero tagline (text-gradient)
    // over the oklch version. Every other colour gradient uses oklch.
    const TAGLINE = "90deg, var(--signal), var(--ember) 85%";
    const exceptions = colour.filter(({ body }) => body === TAGLINE);
    expect(exceptions).toHaveLength(1);
    for (const { body } of colour.filter(({ body }) => body !== TAGLINE)) {
      expect(body, body).toMatch(/^(var\(--in-oklch,\)|in oklch)/);
    }
    expect(css).toMatch(
      /@supports \(background: linear-gradient\(in oklch 90deg, red, blue\)\)\s*\{\s*:root\s*\{\s*--in-oklch: in oklch;/,
    );
  });

  it("recreates the palette A preview gradient on the tagline, with a solid violet fallback", () => {
    const rule = css.slice(
      css.indexOf("@utility text-gradient"),
      css.indexOf("@utility", css.indexOf("@utility text-gradient") + 1),
    );
    // Solid violet outside the @supports block.
    expect(rule).toMatch(
      /^@utility text-gradient \{\s*color: var\(--signal\);/,
    );
    expect(rule).toContain(
      "linear-gradient(90deg, var(--signal), var(--ember) 85%)",
    );
    expect(rule).not.toContain("oklch");
    expect(rule).toContain("box-decoration-break: clone");
  });
});
