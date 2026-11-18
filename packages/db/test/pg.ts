import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

/** Throwaway Postgres for integration tests (real Postgres binaries, no Docker). */
export async function startTestDb(port: number) {
  const dir = await mkdtemp(path.join(tmpdir(), "beer-pg-"));
  const pg = new EmbeddedPostgres({
    databaseDir: dir,
    user: "beer",
    password: "beer",
    port,
    persistent: false,
    initdbFlags: ["--encoding=UTF8", "--locale=C"],
    onLog: () => {},
  });
  await pg.initialise();
  await pg.start();
  await pg.createDatabase("beer_test");
  return {
    url: `postgres://beer:beer@localhost:${port}/beer_test`,
    async stop() {
      await pg.stop();
      await rm(dir, { recursive: true, force: true });
    },
  };
}
