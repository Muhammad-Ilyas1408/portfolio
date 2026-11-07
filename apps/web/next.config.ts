import type { NextConfig } from "next";

import { assertBuildEnv } from "./lib/build-env";
import { securityHeaders } from "./lib/security-headers";

// M9: a Vercel production build fails without a real NEXT_PUBLIC_SITE_URL and
// NEXT_PUBLIC_API_URL (both are inlined at build time). See lib/build-env.ts.
assertBuildEnv(process.env);

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          apiUrl: process.env.NEXT_PUBLIC_API_URL,
          isDev: process.env.NODE_ENV === "development",
        }),
      },
    ];
  },
};

export default nextConfig;
