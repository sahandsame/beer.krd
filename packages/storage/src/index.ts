/**
 * File storage for uploads. Files live in UPLOADS_DIR (a Docker volume in production,
 * shared by the admin which writes and the web app which serves them under /media).
 */
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export { mediaUrl } from "./url";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_DIMENSION = 2400;

export function uploadsDir(): string {
  return path.resolve(process.env.UPLOADS_DIR ?? "./.data/uploads");
}

/** Resolve a storage key to an absolute path, refusing anything that escapes UPLOADS_DIR. */
export function resolveKey(key: string, root = uploadsDir()): string | null {
  if (!key || key.includes("\0")) return null;
  const full = path.resolve(root, key);
  const rel = path.relative(root, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return full;
}

export type StoredFile = {
  key: string;
  mime: string;
  width: number | null;
  height: number | null;
  size: number;
};

export class UploadError extends Error {}

/**
 * Validate an uploaded image, re-encode it as WebP (max 2400px on the long side, EXIF stripped)
 * and write it under `YYYY/MM/<uuid>.webp`.
 */
export async function storeImage(file: File, root = uploadsDir()): Promise<StoredFile> {
  if (!IMAGE_TYPES.has(file.type))
    throw new UploadError(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("File is larger than 15 MB");

  const input = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  let info: { width: number; height: number };
  try {
    ({ data: output, info } = await sharp(input, { animated: false })
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true }));
  } catch {
    throw new UploadError("The file could not be read as an image");
  }

  const now = new Date();
  const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.webp`;
  const full = resolveKey(key, root);
  if (!full) throw new UploadError("Invalid key");
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, output);
  return { key, mime: "image/webp", width: info.width, height: info.height, size: output.length };
}

export async function readStored(key: string, root = uploadsDir()) {
  const full = resolveKey(key, root);
  if (!full) return null;
  try {
    const [data, s] = await Promise.all([readFile(full), stat(full)]);
    return { data, size: s.size, mtime: s.mtime };
  } catch {
    return null;
  }
}

export async function deleteStored(key: string, root = uploadsDir()): Promise<void> {
  const full = resolveKey(key, root);
  if (full) await rm(full, { force: true });
}

export function contentTypeFor(key: string): string {
  const ext = path.extname(key).toLowerCase();
  return (
    {
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".avif": "image/avif",
      ".svg": "image/svg+xml",
    }[ext] ?? "application/octet-stream"
  );
}
