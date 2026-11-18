/** Fresh Postgres for the e2e run: migrate, seed a known owner, then stay up until Playwright stops it. */
import { rm } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";
import { createDb } from "../../../packages/db/src/client";
import { runMigrations } from "../../../packages/db/src/migrate";
import { seed } from "../../../packages/db/src/seed";
import { appEnv, DB_PORT, OWNER } from "../env";

const dir = path.join(appEnv.E2E_TMP!, "pg");
await rm(appEnv.E2E_TMP!, { recursive: true, force: true });
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: "beer",
  password: "beer",
  port: DB_PORT,
  persistent: false,
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
  onLog: () => {},
});
await pg.initialise();
await pg.start();
await pg.createDatabase("beer");
const url = appEnv.DATABASE_URL!;
await runMigrations(url);
const db = createDb(url, 1);
await seed(db, OWNER);
await db.$client.end();
console.log("e2e database ready");

// Readiness endpoint for Playwright's webServer.
http.createServer((_q, r) => r.end("ok")).listen(DB_PORT + 1);
const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
