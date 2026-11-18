import { hasRole } from "@beer/auth/roles";
import { db, service } from "@beer/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { deleteService, saveService } from "../actions";
import { ServiceForm } from "../service-form";

export default async function EditServicePage({
  params,
  searchParams,
}: PageProps<"/services/[id]">) {
  const me = await requireUser();
  const { id } = await params;
  const { created } = (await searchParams) as { created?: string };
  const s = await db.query.service.findFirst({ where: eq(service.id, id) });
  if (!s) notFound();
  const web = process.env.WEB_URL ?? "http://localhost:3000";
  return (
    <>
      <Link href="/services" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Services
      </Link>
      <PageTitle
        title={s.name.en || s.name.ckb}
        description={
          <a
            className="text-lime hover:underline"
            href={`${web}/en/services/${s.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            View on site ↗
          </a>
        }
      />
      {created && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-lime"
        >
          Service created.
        </p>
      )}
      <ServiceForm service={s} action={saveService.bind(null, s.id)} />
      {hasRole(me.role, "admin") && (
        <form
          action={deleteService.bind(null, s.id)}
          className="mt-10 max-w-3xl border-t border-line pt-6"
        >
          <SubmitButton
            variant="danger"
            size="sm"
            confirm="Delete this service? Projects will lose this tag and leads will keep no service. This cannot be undone."
          >
            Delete service
          </SubmitButton>
        </form>
      )}
    </>
  );
}
