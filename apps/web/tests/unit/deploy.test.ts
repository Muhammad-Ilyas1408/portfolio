import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { assertBuildEnv, checkBuildEnv } from "@/lib/build-env";

const SITE = "https://muhammad-ilyas.vercel.app";
const API = "https://muhammad-ilyas-api.vercel.app";

describe("build-time env check (M9)", () => {
  it("does nothing for local builds", () => {
    expect(checkBuildEnv({})).toEqual({ errors: [], warnings: [] });
    expect(
      checkBuildEnv({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }),
    ).toEqual({ errors: [], warnings: [] });
  });

  it("passes a Vercel production build with both https URLs", () => {
    const env = {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: SITE,
      NEXT_PUBLIC_API_URL: API,
    };
    expect(checkBuildEnv(env)).toEqual({ errors: [], warnings: [] });
    expect(() => assertBuildEnv(env)).not.toThrow();
  });

  it("fails a Vercel production build when either URL is missing or wrong", () => {
    const cases: [Record<string, string>, RegExp][] = [
      [{ NEXT_PUBLIC_API_URL: API }, /NEXT_PUBLIC_SITE_URL is not set/],
      [{ NEXT_PUBLIC_SITE_URL: SITE }, /NEXT_PUBLIC_API_URL is not set/],
      [
        {
          NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
          NEXT_PUBLIC_API_URL: API,
        },
        /NEXT_PUBLIC_SITE_URL must use https/,
      ],
      [
        {
          NEXT_PUBLIC_SITE_URL: SITE,
          NEXT_PUBLIC_API_URL: "https://localhost:8000",
        },
        /NEXT_PUBLIC_API_URL points at localhost/,
      ],
      [
        {
          NEXT_PUBLIC_SITE_URL: "muhammad-ilyas.vercel.app",
          NEXT_PUBLIC_API_URL: API,
        },
        /NEXT_PUBLIC_SITE_URL is not a valid URL/,
      ],
    ];
    for (const [vars, message] of cases) {
      const env = { VERCEL_ENV: "production", ...vars };
      expect(checkBuildEnv(env).errors.join("\n")).toMatch(message);
      expect(() => assertBuildEnv(env)).toThrow(/Production build stopped/);
    }
  });

  it("only warns on a Vercel preview build", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const env = { VERCEL_ENV: "preview" };

    expect(checkBuildEnv(env).errors).toEqual([]);
    expect(checkBuildEnv(env).warnings).toHaveLength(2);
    expect(() => assertBuildEnv(env)).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it("is wired into next.config.ts", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain("assertBuildEnv(process.env)");
  });
});

describe("NEXT_PUBLIC_SITE_URL drives every absolute URL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("feeds the sitemap, robots, metadataBase and JSON-LD", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", `${SITE}/`);
    vi.resetModules();

    const { siteUrl } = await import("@/lib/site");
    const sitemap = (await import("@/app/sitemap")).default;
    const robots = (await import("@/app/robots")).default;
    const { personId } = await import("@/lib/json-ld");

    expect(siteUrl).toBe(SITE);
    expect(sitemap().every(({ url }) => url.startsWith(`${SITE}/`))).toBe(true);
    expect(robots().sitemap).toBe(`${SITE}/sitemap.xml`);
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/styleguide",
    });
    // metadataBase (canonicals and Open Graph URLs resolve against it). The
    // layout loads next/font, which jsdom cannot run, so check its source.
    const layout = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain("metadataBase: new URL(siteUrl)");
    expect(personId).toBe(`${SITE}/#person`);
  });
});

describe("env examples", () => {
  it("documents both public variables for the web app", () => {
    const example = readFileSync(join(process.cwd(), ".env.example"), "utf8");
    expect(example).toMatch(/^NEXT_PUBLIC_API_URL=/m);
    expect(example).toMatch(/^NEXT_PUBLIC_SITE_URL=/m);
  });
});
