import { db, getSiteSettings, media, project } from "@beer/db";
import { asc, desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState, LinkButton, PageTitle, PublishedBadge } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Portfolio" };

export default async function ProjectsPage() {
  await requireUser();
  const [rows, settings] = await Promise.all([
    db
      .select({ project, coverKey: media.key })
      .from(project)
      .leftJoin(media, eq(media.id, project.coverMediaId))
      .orderBy(asc(project.sort), desc(project.createdAt)),
    getSiteSettings(db),
  ]);
  return (
    <>
      <PageTitle
        title="Portfolio"
        description={
          settings.workSectionEnabled ? (
            "The Work section is live on the website."
          ) : (
            <>
              The Work section is <strong className="text-warning">hidden</strong> on the website.
              Turn it on in{" "}
              <Link href="/settings" className="text-lime underline">
                Settings
              </Link>{" "}
              when you're ready.
            </>
          )
        }
        actions={
          <LinkButton href="/projects/new">
            <Plus className="size-4" /> New project
          </LinkButton>
        }
      />
      {rows.length === 0 ? (
        <EmptyState>No projects yet. Add your first case study.</EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map(({ project: p, coverKey }) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/60 hover:border-lime/50"
              >
                <div className="aspect-video bg-forest">
                  {coverKey && (
                    // biome-ignore lint/performance/noImgElement: admin preview
                    <img src={mediaUrl(coverKey) ?? ""} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium group-hover:text-lime">
                      {p.title.en || p.title.ckb}
                    </p>
                    <p className="truncate text-xs text-mist">
                      {p.client || "—"} · {p.year ?? ""}
                    </p>
                  </div>
                  <PublishedBadge published={p.published} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
