import "server-only";
import { auth } from "@beer/auth";
import { hasRole } from "@beer/auth/roles";
import { db, user as userTable } from "@beer/db";
import type { StaffRole } from "@beer/validators";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { cache } from "react";

/** The signed-in staff member, read fresh from the DB (role and active flag can change at any time). */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const u = await db.query.user.findFirst({ where: eq(userTable.id, session.user.id) });
  if (!u?.active) return null;
  return u;
});

/** Use at the top of every admin page and server action. */
export async function requireUser(minRole: StaffRole = "editor") {
  const u = await getCurrentUser();
  if (!u) redirect("/login");
  if (!hasRole(u.role, minRole)) forbidden();
  return u;
}
