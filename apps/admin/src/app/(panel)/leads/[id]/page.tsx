import { hasRole } from "@beer/auth/roles";
import { db, lead, leadNote, service, user as userTable } from "@beer/db";
import { pick } from "@beer/i18n";
import { Card } from "@beer/ui/components/card";
import { Field, Select, Textarea } from "@beer/ui/components/form";
import { leadStatuses } from "@beer/validators";
import { asc, eq } from "drizzle-orm";
import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { formatDate, PageTitle, StatusBadge } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { addNote, deleteLead, updateLead } from "./actions";

const budgetLabels: Record<string, string> = {
  lt500: "Under $500",
  "500-2000": "$500 – $2,000",
  "2000-5000": "$2,000 – $5,000",
  gt5000: "Over $5,000",
  unsure: "Not sure yet",
};

export default async function LeadPage({ params }: PageProps<"/leads/[id]">) {
  const me = await requireUser();
  const { id } = await params;
  const l = await db.query.lead.findFirst({ where: eq(lead.id, id) });
  if (!l) notFound();
  const [svc, notes, staff] = await Promise.all([
    l.serviceId ? db.query.service.findFirst({ where: eq(service.id, l.serviceId) }) : null,
    db
      .select({ note: leadNote, author: userTable.name })
      .from(leadNote)
      .leftJoin(userTable, eq(userTable.id, leadNote.authorId))
      .where(eq(leadNote.leadId, id))
      .orderBy(asc(leadNote.createdAt)),
    db
      .select({ id: userTable.id, name: userTable.name })
      .from(userTable)
      .where(eq(userTable.active, true)),
  ]);
  const wa = l.phone.replace(/[^\d]/g, "").replace(/^0/, "964");

  return (
    <>
      <Link href="/leads" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← All leads
      </Link>
      <PageTitle
        title={l.name}
        description={
          <>
            Received {formatDate(l.createdAt)} · <StatusBadge status={l.status} />
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Phone</dt>
                <dd className="mt-1 font-mono" dir="ltr">
                  {l.phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Email</dt>
                <dd className="mt-1">{l.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Service</dt>
                <dd className="mt-1">{svc ? pick(svc.name, "en") : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Budget</dt>
                <dd className="mt-1">{l.budget ? (budgetLabels[l.budget] ?? l.budget) : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Language</dt>
                <dd className="mt-1 font-mono uppercase">{l.locale}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-mist">Page</dt>
                <dd className="mt-1 font-mono text-xs">{l.sourcePage ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-line pt-6">
              <p className="text-xs uppercase tracking-wider text-mist">Message</p>
              <p dir="auto" className="mt-2 whitespace-pre-wrap leading-relaxed">
                {l.message}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <a
                href={`tel:${l.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 hover:border-lime hover:text-lime"
              >
                <Phone className="size-4" /> Call
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 hover:border-lime hover:text-lime"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              {l.email && (
                <a
                  href={`mailto:${l.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 hover:border-lime hover:text-lime"
                >
                  <Mail className="size-4" /> Email
                </a>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 font-semibold">Notes</h2>
            {notes.length > 0 && (
              <ul className="mb-6 flex flex-col gap-4">
                {notes.map(({ note, author }) => (
                  <li key={note.id} className="rounded-xl bg-forest/60 p-4">
                    <p className="whitespace-pre-wrap text-sm" dir="auto">
                      {note.body}
                    </p>
                    <p className="mt-2 text-xs text-mist">
                      {author ?? "Deleted user"} · {formatDate(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <ActionForm action={addNote.bind(null, l.id)} resetOnSuccess>
              <Textarea
                name="body"
                rows={3}
                placeholder="Called, sent proposal, follow up Monday…"
                aria-label="New note"
              />
              <div>
                <SubmitButton size="sm">Add note</SubmitButton>
              </div>
            </ActionForm>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <ActionForm action={updateLead.bind(null, l.id)}>
              <Field id="status" label="Status">
                <Select id="status" name="status" defaultValue={l.status}>
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s[0]?.toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="assigneeId" label="Assigned to">
                <Select id="assigneeId" name="assigneeId" defaultValue={l.assigneeId ?? ""}>
                  <option value="">Nobody</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <div>
                <SubmitButton>Save</SubmitButton>
              </div>
            </ActionForm>
          </Card>
          {hasRole(me.role, "admin") && (
            <form action={deleteLead.bind(null, l.id)}>
              <SubmitButton
                variant="danger"
                size="sm"
                confirm="Delete this lead permanently? This cannot be undone."
              >
                Delete lead
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
