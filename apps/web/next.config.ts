import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// One .env at the repo root is shared by every app.
const root = path.resolve(import.meta.dirname, "../..");
try {
  process.loadEnvFile(path.join(root, ".env"));
} catch {
  // no .env file (e.g. in Docker, where env comes from compose)
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
  ],
  serverExternalPackages: ["sharp", "pg"],
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default createNextIntlPlugin("./src/i18n/request.ts")(config);
