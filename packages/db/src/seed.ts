import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb, type Database } from "./client";
import { contentBlock, service, setting } from "./schema";
import { defaultSettings, seedBlocks, seedServices } from "./seed-data";
import { SITE_SETTINGS_KEY } from "./settings";
import { createCredentialUser } from "./users";

/**
 * Idempotent: only inserts rows that don't exist yet, so it never overwrites edits made in the admin.
 */
export async function seed(
  db: Database,
  owner?: { email: string; password: string; name: string },
) {
  await db
    .insert(service)
    .values(seedServices.map((s) => ({ ...s, published: true })))
    .onConflictDoNothing({ target: service.slug });

  await db
    .insert(contentBlock)
    .values(
      Object.entries(seedBlocks).map(([key, data]) => ({
        key,
        data: data as Record<string, unknown>,
      })),
    )
    .onConflictDoNothing({ target: contentBlock.key });

  await db
    .insert(setting)
    .values({ key: SITE_SETTINGS_KEY, value: defaultSettings })
    .onConflictDoNothing({ target: setting.key });

  if (owner) {
    const anyUser = await db.query.user.findFirst();
    if (!anyUser) {
      await createCredentialUser(db, { ...owner, role: "owner" });
      return { ownerCreated: true };
    }
  }
  return { ownerCreated: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const db = createDb(url, 2);
  const email = process.env.SEED_OWNER_EMAIL;
  const password = process.env.SEED_OWNER_PASSWORD;
  const name = process.env.SEED_OWNER_NAME ?? "Owner";
  const result = await seed(db, email && password ? { email, password, name } : undefined);
  console.log(`✓ seed complete${result.ownerCreated ? ` (owner account created: ${email})` : ""}`);
  await db.$client.end();
}
