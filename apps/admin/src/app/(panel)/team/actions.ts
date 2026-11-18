"use server";
import { db, teamMember } from "@beer/db";
import { teamMemberInput } from "@beer/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { type ActionResult, bool, files, localizedFromForm, str, zodErrors } from "@/lib/form";
import { saveUpload, uploadErrorMessage } from "@/lib/media";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

export async function saveTeamMember(
  id: string | null,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser("editor");
  const parsed = teamMemberInput.safeParse({
    sort: str(form, "sort") || 0,
    published: bool(form, "published"),
    name: localizedFromForm(form, "name"),
    role: localizedFromForm(form, "role"),
  });
  if (!parsed.success) return zodErrors(parsed.error);
  let photoMediaId: string | null | undefined;
  try {
    const photo = files(form, "photo")[0];
    if (photo) photoMediaId = (await saveUpload(photo, user.id)).id;
    else if (bool(form, "removePhoto")) photoMediaId = null;
  } catch (e) {
    const msg = uploadErrorMessage(e);
    if (msg) return { error: `Upload failed: ${msg}` };
    throw e;
  }
  const values = { ...parsed.data, ...(photoMediaId !== undefined ? { photoMediaId } : {}) };
  let savedId = id;
  if (id) await db.update(teamMember).set(values).where(eq(teamMember.id, id));
  else
    savedId =
      (await db.insert(teamMember).values(values).returning({ id: teamMember.id }))[0]?.id ?? null;
  await audit(
    user.id,
    id ? "update" : "create",
    "team",
    savedId,
    `${id ? "Updated" : "Added"} team member ${parsed.data.name.en || parsed.data.name.ckb}`,
  );
  await revalidateWeb(["team"]);
  revalidatePath("/team");
  if (!id) redirect("/team");
  return { ok: true, message: "Saved." };
}

export async function deleteTeamMember(id: string) {
  const user = await requireUser("admin");
  const [row] = await db.delete(teamMember).where(eq(teamMember.id, id)).returning();
  if (row)
    await audit(
      user.id,
      "delete",
      "team",
      id,
      `Removed team member ${row.name.en || row.name.ckb}`,
    );
  await revalidateWeb(["team"]);
  revalidatePath("/team");
  redirect("/team");
}
