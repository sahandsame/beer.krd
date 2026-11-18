import { db, service } from "@beer/db";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { LinkButton, PageTitle, PublishedBadge, Table } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { ServiceIconPreview } from "./icon-preview";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  await requireUser();
  const rows = await db.select().from(service).orderBy(asc(service.sort), asc(service.createdAt));
  return (
    <>
      <PageTitle
        title="Services"
        description="What Beer Agency offers. Shown on the home page, the services page and the contact form."
        actions={
          <LinkButton href="/services/new">
            <Plus className="size-4" /> New service
          </LinkButton>
        }
      />
      <Table head={["", "Name", "Slug", "Order", "Status"]}>
        {rows.map((s) => (
          <tr key={s.id} className="hover:bg-white/[0.03]">
            <td className="w-12 px-4 py-3 text-lime">
              <ServiceIconPreview name={s.icon} />
            </td>
            <td className="px-4 py-3">
              <Link href={`/services/${s.id}`} className="font-medium hover:text-lime">
                {s.name.en || s.name.ckb}
              </Link>
              <p className="text-xs text-mist" dir="rtl" lang="ckb">
                {s.name.ckb}
              </p>
            </td>
            <td className="px-4 py-3 font-mono text-xs">{s.slug}</td>
            <td className="px-4 py-3 font-mono text-xs">{s.sort}</td>
            <td className="px-4 py-3">
              <PublishedBadge published={s.published} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
