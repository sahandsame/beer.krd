import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDb } from "./client";

const here = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations(url: string) {
  const db = createDb(url, 1);
  try {
    await migrate(db, { migrationsFolder: path.resolve(here, "../drizzle") });
  } finally {
    await db.$client.end();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  await runMigrations(url);
  console.log("✓ migrations applied");
}
