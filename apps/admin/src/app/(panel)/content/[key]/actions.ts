"use server";
import { contentBlock, db, getBlockDef } from "@beer/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { blockFromForm } from "@/lib/blocks";
import type { ActionResult } from "@/lib/form";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

export async function saveBlock(
  key: string,
  _prev: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const user = await requireUser("editor");
  const def = getBlockDef(key);
  if (!def) return { error: "Unknown content block" };
  const data = blockFromForm(def, form);
  await db
    .insert(contentBlock)
    .values({ key, data, updatedById: user.id })
    .onConflictDoUpdate({
      target: contentBlock.key,
      set: { data, updatedById: user.id, updatedAt: new Date() },
    });
  await audit(user.id, "update", "content", key, `Edited ${def.page} › ${def.label}`);
  await revalidateWeb(["content"]);
  revalidatePath("/content", "layout");
  return { ok: true, message: "Saved. The website has been updated." };
}
