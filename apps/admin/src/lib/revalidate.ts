import "server-only";

export type WebTag = "services" | "projects" | "team" | "content" | "settings";

/** Tell the public site to drop cached data so edits show up immediately. Never throws. */
export async function revalidateWeb(tags: WebTag[]): Promise<boolean> {
  // Inside Docker the admin reaches the web container directly (INTERNAL_WEB_URL=http://web:3000).
  const base = process.env.INTERNAL_WEB_URL ?? process.env.WEB_URL ?? "http://localhost:3000";
  const url = `${base.replace(/\/+$/, "")}/api/revalidate`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.REVALIDATE_SECRET ?? ""}`,
      },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) console.error("[revalidate] web responded", res.status);
    return res.ok;
  } catch (e) {
    console.error("[revalidate] failed", e);
    return false;
  }
}
