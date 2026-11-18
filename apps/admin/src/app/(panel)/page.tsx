import { blockDefs, contentBlock, db, lead, project, service, teamMember } from "@beer/db";
import { type Localized, missingLocales } from "@beer/i18n";
import { Card } from "@beer/ui/components/card";
import { count, desc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import { formatDate, PageTitle, StatusBadge } from "@/components/ui";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Dashboard" };

function collectMissing(label: string, href: string, fields: Record<string, unknown>) {
  const missing = new Set<string>();
  for (const v of Object.values(fields)) {
    if (v && typeof v === "object" && "ckb" in v)
      for (const l of missingLocales(v as Localized)) missing.add(l);
  }
  return missing.size ? [{ label, href, missing: [...missing] }] : [];
}

function walkBlock(data: unknown, out: Set<string>) {
  if (Array.isArray(data)) for (const d of data) walkBlock(d, out);
  else if (data && typeof data === "object") {
    if ("ckb" in data && "en" in data)
      for (const l of missingLocales(data as Localized)) out.add(l);
    else for (const v of Object.values(data)) walkBlock(v, out);
  }
}

export default async function Dashboard() {
  const user = await requireUser();
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const [[newCount], [weekCount], [totalCount], recent, services, projects, team, blocks] =
    await Promise.all([
      db.select({ n: count() }).from(lead).where(eq(lead.status, "new")),
      db.select({ n: count() }).from(lead).where(gte(lead.createdAt, weekAgo)),
      db.select({ n: count() }).from(lead),
      db.select().from(lead).orderBy(desc(lead.createdAt)).limit(6),
      db.select().from(service),
      db.select().from(project),
      db.select().from(teamMember),
      db.select().from(contentBlock),
    ]);

  const missing = [
    ...services.flatMap((s) =>
      collectMissing(`Service: ${s.name.en || s.slug}`, `/services/${s.id}`, s),
    ),
    ...projects.flatMap((p) =>
      collectMissing(`Project: ${p.title.en || p.slug}`, `/projects/${p.id}`, p),
    ),
    ...team.flatMap((m) => collectMissing(`Team: ${m.name.en || m.name.ckb}`, `/team/${m.id}`, m)),
    ...blocks.flatMap((b) => {
      const out = new Set<string>();
      walkBlock(b.data, out);
      const def = blockDefs.find((d) => d.key === b.key);
      return out.size
        ? [
            {
              label: `Content: ${def ? `${def.page} › ${def.label}` : b.key}`,
              href: `/content/${b.key}`,
              missing: [...out],
            },
          ]
        : [];
    }),
  ];

  const stats = [
    { label: "New leads", value: newCount?.n ?? 0, href: "/leads?status=new" },
    { label: "Leads this week", value: weekCount?.n ?? 0, href: "/leads" },
    { label: "All leads", value: totalCount?.n ?? 0, href: "/leads" },
    {
      label: "Published projects",
      value: projects.filter((p) => p.published).length,
      href: "/projects",
    },
  ];

  return (
    <>
      <PageTitle
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Here's what's happening on beer.krd."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line bg-surface/70 p-5 transition-colors hover:border-lime/50"
          >
            <p className="text-sm text-mist">{s.label}</p>
            <p className="mt-2 font-mono text-4xl font-semibold text-lime">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent leads</h2>
            <Link href="/leads" className="text-sm text-lime hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-mist">
              No leads yet. They'll appear here when someone sends the contact form.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/leads/${l.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:text-lime"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{l.name}</span>
                      <span className="block truncate text-xs text-mist">
                        {formatDate(l.createdAt)} · {l.phone}
                      </span>
                    </span>
                    <StatusBadge status={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Missing translations</h2>
          {missing.length === 0 ? (
            <p className="text-sm text-mist">Everything is translated into ckb, en and ar. 🎉</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {missing.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    className="flex items-center justify-between gap-3 hover:text-lime"
                  >
                    <span className="truncate">{m.label}</span>
                    <span className="shrink-0 font-mono text-xs uppercase text-warning">
                      {m.missing.join(" ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
