import path from "node:path";
import type { NextConfig } from "next";

const root = path.resolve(import.meta.dirname, "../..");
try {
  process.loadEnvFile(path.join(root, ".env"));
} catch {
  // no .env file (e.g. in Docker, where env comes from compose)
}

const config: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: root,
  transpilePackages: [
    "@beer/ui",
    "@beer/i18n",
    "@beer/db",
    "@beer/validators",
    "@beer/storage",
    "@beer/notify",
    "@beer/auth",
  ],
  serverExternalPackages: ["sharp", "pg"],
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    // Image uploads go through Server Actions.
    serverActions: { bodySizeLimit: "40mb" },
    // Enables forbidden() for role checks.
    authInterrupts: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default config;
