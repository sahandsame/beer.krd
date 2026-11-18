/**
 * Cached reads for the public site. The admin calls /api/revalidate with these tags
 * after every save, so edits show up immediately while normal traffic never waits on the DB.
 */

import type { BlockKey } from "@beer/db";
import { db } from "@beer/db";
import {
  getBlocks as dbGetBlocks,
  getProjectBySlug as dbGetProject,
  getServiceBySlug as dbGetService,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTeam,
  getSiteSettings,
} from "@beer/db/queries";
import { unstable_cache } from "next/cache";

export const cacheTags = ["services", "projects", "team", "content", "settings"] as const;
export type CacheTag = (typeof cacheTags)[number];

const HOUR = 3600;

export const getServices = unstable_cache(() => getPublishedServices(db), ["services"], {
  tags: ["services"],
  revalidate: HOUR,
});

export const getService = unstable_cache((slug: string) => dbGetService(db, slug), ["service"], {
  tags: ["services"],
  revalidate: HOUR,
});

export const getProjects = unstable_cache(
  (featuredOnly: boolean) => getPublishedProjects(db, { featuredOnly }),
  ["projects"],
  { tags: ["projects", "services"], revalidate: HOUR },
);

export const getProject = unstable_cache((slug: string) => dbGetProject(db, slug), ["project"], {
  tags: ["projects", "services"],
  revalidate: HOUR,
});

export const getTeam = unstable_cache(() => getPublishedTeam(db), ["team"], {
  tags: ["team"],
  revalidate: HOUR,
});

export const getSettings = unstable_cache(() => getSiteSettings(db), ["settings"], {
  tags: ["settings"],
  revalidate: HOUR,
});

export const getBlocks = unstable_cache(
  <K extends BlockKey>(keys: K[]) => dbGetBlocks(db, keys),
  ["blocks"],
  { tags: ["content"], revalidate: HOUR },
) as <K extends BlockKey>(keys: K[]) => ReturnType<typeof dbGetBlocks<K>>;
