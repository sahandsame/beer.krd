"use server";
import { db, media, project, projectMedia, teamMember } from "@beer/db";
import { deleteStored } from "@beer/storage";
import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { type ActionResult, files, localizedFromForm } from "@/lib/form";
import { saveUpload, uploadErrorMessage } from "@/lib/media";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

export async function uploadMedia(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireUser("editor");
  const list = files(form, "files");
  if (!list.length) return { error: "Choose at least one image." };
  try {
    for (const f of list) await saveUpload(f, user.id);
  } catch (e) {
    const msg = uploadErrorMessage(e);
    if (msg) return { error: `Upload failed: ${msg}` };
    throw e;
  }
  await audit(user.id, "create", "media", null, `Uploaded ${list.length} file(s)`);
  revalidatePath("/media");
  return { ok: true, message: `Uploaded ${list.length} image${list.length > 1 ? "s" : ""}.` };
}

export async function updateAlt(
  id: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  await requireUser("editor");
  await db
    .update(media)
    .set({ alt: localizedFromForm(form, "alt") })
    .where(eq(media.id, id));
  await revalidateWeb(["projects", "team"]);
  revalidatePath("/media");
  return { ok: true, message: "Alt text saved." };
}

async function usageCount(id: string) {
  const [[a], [b], [c]] = await Promise.all([
    db.select({ n: count() }).from(project).where(eq(project.coverMediaId, id)),
    db.select({ n: count() }).from(projectMedia).where(eq(projectMedia.mediaId, id)),
    db.select({ n: count() }).from(teamMember).where(eq(teamMember.photoMediaId, id)),
  ]);
  return (a?.n ?? 0) + (b?.n ?? 0) + (c?.n ?? 0);
}

export async function deleteMedia(
  id: string,
  _prev: ActionResult,
  _form: FormData,
): Promise<ActionResult> {
  const user = await requireUser("editor");
  if ((await usageCount(id)) > 0)
    return {
      error: "This image is still used by a project or team member. Remove it there first.",
    };
  const [row] = await db.delete(media).where(eq(media.id, id)).returning();
  if (row) {
    await deleteStored(row.key);
    await audit(user.id, "delete", "media", id, `Deleted ${row.originalName || row.key}`);
  }
  revalidatePath("/media");
  return { ok: true, message: "Deleted." };
}
