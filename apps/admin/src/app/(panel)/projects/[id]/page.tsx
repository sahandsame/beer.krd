import { hasRole } from "@beer/auth/roles";
import { db, media, project, projectMedia, projectService, service } from "@beer/db";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { deleteProject, saveProject } from "../actions";
import { ProjectForm } from "../project-form";

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<"/projects/[id]">) {
  const me = await requireUser();
  const { id } = await params;
  const { created } = (await searchParams) as { created?: string };
  const p = await db.query.project.findFirst({ where: eq(project.id, id) });
  if (!p) notFound();
  const [services, links, gallery, cover] = await Promise.all([
    db.select().from(service).orderBy(asc(service.sort)),
    db.select().from(projectService).where(eq(projectService.projectId, id)),
    db
      .select({ id: media.id, key: media.key })
      .from(projectMedia)
      .innerJoin(media, eq(media.id, projectMedia.mediaId))
      .where(eq(projectMedia.projectId, id))
      .orderBy(asc(projectMedia.sort)),
    p.coverMediaId ? db.query.media.findFirst({ where: eq(media.id, p.coverMediaId) }) : null,
  ]);
  return (
    <>
      <Link href="/projects" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Portfolio
      </Link>
      <PageTitle title={p.title.en || p.title.ckb} />
      {created && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-lime"
        >
          Project created.
        </p>
      )}
      <ProjectForm
        project={p}
        services={services}
        selectedServiceIds={links.map((l) => l.serviceId)}
        cover={cover}
        gallery={gallery}
        action={saveProject.bind(null, p.id)}
      />
      {hasRole(me.role, "admin") && (
        <form
          action={deleteProject.bind(null, p.id)}
          className="mt-10 max-w-3xl border-t border-line pt-6"
        >
          <SubmitButton
            variant="danger"
            size="sm"
            confirm="Delete this project? Its images stay in the media library. This cannot be undone."
          >
            Delete project
          </SubmitButton>
        </form>
      )}
    </>
  );
}
