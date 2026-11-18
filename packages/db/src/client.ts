import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema> & { $client: pg.Pool };

export function createDb(url: string, max = 10): Database {
  const pool = new pg.Pool({ connectionString: url, max });
  return drizzle({ client: pool, schema, casing: "snake_case" }) as Database;
}

const globalForDb = globalThis as unknown as { __beerDb?: Database };

/** Shared, lazily created connection (survives Next.js hot reloads in dev). */
export function getDb(): Database {
  if (!globalForDb.__beerDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.__beerDb = createDb(url);
  }
  return globalForDb.__beerDb;
}

/** Proxy so modules can `import { db }` without connecting at import time (e.g. during `next build`). */
export const db: Database = new Proxy({} as Database, {
  get(_t, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(real) : value;
  },
});
