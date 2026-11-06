import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import { projectEyebrow } from "@/components/projects/CaseStudyCard";
import { headlineTags, Hero } from "@/components/home/Hero";
import { splitAwardName } from "@/components/home/Recognition";
import { StatsRow } from "@/components/home/StatsRow";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { AccentText } from "@/components/ui/AccentText";
import {
  getCapabilities,
  getCaseStudy,
  getChapter,
  getHomeHero,
  getHomeLeadership,
  getHomeProof,
  getHomeStats,
  getInitiatives,
  getLeadershipPath,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  getRecognition,
  getRoles,
  getWorkedWith,
} from "@/content";
import { HomeStat, StatClaim, statInText } from "@/content/schema";
import {
  formatEventRange,
  formatMonthRange,
  formatYearSpan,
} from "@/lib/format";

describe("headlineTags", () => {
  it("keeps the three headline segments after the title", () => {
    expect(headlineTags(getProfile().headline)).toEqual([
      "Generative AI & Agentic Systems",
      "LLM Engineering, RAG & FastAPI",
      "Deep Learning & NLP",
    ]);
  });
});

// M8.6: the owner's own words, used exactly.
const OWNER_INTRO =
  "I'm an AI/ML Engineer with a background in Computer Science and a passion for building practical AI applications. My work focuses on Machine Learning, Deep Learning, and LLM-powered systems, including RAG and agentic applications. I enjoy taking ideas from experimentation to working software, combining AI engineering with backend development to solve real-world problems.";
const OWNER_COMMUNITY =
  "Outside of code, I was President of the Computing Students Society at the University of Peshawar for 2025–26, where our team of about 40 ran 18 events.";

describe("Hero", () => {
  it("shows the owner's hero text exactly, in order", () => {
    const { container } = render(
      <Hero profile={getProfile()} hero={getHomeHero()} />,
    );

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/^Muhammad Ilyas$/);
    const texts = [
      "Hello, I'm",
      "Muhammad Ilyas",
      "AI/ML Engineer",
      "Engineering Intelligent Systems,",
      "Creating Real-World Impact",
      OWNER_INTRO,
      OWNER_COMMUNITY,
    ];
    const content = container.textContent ?? "";
    let from = 0;
    for (const text of texts) {
      const at = content.indexOf(text, from);
      expect(at, text).toBeGreaterThanOrEqual(0);
      from = at + text.length;
    }
    const tags = screen.getByRole("list", { name: "Focus areas" });
    expect(
      within(tags)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual([
      "Generative AI & Agentic Systems",
      "LLM Engineering, RAG & FastAPI",
      "Deep Learning & NLP",
    ]);
  });

  it("drops the old eyebrow and h1", () => {
    const { container } = render(
      <Hero profile={getProfile()} hero={getHomeHero()} />,
    );
    expect(container).not.toHaveTextContent("Muhammad Ilyas · AI/ML Engineer");
    expect(container).not.toHaveTextContent("Building Generative AI");
  });

  it("puts the tagline's second line in the violet-to-lime gradient and the role in signal", () => {
    render(<Hero profile={getProfile()} hero={getHomeHero()} />);
    const second = screen.getByText(
      (_, el) => el?.classList.contains("text-gradient") ?? false,
    );
    expect(second).toHaveTextContent(/^Creating Real-World Impact$/);
    expect(within(second).getByText("Real-World")).toHaveClass(
      "whitespace-nowrap",
    );
    expect(screen.getByText("AI/ML Engineer")).toHaveClass("text-signal");
  });

  it("renders the flow lines as a decorative canvas", () => {
    const { container } = render(
      <Hero profile={getProfile()} hero={getHomeHero()} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveAttribute("data-flow", "hero");
  });

  it("links the CTAs", () => {
    render(<Hero profile={getProfile()} hero={getHomeHero()} />);

    expect(screen.getByRole("link", { name: "View projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute(
      "href",
      "/cv.pdf",
    );
    expect(
      screen.getByRole("link", { name: /Leadership & community/ }),
    ).toHaveAttribute("href", "/leadership");
  });

  it("shows the portrait when it is set", () => {
    render(<Hero profile={getProfile()} hero={getHomeHero()} />);

    expect(
      screen.getByRole("img", { name: "Portrait of Muhammad Ilyas" }),
    ).toBeInTheDocument();
  });

  it("hides the portrait when it is unset", () => {
    const profile = { ...getProfile(), portrait: undefined };
    render(<Hero profile={profile} hero={getHomeHero()} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("AccentText", () => {
  it("colors only a phrase that is in the text", () => {
    const { container, rerender } = render(
      <AccentText text="Talk to us now" phrase="to us" />,
    );
    expect(container).toHaveTextContent("Talk to us now");
    expect(screen.getByText("to us")).toHaveClass("text-signal");

    rerender(<AccentText text="Talk to us now" phrase="missing" />);
    expect(container.querySelector("span")).toBeNull();
  });

  it("sets an ember phrase in lime and leaves the rest in the text colour", () => {
    const { container } = render(
      <h2>
        <AccentText text="Talk to us now" phrase="to us" accent="ember" />
      </h2>,
    );
    expect(container).toHaveTextContent("Talk to us now");
    expect(screen.getByText("to us")).toHaveClass("text-ember");
    // Only the phrase is wrapped.
    expect(container.querySelectorAll("span")).toHaveLength(1);
  });
});

/** Every text a stat may be split from: existing content only. */
function sourceTexts() {
  return [
    ...getHomeProof().map((claim) => claim.text),
    ...getProjects().flatMap((project) => project.results.map((r) => r.text)),
    ...getChapter().stats.map((stat) => stat.text),
    ...getInitiatives().flatMap((i) => i.stats.map((stat) => stat.text)),
    ...getRoles().flatMap((role) => role.myContributions),
  ];
}

describe("home stats", () => {
  const stats = [...getHomeStats(), ...getHomeLeadership().stats];

  it("are exactly the owner's four, in order", () => {
    expect(getHomeStats().map((s) => [s.value, s.label, s.detail])).toEqual([
      ["2", "Live AI projects", "Flood-Aware · StoryWeave"],
      ["1st", "Place at HackVortex Codestorm 5", "StoryWeave, team of 4"],
      ["3", "Coursera specializations", "DeepLearning.AI · IBM"],
      [
        "2025–26",
        "President, Computing Students Society",
        "University of Peshawar",
      ],
    ]);
  });

  it("split out of text keep their value in existing content", () => {
    for (const stat of stats.filter((s) => s.from)) {
      expect(stat.from).toContain(stat.value.replace(/^~/, "about "));
      expect(
        sourceTexts().some((text) => text.includes(stat.from!)),
        stat.from,
      ).toBe(true);
    }
  });

  it("that are counted match the published content", () => {
    const live = getProjects().filter((p) =>
      p.links.some((link) => link.kind === "live"),
    );
    const specializations = getPublishedCredentials("specialization");
    const [liveStat, , specializationStat] = getHomeStats();

    expect(liveStat.value).toBe(String(live.length));
    expect(liveStat.detail).toBe(live.map((p) => p.title).join(" · "));
    expect(specializationStat.value).toBe(String(specializations.length));
    for (const issuer of specializationStat.detail!.split(" · ")) {
      expect(specializations.some((c) => c.issuer?.includes(issuer))).toBe(
        true,
      );
    }
  });

  it("need exactly one source", () => {
    const base = { value: "2", label: "X", href: "/", accent: "signal" };
    expect(HomeStat.safeParse(base).success).toBe(false);
    expect(
      HomeStat.safeParse({
        ...base,
        count: "live-projects",
        from: "2 things",
        status: "self-reported",
      }).success,
    ).toBe(false);
    expect(
      HomeStat.safeParse({ ...base, count: "live-projects" }).success,
    ).toBe(true);
  });

  it("keep the evidence of their source claim", () => {
    for (const stat of getHomeStats().filter((s) => s.status === "verified")) {
      expect(stat.evidence).toBeDefined();
    }
  });

  it("reject a value that is not in its source", () => {
    expect(
      HomeStat.safeParse({
        value: "999",
        label: "Made up",
        href: "/",
        accent: "signal",
        from: "7 evidence tools",
        status: "self-reported",
      }).success,
    ).toBe(false);
  });

  it("render as links with the evidence chip or the self-reported note", () => {
    render(<StatsRow stats={getHomeStats()} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Highlights" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^2 Live AI projects/ }),
    ).toHaveAttribute("href", "/projects");
    expect(
      screen.getByRole("link", { name: /^3 Coursera specializations/ }),
    ).toHaveAttribute("href", "/credentials#specializations");
    expect(
      screen.getAllByRole("link", { name: /\(opens in a new tab\)$/ }),
    ).toHaveLength(1);
    expect(screen.getByText("Self-reported")).toBeInTheDocument();
    expect(screen.queryByText(/348|evidence tools/i)).toBeNull();
  });
});

describe("worked with", () => {
  it("lists only organizations where a role was held, without duplicates", () => {
    const orgs = getWorkedWith();
    expect(orgs).toEqual([
      "Computing Students Society (CSS)",
      "DeepCognishann Software Services",
      "GDG on Campus",
      "Connected Pakistan",
      "Google Developer Student Clubs (GDSC)",
    ]);
    for (const org of orgs) {
      expect(getRoles().some((role) => role.org.startsWith(org))).toBe(true);
    }
  });
});

describe("capabilities and recognition", () => {
  it("link each capability to real case studies", () => {
    expect(getCapabilities().map((c) => c.projects.map((p) => p.slug))).toEqual(
      [
        ["flood-aware"],
        ["flood-aware"],
        ["flood-aware"],
        ["flood-aware", "storyweave"],
      ],
    );
  });

  it("show award photos only, never the participation certificate", () => {
    const awards = getRecognition();
    expect(awards).toHaveLength(4);
    for (const award of awards) {
      expect(award.kind).toBe("award");
      expect(award.photos?.[0]).toBeDefined();
    }
    expect(splitAwardName(awards[0].name)).toEqual({
      title: "Award of Appreciation",
      detail: "President, CSS Chapter 2025–26",
    });
  });
});

describe("project cover", () => {
  it("is a decorative node diagram without the project name when no cover is set", () => {
    const project = getProject("flood-aware")!;
    const steps = getCaseStudy("flood-aware")!.architecture.steps;
    const { container } = render(
      <ProjectCover project={project} steps={steps} index={1} />,
    );
    const cover = container.firstElementChild!;

    expect(cover).toHaveAttribute("aria-hidden", "true");
    expect(cover.querySelectorAll("ol > li")).toHaveLength(4);
    expect(cover).toHaveTextContent(steps[0].label);
    expect(cover).toHaveTextContent(project.stack[0]);
    expect(cover.textContent).not.toContain(project.title);
    expect(cover.querySelector("img")).toBeNull();
  });

  it("uses the screenshot when a cover is set", () => {
    const project = {
      ...getProject("flood-aware")!,
      cover: { src: "/images/x.png", alt: "Flood-Aware screenshot" },
    };
    render(<ProjectCover project={project} steps={[]} index={1} />);

    expect(
      screen.getByRole("img", { name: "Flood-Aware screenshot" }),
    ).toBeInTheDocument();
  });

  it("builds the card eyebrow from tags and period", () => {
    expect(projectEyebrow(getProject("flood-aware")!)).toBe(
      "Agentic / RAG · Full-stack · Jun – Aug 2026",
    );
    expect(projectEyebrow(getProject("storyweave")!)).toBe(
      "Agentic / RAG · Full-stack · Oct 2025",
    );
  });
});

describe("stat splits (M8.5 B)", () => {
  it("takes every case-study and presidency stat value from its claim's text", () => {
    const claims = [
      ...getProjects().flatMap((project) => project.results),
      ...getChapter().stats,
    ];
    for (const claim of claims) {
      if (!claim.stat) continue;
      expect(statInText(claim.stat.value, claim.text), claim.text).toBe(true);
    }
  });

  it("splits Flood-Aware's results into six numbers and keeps the rest", () => {
    const results = getProject("flood-aware")!.results;
    expect(results.flatMap((r) => (r.stat ? [r.stat.value] : []))).toEqual([
      "348",
      "~2 s",
      "7",
      "150",
      "~30 s",
      "39 s",
    ]);
    expect(results.filter((r) => !r.stat).map((r) => r.text)).toEqual([
      "Golden-set evaluation with real API calls",
    ]);
  });

  it("gives every presidency figure a stat", () => {
    expect(getChapter().stats.map((claim) => claim.stat?.value)).toEqual([
      "18",
      "2,200+",
      "14",
      "4",
      "~300",
    ]);
  });

  it("rejects a stat whose value is not in its claim", () => {
    expect(
      StatClaim.safeParse({
        text: "7 evidence tools",
        status: "self-reported",
        stat: { value: "8", label: "Evidence tools" },
      }).success,
    ).toBe(false);
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
  it("renders every section, in order, with one h1", () => {
    const { container } = render(<Home />);

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "Highlights",
      "Where I've worked and led",
      "What I build",
      "Tools I work with",
      "Featured work",
      "How I work",
      "From a GDSC team member to leading the Computing Students Society.",
      "Awards and recognition",
      "Building something with LLMs, or running a tech community? Let's talk.",
    ]);
  });

  it("numbers the sections 01–06 in order", () => {
    render(<Home />);

    for (const [index, id] of [
      "what-i-build",
      "tech-stack",
      "work",
      "how-i-work",
      "leadership",
      "recognition",
    ].entries()) {
      const section = document.getElementById(id)!;
      expect(section.querySelector("p")).toHaveTextContent(
        String(index + 1).padStart(2, "0"),
      );
    }
  });

  it("links the case studies, the internship and the contact band", () => {
    render(<Home />);

    expect(
      screen.getByRole("link", { name: "Read case study: Flood-Aware" }),
    ).toHaveAttribute("href", "/projects/flood-aware");
    expect(
      screen.getByRole("link", { name: "Read case study: StoryWeave" }),
    ).toHaveAttribute("href", "/projects/storyweave");
    expect(
      screen.getByRole("link", { name: "AI/ML Engineering Intern experience" }),
    ).toHaveAttribute("href", "/experience");
    expect(screen.getByRole("link", { name: /All awards/ })).toHaveAttribute(
      "href",
      "/credentials#awards",
    );
    expect(
      screen.getByRole("link", { name: "muhammadilyas.ai.eng@gmail.com" }),
    ).toHaveAttribute("href", "mailto:muhammadilyas.ai.eng@gmail.com");
  });
});
