import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { saveTeamMember } from "../actions";
import { TeamForm } from "../team-form";

export const metadata = { title: "Add team member" };

export default async function NewTeamMemberPage() {
  await requireUser();
  return (
    <>
      <Link href="/team" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Team
      </Link>
      <PageTitle title="Add team member" />
      <TeamForm action={saveTeamMember.bind(null, null)} />
    </>
  );
}
