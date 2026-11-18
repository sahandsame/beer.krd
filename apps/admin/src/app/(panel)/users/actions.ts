"use server";
import { db, invitation, session, user as userTable } from "@beer/db";
import { invitationInput, staffRoles } from "@beer/validators";
import { and, count, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { type ActionResult, str, zodErrors } from "@/lib/form";
import { INVITE_TTL_DAYS, newInviteToken } from "@/lib/invitations";
import { requireUser } from "@/lib/session";

export type InviteResult = ActionResult & { link?: string };

export async function inviteUser(_prev: InviteResult, form: FormData): Promise<InviteResult> {
  const me = await requireUser("owner");
  const parsed = invitationInput.safeParse({ email: str(form, "email"), role: str(form, "role") });
  if (!parsed.success) return zodErrors(parsed.error);
  const existing = await db.query.user.findFirst({ where: eq(userTable.email, parsed.data.email) });
  if (existing) return { error: "Someone with this email already has an account." };
  // Replace any open invitation for the same email.
  await db
    .delete(invitation)
    .where(and(eq(invitation.email, parsed.data.email), isNull(invitation.acceptedAt)));
  const { token, tokenHash } = newInviteToken();
  await db.insert(invitation).values({
    ...parsed.data,
    tokenHash,
    invitedById: me.id,
    expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 864e5),
  });
  await audit(me.id, "invite", "user", null, `Invited ${parsed.data.email} as ${parsed.data.role}`);
  revalidatePath("/users");
  const base = process.env.ADMIN_URL ?? "http://localhost:3100";
  return {
    ok: true,
    message: `Invitation created. Send this link to ${parsed.data.email} (valid ${INVITE_TTL_DAYS} days):`,
    link: `${base}/invite/${token}`,
  };
}

async function ownerCount() {
  const [r] = await db
    .select({ n: count() })
    .from(userTable)
    .where(and(eq(userTable.role, "owner"), eq(userTable.active, true)));
  return r?.n ?? 0;
}

export async function updateUser(
  id: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const me = await requireUser("owner");
  const target = await db.query.user.findFirst({ where: eq(userTable.id, id) });
  if (!target) return { error: "User not found." };
  const role = str(form, "role");
  const active = str(form, "active") !== "false";
  if (!(staffRoles as readonly string[]).includes(role)) return { error: "Unknown role." };
  const losesOwner = target.role === "owner" && target.active && (role !== "owner" || !active);
  if (losesOwner && (await ownerCount()) <= 1)
    return { error: "There must always be at least one active owner." };
  await db.update(userTable).set({ role, active }).where(eq(userTable.id, id));
  if (!active) await db.delete(session).where(eq(session.userId, id));
  await audit(
    me.id,
    "update",
    "user",
    id,
    `${target.email}: role ${target.role}→${role}, ${active ? "active" : "deactivated"}`,
  );
  revalidatePath("/users");
  return { ok: true, message: active ? "User updated." : "User deactivated and signed out." };
}

export async function revokeInvitation(id: string) {
  const me = await requireUser("owner");
  const [row] = await db.delete(invitation).where(eq(invitation.id, id)).returning();
  if (row) await audit(me.id, "delete", "invitation", id, `Revoked invitation for ${row.email}`);
  revalidatePath("/users");
}
