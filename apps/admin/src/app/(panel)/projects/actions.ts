"use server";
import { db, project, projectMedia, projectService } from "@beer/db";
import { projectInput } from "@beer/validators";
import { and, eq, inArray, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import {
  type ActionResult,
  bool,
  files,
  isUniqueViolation,
  localizedFromForm,
  str,
  zodErrors,
} from "@/lib/form";
import { saveUpload, uploadErrorMessage } from "@/lib/media";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

export async function saveProject(
  id: string | null,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser("editor");
  const year = str(form, "year");
  const parsed = projectInput.safeParse({
    slug: str(form, "slug"),
    client: str(form, "client"),
    year: year ? year : null,
    featured: bool(form, "featured"),
    published: bool(form, "published"),
    sort: str(form, "sort") || 0,
    title: localizedFromForm(form, "title"),
    summary: localizedFromForm(form, "summary"),
    challenge: localizedFromForm(form, "challenge"),
    approach: localizedFromForm(form, "approach"),
    results: localizedFromForm(form, "results"),
    serviceIds: form.getAll("serviceIds").map(String),
    videoUrls: str(form, "videoUrls").split(/\s+/).filter(Boolean),
  });
  if (!parsed.success) return zodErrors(parsed.error);
  const { serviceIds, ...data } = parsed.data;

  // Upload images first so a bad file doesn't leave a half-saved project.
  let coverMediaId: string | undefined;
  const galleryIds: string[] = [];
  try {
    const cover = files(form, "cover")[0];
    if (cover) coverMediaId = (await saveUpload(cover, user.id)).id;
    for (const f of files(form, "gallery")) galleryIds.push((await saveUpload(f, user.id)).id);
  } catch (e) {
    const msg = uploadErrorMessage(e);
    if (msg) return { error: `Upload failed: ${msg}` };
    throw e;
  }

  let projectId = id;
  try {
    await db.transaction(async (tx) => {
      const values = {
        ...data,
        ...(coverMediaId ? { coverMediaId } : {}),
        ...(bool(form, "removeCover") && !coverMediaId ? { coverMediaId: null } : {}),
      };
      if (id) {
        await tx.update(project).set(values).where(eq(project.id, id));
      } else {
        const [row] = await tx.insert(project).values(values).returning({ id: project.id });
        projectId = row!.id;
      }
      const pid = projectId!;
      await tx.delete(projectService).where(eq(projectService.projectId, pid));
      if (serviceIds.length)
        await tx
          .insert(projectService)
          .values(serviceIds.map((serviceId) => ({ projectId: pid, serviceId })));

      const remove = form.getAll("removeGallery").map(String);
      if (remove.length)
        await tx
          .delete(projectMedia)
          .where(and(eq(projectMedia.projectId, pid), inArray(projectMedia.mediaId, remove)));
      if (galleryIds.length) {
        const [{ m } = { m: 0 }] = await tx
          .select({ m: max(projectMedia.sort) })
          .from(projectMedia)
          .where(eq(projectMedia.projectId, pid));
        await tx
          .insert(projectMedia)
          .values(
            galleryIds.map((mediaId, i) => ({ projectId: pid, mediaId, sort: (m ?? 0) + i + 1 })),
          );
      }
    });
  } catch (e) {
    if (isUniqueViolation(e))
      return {
        error: "That slug is already used by another project.",
        fieldErrors: { slug: "Already in use" },
      };
    throw e;
  }
  await audit(
    user.id,
    id ? "update" : "create",
    "project",
    projectId,
    `${id ? "Updated" : "Created"} project ${data.slug}`,
  );
  await revalidateWeb(["projects"]);
  revalidatePath("/projects");
  if (!id) redirect(`/projects/${projectId}?created=1`);
  revalidatePath(`/projects/${id}`);
  return { ok: true, message: "Project saved." };
}

export async function deleteProject(id: string) {
  const user = await requireUser("admin");
  const [row] = await db.delete(project).where(eq(project.id, id)).returning();
  if (row) await audit(user.id, "delete", "project", id, `Deleted project ${row.slug}`);
  await revalidateWeb(["projects"]);
  revalidatePath("/projects");
  redirect("/projects");
}
