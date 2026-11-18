/**
 * Read queries used by the public site. Everything here only returns published content.
 */
import type { LeadInput } from "@beer/validators";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { Database } from "../client";
import type { BlockDataMap, BlockKey } from "../content";
import {
  contentBlock,
  lead,
  media,
  project,
  projectMedia,
  projectService,
  service,
  teamMember,
} from "../schema";
import { seedBlocks } from "../seed-data";

export { getSiteSettings } from "../settings";

export async function getPublishedServices(db: Database) {
  return db.query.service.findMany({
    where: eq(service.published, true),
    orderBy: [asc(service.sort), asc(service.createdAt)],
  });
}

export async function getServiceBySlug(db: Database, slug: string) {
  return db.query.service.findFirst({
    where: and(eq(service.slug, slug), eq(service.published, true)),
  });
}

export type PublicProject = Awaited<ReturnType<typeof getPublishedProjects>>[number];

export async function getPublishedProjects(db: Database, opts: { featuredOnly?: boolean } = {}) {
  const rows = await db
    .select({
      project,
      coverKey: media.key,
      coverWidth: media.width,
      coverHeight: media.height,
      coverAlt: media.alt,
    })
    .from(project)
    .leftJoin(media, eq(media.id, project.coverMediaId))
    .where(
      opts.featuredOnly
        ? and(eq(project.published, true), eq(project.featured, true))
        : eq(project.published, true),
    )
    .orderBy(asc(project.sort), desc(project.createdAt));

  const ids = rows.map((r) => r.project.id);
  const links = ids.length
    ? await db
        .select({ projectId: projectService.projectId, slug: service.slug, name: service.name })
        .from(projectService)
        .innerJoin(service, eq(service.id, projectService.serviceId))
        .where(inArray(projectService.projectId, ids))
    : [];

  return rows.map((r) => ({
    ...r.project,
    cover: r.coverKey
      ? { key: r.coverKey, width: r.coverWidth, height: r.coverHeight, alt: r.coverAlt }
      : null,
    services: links
      .filter((l) => l.projectId === r.project.id)
      .map(({ slug, name }) => ({ slug, name })),
  }));
}

export async function getProjectBySlug(db: Database, slug: string) {
  const all = await getPublishedProjects(db);
  const p = all.find((x) => x.slug === slug);
  if (!p) return null;
  const gallery = await db
    .select({ key: media.key, width: media.width, height: media.height, alt: media.alt })
    .from(projectMedia)
    .innerJoin(media, eq(media.id, projectMedia.mediaId))
    .where(eq(projectMedia.projectId, p.id))
    .orderBy(asc(projectMedia.sort));
  return { ...p, gallery };
}

export async function getPublishedTeam(db: Database) {
  const rows = await db
    .select({ member: teamMember, photoKey: media.key })
    .from(teamMember)
    .leftJoin(media, eq(media.id, teamMember.photoMediaId))
    .where(eq(teamMember.published, true))
    .orderBy(asc(teamMember.sort), asc(teamMember.createdAt));
  return rows.map((r) => ({ ...r.member, photoKey: r.photoKey }));
}

/** Content blocks, falling back to the seeded copy for any block not yet saved. */
export async function getBlocks<K extends BlockKey>(
  db: Database,
  keys: K[],
): Promise<Pick<BlockDataMap, K>> {
  const rows = await db.select().from(contentBlock).where(inArray(contentBlock.key, keys));
  const out = {} as Pick<BlockDataMap, K>;
  for (const k of keys) {
    const row = rows.find((r) => r.key === k);
    out[k] = { ...seedBlocks[k], ...((row?.data as object) ?? {}) } as BlockDataMap[K];
  }
  return out;
}

/** Store a contact-form submission. Returns the lead plus the service name (for notifications). */
export async function createLead(db: Database, input: LeadInput) {
  const svc = input.serviceSlug
    ? await db.query.service.findFirst({ where: eq(service.slug, input.serviceSlug) })
    : undefined;
  const [row] = await db
    .insert(lead)
    .values({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      serviceId: svc?.id ?? null,
      budget: input.budget ?? null,
      message: input.message,
      locale: input.locale,
      sourcePage: input.sourcePage ?? null,
    })
    .returning();
  if (!row) throw new Error("Failed to create lead");
  return { lead: row, service: svc ?? null };
}
