"use server";
import { createCredentialUser, db, invitation } from "@beer/db";
import { acceptInvitationInput } from "@beer/validators";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { type ActionResult, str, zodErrors } from "@/lib/form";
import { findValidInvitation } from "@/lib/invitations";

export async function acceptInvitation(
  token: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const invite = await findValidInvitation(token);
  if (!invite) return { error: "This invitation has expired or was already used." };
  const parsed = acceptInvitationInput.safeParse({
    name: str(form, "name"),
    password: String(form.get("password") ?? ""),
    confirm: String(form.get("confirm") ?? ""),
  });
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    const u = await createCredentialUser(db, {
      email: invite.email,
      name: parsed.data.name,
      password: parsed.data.password,
      role: invite.role,
    });
    await db.update(invitation).set({ acceptedAt: new Date() }).where(eq(invitation.id, invite.id));
    await audit(
      u.id,
      "create",
      "user",
      u.id,
      `${u.email} accepted an invitation as ${invite.role}`,
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create the account." };
  }
  redirect("/login?welcome=1");
}
