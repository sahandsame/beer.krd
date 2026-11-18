import { db, lead } from "@beer/db";
import { buttonClasses } from "@beer/ui/components/button";
import { Input, Select } from "@beer/ui/components/form";
import { leadStatuses } from "@beer/validators";
import { count } from "drizzle-orm";
import { Download } from "lucide-react";
import Link from "next/link";
import { EmptyState, formatDate, PageTitle, StatusBadge, Table } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { leadFilters, selectLeads } from "./query";

export const metadata = { title: "Leads" };
const PAGE = 50;

export default async function LeadsPage({ searchParams }: PageProps<"/leads">) {
  await requireUser();
  const sp = (await searchParams) as { status?: string; q?: string; page?: string };
  const page = Math.max(1, Number(sp.page) || 1);
  const [rows, [total]] = await Promise.all([
    selectLeads(sp, PAGE, (page - 1) * PAGE),
    db.select({ n: count() }).from(lead).where(leadFilters(sp)),
  ]);
  const pages = Math.max(1, Math.ceil((total?.n ?? 0) / PAGE));
  const qs = (p: number) =>
    `?${new URLSearchParams({ ...(sp.status ? { status: sp.status } : {}), ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`;
  const exportQs = new URLSearchParams({
    ...(sp.status ? { status: sp.status } : {}),
    ...(sp.q ? { q: sp.q } : {}),
  });

  return (
    <>
      <PageTitle
        title="Leads"
        description="Contact form submissions from beer.krd."
        actions={
          <a
            href={`/leads/export?${exportQs}`}
            className={buttonClasses({ variant: "outline", size: "sm" })}
          >
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      <form className="mb-6 flex flex-wrap gap-3" aria-label="Filter leads">
        <Input
          name="q"
          defaultValue={sp.q}
          placeholder="Search name, phone, email, message…"
          className="max-w-sm"
          aria-label="Search leads"
        />
        <Select name="status" defaultValue={sp.status ?? ""} className="w-44" aria-label="Status">
          <option value="">All statuses</option>
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {s[0]?.toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
        <button type="submit" className={buttonClasses({ variant: "outline" })}>
          Filter
        </button>
      </form>
      {rows.length === 0 ? (
        <EmptyState>No leads match.</EmptyState>
      ) : (
        <Table head={["Name", "Phone", "Service", "Lang", "Received", "Status"]}>
          {rows.map(({ lead: l, serviceName }) => (
            <tr key={l.id} className="hover:bg-white/[0.03]">
              <td className="px-4 py-3">
                <Link href={`/leads/${l.id}`} className="font-medium hover:text-lime">
                  {l.name}
                </Link>
                <p className="max-w-xs truncate text-xs text-mist">{l.message}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs" dir="ltr">
                {l.phone}
              </td>
              <td className="px-4 py-3">{serviceName?.en ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs uppercase">{l.locale}</td>
              <td className="px-4 py-3 whitespace-nowrap text-mist">{formatDate(l.createdAt)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={l.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}
      {pages > 1 && (
        <nav className="mt-6 flex items-center gap-3 text-sm" aria-label="Pagination">
          {page > 1 && (
            <Link className="text-lime" href={qs(page - 1)}>
              ← Previous
            </Link>
          )}
          <span className="text-mist">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link className="text-lime" href={qs(page + 1)}>
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
