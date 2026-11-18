import "server-only";
import { auditLog, db } from "@beer/db";

export async function audit(
  userId: string,
  action: "create" | "update" | "delete" | "invite" | "login" | "status",
  entity: string,
  entityId: string | null,
  summary: string,
  diff?: unknown,
) {
  try {
    await db
      .insert(auditLog)
      .values({ userId, action, entity, entityId, summary, diff: diff ?? null });
  } catch (e) {
    console.error("[audit] failed", e);
  }
}
