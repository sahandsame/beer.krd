import { db, service } from "@beer/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { saveProject } from "../actions";
import { ProjectForm } from "../project-form";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireUser();
  const services = await db.select().from(service).orderBy(asc(service.sort));
  return (
    <>
      <Link href="/projects" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Portfolio
      </Link>
      <PageTitle title="New project" />
      <ProjectForm services={services} action={saveProject.bind(null, null)} />
    </>
  );
}
