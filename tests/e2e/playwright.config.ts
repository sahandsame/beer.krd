import { defineConfig, devices } from "@playwright/test";
import { ADMIN, appEnv, DB_PORT, WEB } from "./env";

const env = { ...process.env, ...appEnv } as Record<string, string>;
const root = "../..";

export default defineConfig({
  testDir: "./specs",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: { trace: "retain-on-failure", screenshot: "only-on-failure", locale: "en-US" },
  // Public checks run first: the admin tests change content (rename a service, turn the Work section on).
  projects: [
    { name: "public", use: { ...devices["Desktop Chrome"] }, testMatch: /public.spec.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile.spec.ts/ },
    {
      name: "admin",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /admin.spec.ts/,
      dependencies: ["public", "mobile"],
    },
  ],
  // Production builds of both apps against a throwaway database.
  webServer: [
    {
      command: "node --import tsx scripts/db.ts",
      url: `http://localhost:${DB_PORT + 1}`,
      env,
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: `node scripts/clean-cache.mjs && pnpm --dir ${root} --filter @beer/web build && pnpm --dir ${root} --filter @beer/web exec next start --port 3200`,
      url: `${WEB}/api/health`,
      env: { ...env, NODE_ENV: "production" },
      timeout: 400_000,
      reuseExistingServer: false,
    },
    {
      command: `pnpm --dir ${root} --filter @beer/admin build && pnpm --dir ${root} --filter @beer/admin exec next start --port 3300`,
      url: `${ADMIN}/login`,
      env: { ...env, NODE_ENV: "production" },
      timeout: 400_000,
      reuseExistingServer: false,
    },
  ],
});
