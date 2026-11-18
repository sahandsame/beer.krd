/** Public URL of an uploaded file. Safe to import from client components. */
export function mediaUrl(
  key: string | null | undefined,
  base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? process.env.MEDIA_BASE_URL ?? "/media",
): string | null {
  if (!key) return null;
  return `${base.replace(/\/+$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
}
