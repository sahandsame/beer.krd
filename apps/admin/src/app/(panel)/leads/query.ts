import { db, lead, service } from "@beer/db";
import { leadStatuses } from "@beer/validators";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";

export function leadFilters(params: { status?: string; q?: string }) {
  const where: SQL[] = [];
  if (params.status && (leadStatuses as readonly string[]).includes(params.status))
    where.push(eq(lead.status, params.status));
  const q = params.q?.trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    const cond = or(
      ilike(lead.name, like),
      ilike(lead.phone, like),
      ilike(lead.email, like),
      ilike(lead.message, like),
    );
    if (cond) where.push(cond);
  }
  return where.length ? and(...where) : undefined;
}

export function selectLeads(params: { status?: string; q?: string }, limit: number, offset = 0) {
  return db
    .select({ lead, serviceName: service.name })
    .from(lead)
    .leftJoin(service, eq(service.id, lead.serviceId))
    .where(leadFilters(params))
    .orderBy(desc(lead.createdAt))
    .limit(limit)
    .offset(offset);
}
