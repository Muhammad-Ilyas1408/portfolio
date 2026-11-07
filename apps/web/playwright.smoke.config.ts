import { defineConfig, devices } from "@playwright/test";

/**
 * Read-only smoke test against a deployed site (M9):
 *   SMOKE_BASE_URL=https://muhammad-ilyas.vercel.app pnpm --filter web test:smoke
 *
 * No web server is started and nothing is built. Without SMOKE_BASE_URL every
 * test is skipped. It lives in tests/smoke/, outside the normal e2e testDir,
 * so `pnpm --filter web test:e2e` and CI never run it.
 */
export default defineConfig({
  testDir: "tests/smoke",
  testMatch: "**/*.smoke.ts",
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: process.env.SMOKE_BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
