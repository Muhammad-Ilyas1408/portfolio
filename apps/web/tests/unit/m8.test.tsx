import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as credentialsMetadata } from "@/app/credentials/page";
import { metadata as experienceMetadata } from "@/app/experience/page";
import { metadata as leadershipMetadata } from "@/app/leadership/page";
import { metadata as notFoundMetadata } from "@/app/not-found";
import { metadata as homeMetadata } from "@/app/page";
import { generateMetadata as caseStudyMetadata } from "@/app/projects/[slug]/page";
import { metadata as projectsMetadata } from "@/app/projects/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  EventsTable,
  visibleEvents,
} from "@/components/leadership/EventsTable";
import { openDetailsForHash } from "@/components/leadership/OpenTargetDetails";
import {
  getCaseStudySlugs,
  getInitiatives,
  getProfile,
  getProject,
  getProjects,
  getPublishedCredentials,
  initiativeId,
} from "@/content";
import {
  caseStudyJsonLd,
  personId,
  personJsonLd,
  serializeJsonLd,
} from "@/lib/json-ld";
import { initials } from "@/lib/og";
import {
  apiOrigin,
  contentSecurityPolicy,
  securityHeaders,
} from "@/lib/security-headers";
import { absoluteUrl, resolveSiteUrl, siteUrl } from "@/lib/site";
import { tokens } from "@/lib/tokens";

const profile = getProfile();

async function allPageMetadata(): Promise<[string, Metadata][]> {
  const caseStudies = await Promise.all(
    getCaseStudySlugs().map(
      async (slug) =>
        [
          `/projects/${slug}`,
          await caseStudyMetadata({
            params: Promise.resolve({ slug }),
          } as PageProps<"/projects/[slug]">),
        ] as [string, Metadata],
    ),
  );
  return [
    ["/", homeMetadata],
    ["/projects", projectsMetadata],
    ...caseStudies,
    ["/experience", experienceMetadata],
    ["/leadership", leadershipMetadata],
    ["/credentials", credentialsMetadata],
    ["/about", aboutMetadata],
    ["/contact", contactMetadata],
  ];
}

describe("site URL", () => {
  it("defaults to the dev server and keeps only the origin", () => {
    expect(resolveSiteUrl(undefined)).toBe("http://localhost:3000");
    expect(resolveSiteUrl("  ")).toBe("http://localhost:3000");
    expect(resolveSiteUrl("https://example.dev/")).toBe("https://example.dev");
    expect(resolveSiteUrl("https://example.dev/some/path")).toBe(
      "https://example.dev",
    );
  });

  it("builds absolute URLs on the site origin", () => {
    expect(absoluteUrl("/projects")).toBe(`${siteUrl}/projects`);
  });
});

describe("page metadata", () => {
  it("gives every public route a unique title and description", async () => {
    const all = await allPageMetadata();
    const titles = all.map(([, m]) => m.title);
    const descriptions = all.map(([, m]) => m.description);

    expect(all).toHaveLength(9);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const [, m] of all) {
      expect(m.description).toMatch(/\S{3,}/);
    }
  });

  it("sets canonical, Open Graph and a large Twitter card on every route", async () => {
    for (const [path, m] of await allPageMetadata()) {
      expect(m.alternates?.canonical).toBe(path);
      expect(m.openGraph).toMatchObject({
        title: m.title,
        description: m.description,
        url: path,
        siteName: profile.name,
      });
      expect(m.twitter).toMatchObject({
        card: "summary_large_image",
        title: m.title,
      });
      const [image] = m.openGraph?.images as { url: string }[];
      expect(image.url).toBe(
        path.startsWith("/projects/")
          ? `${path}/opengraph-image`
          : "/opengraph-image",
      );
    }
  });

  it("marks case studies as articles and other routes as websites", async () => {
    for (const [path, m] of await allPageMetadata()) {
      expect((m.openGraph as { type: string }).type).toBe(
        path.startsWith("/projects/") ? "article" : "website",
      );
    }
  });

  it("gives the 404 its own title and no canonical", () => {
    expect(notFoundMetadata.title).toBe("Page not found — Muhammad Ilyas");
    expect(notFoundMetadata.alternates).toBeUndefined();
    expect(notFoundMetadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });
});

describe("sitemap and robots", () => {
  it("lists every public route once, as absolute URLs, without /styleguide", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      [
        "/",
        "/projects",
        "/projects/flood-aware",
        "/projects/storyweave",
        "/experience",
        "/leadership",
        "/credentials",
        "/about",
        "/contact",
      ].map(absoluteUrl),
    );
    expect(urls.some((url) => url.includes("styleguide"))).toBe(false);
  });

  it("allows everything except /styleguide and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/styleguide" },
      sitemap: absoluteUrl("/sitemap.xml"),
    });
  });
});

describe("JSON-LD", () => {
  it("describes the Person from content only", () => {
    const degree = getPublishedCredentials("degree")[0];
    const person = personJsonLd(profile, degree);

    expect(person).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: "Muhammad Ilyas",
      jobTitle: "AI/ML Engineer",
      url: absoluteUrl("/"),
      image: absoluteUrl("/portrait.jpeg"),
      email: profile.links.email.replace(/^mailto:/, ""),
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Peshawar",
      },
      sameAs: [profile.links.github, profile.links.linkedin],
    });
    expect(JSON.stringify(person)).not.toMatch(/kaggle/i);
    expect(person.email).not.toMatch(/^mailto:/);
  });

  it("leaves out image and alumniOf when content has none", () => {
    const person = personJsonLd({ ...profile, portrait: undefined });

    expect(person).not.toHaveProperty("image");
    expect(person).not.toHaveProperty("alumniOf");
  });

  it("describes each case study as a CreativeWork authored by the Person", () => {
    for (const project of getProjects()) {
      const work = caseStudyJsonLd(project, profile);
      const authors = [work.author].flat() as Record<string, string>[];

      expect(work).toMatchObject({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: absoluteUrl(`/projects/${project.slug}`),
      });
      expect(authors[0]).toEqual({
        "@type": "Person",
        "@id": personId,
        name: profile.name,
      });
      // Every team member is credited, and only them.
      expect(authors.map((a) => a.name).sort()).toEqual(
        project.team.map((m) => m.name).sort(),
      );
      const links = project.links.map((link) => link.url);
      for (const url of work.sameAs as string[]) {
        expect(links).toContain(url);
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it("links Flood-Aware to its repo and live app", () => {
    const work = caseStudyJsonLd(getProject("flood-aware")!, profile);

    expect(work.sameAs).toEqual([
      "https://github.com/Muhammad-Ilyas1408/flood-aware",
      "https://flood-aware.vercel.app",
    ]);
  });

  it("escapes < so the payload cannot close its script tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)" });
  });
});

describe("security headers", () => {
  it("derives the API origin from NEXT_PUBLIC_API_URL", () => {
    expect(apiOrigin("https://api.example.dev/v1/")).toBe(
      "https://api.example.dev",
    );
    expect(apiOrigin("http://localhost:8000")).toBe("http://localhost:8000");
    expect(apiOrigin(undefined)).toBeUndefined();
    expect(apiOrigin("not a url")).toBeUndefined();
  });

  it("builds the production CSP", () => {
    expect(contentSecurityPolicy({ apiUrl: "https://api.example.dev/" })).toBe(
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.example.dev; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
    );
  });

  it("allows eval only in development and connects to self without an API URL", () => {
    expect(contentSecurityPolicy({ isDev: true })).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
    );
    expect(contentSecurityPolicy({})).toContain("connect-src 'self';");
    expect(contentSecurityPolicy({})).not.toContain("unsafe-eval");
  });

  it("sets HSTS, nosniff, referrer and permissions policies", () => {
    const headers = Object.fromEntries(
      securityHeaders({}).map(({ key, value }) => [key, value]),
    );

    expect(headers).toMatchObject({
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
    expect(headers["Content-Security-Policy"]).toMatch(/^default-src 'self'/);
  });
});

describe("image tokens", () => {
  it("match the CSS variables in globals.css", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

    for (const [name, value] of Object.entries(tokens)) {
      expect(css).toContain(`--${name}: ${value};`);
    }
  });

  it("make an MI monogram from the name", () => {
    expect(initials(profile.name)).toBe("MI");
  });
});

describe("events toggle", () => {
  const all = getInitiatives();

  it("shows the newest 8 and puts the rest in a 'Show all' disclosure", () => {
    const { container } = render(<EventsTable initiatives={all} />);
    const details = container.querySelector("details#all-events")!;
    const outside = [...container.querySelectorAll("tbody > tr")].filter(
      (row) => !details.contains(row),
    );
    const inside = details.querySelectorAll("tbody > tr");

    expect(visibleEvents).toBe(8);
    expect(outside.map((row) => row.id)).toEqual(
      all.slice(0, 8).map(initiativeId),
    );
    expect(inside).toHaveLength(all.length - 8);
    expect(details.hasAttribute("open")).toBe(false);
    expect(details.querySelector(":scope > summary")?.textContent).toBe(
      `Show all ${all.length} events`,
    );
  });

  it("keeps one row per initiative, each with its anchor", () => {
    const { container } = render(<EventsTable initiatives={all} />);
    const ids = [...container.querySelectorAll("tbody > tr")].map((r) => r.id);

    expect(ids).toEqual(all.map(initiativeId));
  });

  it("has no disclosure with 8 or fewer events", () => {
    const { container } = render(<EventsTable initiatives={all.slice(0, 8)} />);

    expect(container.querySelector("details#all-events")).toBeNull();
  });

  it("opens the disclosure when the hash targets a hidden event", () => {
    render(<EventsTable initiatives={all} />);
    const hidden = initiativeId(all[all.length - 1]);
    const details = document.querySelector<HTMLDetailsElement>("#all-events")!;
    Element.prototype.scrollIntoView ??= () => {};

    expect(openDetailsForHash(`#${initiativeId(all[0])}`)).toBe(false);
    expect(details.open).toBe(false);
    expect(openDetailsForHash("#no-such-event")).toBe(false);
    expect(openDetailsForHash(`#${hidden}`)).toBe(true);
    expect(details.open).toBe(true);
  });
});
