import { contentTypeFor, readStored } from "@beer/storage";

/** Serves uploaded files from UPLOADS_DIR. Keys are random UUIDs, so responses are cached forever. */
export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  const { key } = await ctx.params;
  const file = await readStored(key.join("/"));
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": contentTypeFor(key.at(-1) ?? ""),
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
