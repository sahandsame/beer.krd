"use server";
import { db, service } from "@beer/db";
import { serviceInput } from "@beer/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import {
  type ActionResult,
  bool,
  isUniqueViolation,
  localizedFromForm,
  str,
  zodErrors,
} from "@/lib/form";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

function parse(form: FormData) {
  return serviceInput.safeParse({
    slug: str(form, "slug"),
    icon: str(form, "icon") || "sparkles",
    sort: str(form, "sort") || 0,
    published: bool(form, "published"),
    name: localizedFromForm(form, "name"),
    summary: localizedFromForm(form, "summary"),
    body: localizedFromForm(form, "body"),
    deliverables: localizedFromForm(form, "deliverables"),
  });
}

export async function saveService(
  id: string | null,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser("editor");
  const parsed = parse(form);
  if (!parsed.success) return zodErrors(parsed.error);
  let savedId = id;
  try {
    if (id) {
      await db.update(service).set(parsed.data).where(eq(service.id, id));
      await audit(user.id, "update", "service", id, `Updated service ${parsed.data.slug}`);
    } else {
      const [row] = await db.insert(service).values(parsed.data).returning({ id: service.id });
      savedId = row?.id ?? null;
      await audit(user.id, "create", "service", savedId, `Created service ${parsed.data.slug}`);
    }
  } catch (e) {
    if (isUniqueViolation(e))
      return {
        error: "That slug is already used by another service.",
        fieldErrors: { slug: "Already in use" },
      };
    throw e;
  }
  await revalidateWeb(["services", "projects"]);
  revalidatePath("/services");
  if (!id) redirect(`/services/${savedId}?created=1`);
  return { ok: true, message: "Service saved. The website has been updated." };
}

export async function deleteService(id: string) {
  const user = await requireUser("admin");
  const [row] = await db.delete(service).where(eq(service.id, id)).returning();
  if (row) await audit(user.id, "delete", "service", id, `Deleted service ${row.slug}`);
  await revalidateWeb(["services", "projects"]);
  revalidatePath("/services");
  redirect("/services");
}
