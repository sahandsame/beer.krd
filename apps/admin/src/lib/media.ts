import "server-only";
import { db, media } from "@beer/db";
import { storeImage, UploadError } from "@beer/storage";

export { mediaUrl } from "@beer/storage/url";

/** Store an uploaded image (resized to WebP) and record it in the media library. */
export async function saveUpload(
  file: File,
  userId: string,
  alt?: { ckb: string; en: string; ar: string },
) {
  const stored = await storeImage(file);
  const [row] = await db
    .insert(media)
    .values({
      ...stored,
      originalName: file.name.slice(0, 200),
      createdById: userId,
      ...(alt ? { alt } : {}),
    })
    .returning();
  if (!row) throw new Error("Failed to save media");
  return row;
}

export function uploadErrorMessage(e: unknown): string | null {
  return e instanceof UploadError ? e.message : null;
}
