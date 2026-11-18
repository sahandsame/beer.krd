import { hasRole } from "@beer/auth/roles";
import { db, media, teamMember } from "@beer/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { deleteTeamMember, saveTeamMember } from "../actions";
import { TeamForm } from "../team-form";

export default async function EditTeamMemberPage({ params }: PageProps<"/team/[id]">) {
  const me = await requireUser();
  const { id } = await params;
  const m = await db.query.teamMember.findFirst({ where: eq(teamMember.id, id) });
  if (!m) notFound();
  const photo = m.photoMediaId
    ? await db.query.media.findFirst({ where: eq(media.id, m.photoMediaId) })
    : null;
  return (
    <>
      <Link href="/team" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Team
      </Link>
      <PageTitle title={m.name.en || m.name.ckb} />
      <TeamForm member={m} photoKey={photo?.key} action={saveTeamMember.bind(null, m.id)} />
      {hasRole(me.role, "admin") && (
        <form
          action={deleteTeamMember.bind(null, m.id)}
          className="mt-10 max-w-2xl border-t border-line pt-6"
        >
          <SubmitButton variant="danger" size="sm" confirm="Remove this team member?">
            Remove member
          </SubmitButton>
        </form>
      )}
    </>
  );
}
