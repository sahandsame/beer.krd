/**
 * Local Postgres without Docker: downloads real Postgres binaries via npm (embedded-postgres)
 * and runs them on port 5433 with data in <repo>/.data/pg.
 *
 *   pnpm db:dev          # keep running in its own terminal
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");

export async function startEmbeddedPostgres(opts: { dir: string; port: number; database: string }) {
  const pg = new EmbeddedPostgres({
    databaseDir: opts.dir,
    user: "beer",
    password: "beer",
    port: opts.port,
    persistent: true,
    // Kurdish/Arabic text needs UTF-8 (Windows defaults to WIN1252)
    initdbFlags: ["--encoding=UTF8", "--locale=C"],
    onLog: () => {},
  });
  if (!existsSync(path.join(opts.dir, "PG_VERSION"))) await pg.initialise();
  await pg.start();
  try {
    await pg.createDatabase(opts.database);
  } catch {
    // already exists
  }
  return pg;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.DEV_DB_PORT ?? 5433);
  const dir = path.join(root, ".data", "pg");
  const pg = await startEmbeddedPostgres({ dir, port, database: "beer" });
  console.log(`✓ Postgres running on postgres://beer:beer@localhost:${port}/beer  (data: ${dir})`);
  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  setInterval(() => {}, 1 << 30);
}
