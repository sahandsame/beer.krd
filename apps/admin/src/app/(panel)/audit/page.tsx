import { auditLog, db, user as userTable } from "@beer/db";
import { desc, eq } from "drizzle-orm";
import { EmptyState, formatDate, PageTitle, Table } from "@/components/ui";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Audit log" };

export default async function AuditPage() {
  await requireUser("admin");
  const rows = await db
    .select({ log: auditLog, who: userTable.name })
    .from(auditLog)
    .leftJoin(userTable, eq(userTable.id, auditLog.userId))
    .orderBy(desc(auditLog.createdAt))
    .limit(300);
  return (
    <>
      <PageTitle title="Audit log" description="The last 300 changes made in the admin." />
      {rows.length === 0 ? (
        <EmptyState>Nothing yet.</EmptyState>
      ) : (
        <Table head={["When", "Who", "Action", "What"]}>
          {rows.map(({ log, who }) => (
            <tr key={log.id}>
              <td className="px-4 py-3 whitespace-nowrap text-mist">{formatDate(log.createdAt)}</td>
              <td className="px-4 py-3">{who ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs">
                {log.action} · {log.entity}
              </td>
              <td className="px-4 py-3">{log.summary}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
