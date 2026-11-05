import type { NextConfig } from "next";

import { securityHeaders } from "./lib/security-headers";

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
