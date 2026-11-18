import { toCsv } from "@/lib/csv";
import { getCurrentUser } from "@/lib/session";
import { selectLeads } from "../query";

export async function GET(req: Request) {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  const url = new URL(req.url);
  const rows = await selectLeads(
    {
      status: url.searchParams.get("status") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
    },
    10_000,
  );
  const csv = toCsv(
    rows.map(({ lead: l, serviceName }) => ({ ...l, service: serviceName?.en ?? "" })),
    [
      "createdAt",
      "name",
      "phone",
      "email",
      "service",
      "budget",
      "locale",
      "status",
      "message",
      "sourcePage",
    ],
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="beer-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
