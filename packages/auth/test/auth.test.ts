import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startTestDb } from "../../db/test/pg";

let pg: Awaited<ReturnType<typeof startTestDb>>;
// Imported after DATABASE_URL is set.
let auth: typeof import("../src/server").auth;
let dbm: typeof import("@beer/db");

beforeAll(async () => {
  pg = await startTestDb(5545);
  process.env.DATABASE_URL = pg.url;
  process.env.BETTER_AUTH_SECRET = "test-secret-test-secret-test-secret-123";
  process.env.BETTER_AUTH_URL = "http://localhost:3100";
  const { runMigrations } = await import("../../db/src/migrate");
  await runMigrations(pg.url);
  dbm = await import("@beer/db");
  ({ auth } = await import("../src/server"));
  await dbm.createCredentialUser(dbm.db, {
    email: "editor@beer.krd",
    name: "Ed",
    password: "correct-horse-1",
    role: "editor",
  });
}, 120_000);

afterAll(async () => {
  await dbm?.getDb().$client.end();
  await pg?.stop();
});

describe("staff auth", () => {
  it("signs in with the right password and exposes the role", async () => {
    const res = await auth.api.signInEmail({
      body: { email: "editor@beer.krd", password: "correct-horse-1" },
    });
    expect(res.token).toBeTruthy();
    expect((res.user as { role?: string }).role).toBe("editor");
  });

  it("rejects a wrong password", async () => {
    await expect(
      auth.api.signInEmail({ body: { email: "editor@beer.krd", password: "wrong-password" } }),
    ).rejects.toThrow();
  });

  it("does not allow public sign-up", async () => {
    await expect(
      auth.api.signUpEmail({
        body: { email: "stranger@example.com", password: "some-password-1", name: "Stranger" },
      }),
    ).rejects.toThrow();
    const { eq } = await import("drizzle-orm");
    expect(
      await dbm.db.query.user.findFirst({ where: eq(dbm.user.email, "stranger@example.com") }),
    ).toBeUndefined();
  });

  it("blocks deactivated users", async () => {
    const { eq } = await import("drizzle-orm");
    await dbm.db
      .update(dbm.user)
      .set({ active: false })
      .where(eq(dbm.user.email, "editor@beer.krd"));
    await expect(
      auth.api.signInEmail({ body: { email: "editor@beer.krd", password: "correct-horse-1" } }),
    ).rejects.toThrow();
  });
});
