import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { deleteStored, mediaUrl, readStored, resolveKey, storeImage, UploadError } from "../src";

let root: string;
beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), "beer-storage-"));
});
afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("resolveKey", () => {
  it("blocks path traversal", () => {
    expect(resolveKey("../secret.txt", root)).toBeNull();
    expect(resolveKey("2026/../../x", root)).toBeNull();
    expect(resolveKey("2026/11/a.webp", root)).toBe(path.join(root, "2026", "11", "a.webp"));
  });
});

describe("storeImage", () => {
  it("re-encodes images as webp and shrinks large ones", async () => {
    const png = await sharp({
      create: { width: 3000, height: 1500, channels: 3, background: "#C6DB62" },
    })
      .png()
      .toBuffer();
    const stored = await storeImage(
      new File([new Uint8Array(png)], "big.png", { type: "image/png" }),
      root,
    );
    expect(stored.mime).toBe("image/webp");
    expect(stored.width).toBe(2400);
    expect(stored.height).toBe(1200);
    expect(stored.key).toMatch(/^\d{4}\/\d{2}\/[0-9a-f-]+\.webp$/);
    const read = await readStored(stored.key, root);
    expect(read?.size).toBe(stored.size);
    await deleteStored(stored.key, root);
    expect(await readStored(stored.key, root)).toBeNull();
  });

  it("rejects non-images", async () => {
    await expect(
      storeImage(new File(["hi"], "a.txt", { type: "text/plain" }), root),
    ).rejects.toThrow(UploadError);
  });

  it("rejects corrupt images", async () => {
    await expect(
      storeImage(new File(["not really"], "a.png", { type: "image/png" }), root),
    ).rejects.toThrow("could not be read");
  });
});

describe("mediaUrl", () => {
  it("joins base and key", () => {
    expect(mediaUrl("2026/11/a b.webp", "https://beer.krd/media/")).toBe(
      "https://beer.krd/media/2026/11/a%20b.webp",
    );
    expect(mediaUrl(null)).toBeNull();
  });
});
