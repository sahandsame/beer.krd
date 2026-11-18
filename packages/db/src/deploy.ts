/**
 * Entry point for the one-shot "migrate" container on every deploy:
 * wait for Postgres, apply migrations, then run the idempotent seed.
 * Prints a readable reason on failure (never the password).
 */
import pg from "pg";
import { createDb } from "./client";
import { runMigrations } from "./migrate";
import { seed } from "./seed";

const CONNECT_ERRORS = new Set([
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "ECONNRESET",
  "57P03",
]);

/** Where we're connecting to, without credentials. */
export function describeTarget(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}:${u.port || "5432"}/${u.pathname.replace(/^\//, "") || "(no database name)"} as ${decodeURIComponent(u.username) || "(no user)"}`;
  } catch {
    return "(DATABASE_URL is not a valid URL)";
  }
}

export function hintFor(code: string | undefined): string {
  switch (code) {
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "The database host name can't be resolved. In Coolify, enable \"Connect To Predefined Network\" on the app and use the database's *internal* URL.";
    case "ECONNREFUSED":
    case "ETIMEDOUT":
      return "Nothing is accepting connections there. Check the database is running and the port is right.";
    case "28P01":
      return "Wrong username or password in DATABASE_URL.";
    case "3D000":
      return "The database in DATABASE_URL doesn't exist. Create it or fix the name.";
    case "28000":
      return "The server rejected this user (pg_hba). Use the internal URL from the database resource.";
    default:
      return "See the error above.";
  }
}

async function waitForDb(url: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  for (let attempt = 1; ; attempt++) {
    const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      await client.query("select 1");
      return;
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (!code || !CONNECT_ERRORS.has(code) || Date.now() > deadline) throw e;
      console.log(`… database not reachable yet (${code}), retrying (attempt ${attempt})`);
      await new Promise((r) => setTimeout(r, 3000));
    } finally {
      await client.end().catch(() => {});
    }
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("✗ DATABASE_URL is not set. Add it to the app's environment variables.");
    process.exit(1);
  }
  const target = describeTarget(url);
  console.log(`→ database: ${target}`);
  try {
    await waitForDb(url, Number(process.env.DB_WAIT_MS ?? 60_000));
    await runMigrations(url);
    console.log("✓ migrations applied");
    const db = createDb(url, 2);
    try {
      const email = process.env.SEED_OWNER_EMAIL;
      const password = process.env.SEED_OWNER_PASSWORD;
      const result = await seed(
        db,
        email && password
          ? { email, password, name: process.env.SEED_OWNER_NAME || "Owner" }
          : undefined,
      );
      console.log(
        `✓ seed complete${result.ownerCreated ? ` (owner account created: ${email})` : ""}`,
      );
    } finally {
      await db.$client.end();
    }
  } catch (e) {
    const err = e as {
      code?: string;
      message?: string;
      cause?: { code?: string; message?: string };
    };
    const code = err.code ?? err.cause?.code;
    console.error(`✗ deploy step failed for ${target}`);
    console.error(`  ${code ? `[${code}] ` : ""}${err.cause?.message ?? err.message ?? String(e)}`);
    console.error(`  Hint: ${hintFor(code)}`);
    process.exit(1);
  }
}

await main();
