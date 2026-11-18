"use server";
import { hasRole } from "@beer/auth/roles";
import { db, lead, leadNote } from "@beer/db";
import { leadStatuses } from "@beer/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { type ActionResult, str } from "@/lib/form";
import { requireUser } from "@/lib/session";

export async function updateLead(
  id: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const status = str(form, "status");
  const assigneeId = str(form, "assigneeId") || null;
  if (!(leadStatuses as readonly string[]).includes(status)) return { error: "Unknown status" };
  const before = await db.query.lead.findFirst({ where: eq(lead.id, id) });
  if (!before) return { error: "Lead not found" };
  await db.update(lead).set({ status, assigneeId }).where(eq(lead.id, id));
  if (before.status !== status)
    await audit(user.id, "status", "lead", id, `${before.name}: ${before.status} → ${status}`);
  revalidatePath("/leads", "layout");
  return { ok: true, message: "Lead updated." };
}

export async function addNote(
  id: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const body = str(form, "body");
  if (!body) return { error: "Write something first." };
  if (body.length > 5000) return { error: "Note is too long." };
  await db.insert(leadNote).values({ leadId: id, authorId: user.id, body });
  revalidatePath(`/leads/${id}`);
  return { ok: true, message: "Note added." };
}

export async function deleteLead(id: string) {
  const user = await requireUser();
  if (!hasRole(user.role, "admin")) throw new Error("Only admins can delete leads");
  const [row] = await db.delete(lead).where(eq(lead.id, id)).returning();
  if (row) await audit(user.id, "delete", "lead", id, `Deleted lead from ${row.name}`);
  revalidatePath("/leads", "layout");
  redirect("/leads");
}
