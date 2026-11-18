import { db, media, teamMember } from "@beer/db";
import { asc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState, LinkButton, PageTitle, PublishedBadge } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  await requireUser();
  const rows = await db
    .select({ m: teamMember, photoKey: media.key })
    .from(teamMember)
    .leftJoin(media, eq(media.id, teamMember.photoMediaId))
    .orderBy(asc(teamMember.sort));
  return (
    <>
      <PageTitle
        title="Team"
        description="Shown on the About page when at least one member is published."
        actions={
          <LinkButton href="/team/new">
            <Plus className="size-4" /> Add member
          </LinkButton>
        }
      />
      {rows.length === 0 ? (
        <EmptyState>No team members yet.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map(({ m, photoKey }) => (
            <li key={m.id}>
              <Link
                href={`/team/${m.id}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface/60 p-4 hover:border-lime/50"
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-full bg-forest">
                  {photoKey && (
                    // biome-ignore lint/performance/noImgElement: admin preview
                    <img src={mediaUrl(photoKey) ?? ""} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name.en || m.name.ckb}</p>
                  <p className="truncate text-xs text-mist">{m.role.en || m.role.ckb}</p>
                </div>
                <PublishedBadge published={m.published} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
