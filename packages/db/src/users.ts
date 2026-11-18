import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { account, user } from "./schema";

/**
 * Create a staff user with an email+password login, the same way Better Auth stores
 * credential accounts. Used by the seed script and the invitation flow
 * (public sign-up is disabled).
 */
export async function createCredentialUser(
  db: Database,
  input: { email: string; name: string; password: string; role: string },
) {
  const email = input.email.trim().toLowerCase();
  const existing = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (existing) throw new Error("A user with this email already exists");
  const id = crypto.randomUUID();
  const hash = await hashPassword(input.password);
  return db.transaction(async (tx) => {
    const [u] = await tx
      .insert(user)
      .values({ id, email, name: input.name, role: input.role, emailVerified: true })
      .returning();
    await tx.insert(account).values({
      id: crypto.randomUUID(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: hash,
    });
    if (!u) throw new Error("Failed to create user");
    return u;
  });
}
