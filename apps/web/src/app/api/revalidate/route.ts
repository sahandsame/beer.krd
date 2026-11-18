import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { type CacheTag, cacheTags } from "@/lib/data";

function authorized(header: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !header?.startsWith("Bearer ")) return false;
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the admin after saving content: POST { tags: ["services", ...] }. */
export async function POST(req: Request) {
  if (!authorized(req.headers.get("authorization"))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is CacheTag => (cacheTags as readonly string[]).includes(t as string))
    : [];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
