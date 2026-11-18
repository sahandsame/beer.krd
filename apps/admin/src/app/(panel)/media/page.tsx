import { db, media } from "@beer/db";
import { Input } from "@beer/ui/components/form";
import { desc } from "drizzle-orm";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import { EmptyState, PageTitle } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { requireUser } from "@/lib/session";
import { deleteMedia, updateAlt, uploadMedia } from "./actions";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireUser();
  const rows = await db.select().from(media).orderBy(desc(media.createdAt)).limit(200);
  return (
    <>
      <PageTitle
        title="Media library"
        description="Images are converted to WebP (max 2400px). Add alt text so the site stays accessible."
      />
      <div className="mb-8 rounded-2xl border border-line bg-surface/60 p-5">
        <ActionForm
          action={uploadMedia}
          resetOnSuccess
          className="flex-row flex-wrap items-end gap-4"
        >
          <Input
            name="files"
            type="file"
            accept="image/*"
            multiple
            className="h-auto max-w-md py-2"
            aria-label="Images to upload"
          />
          <SubmitButton>Upload</SubmitButton>
        </ActionForm>
      </div>
      {rows.length === 0 ? (
        <EmptyState>No images yet.</EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/60 p-4"
            >
              {/* biome-ignore lint/performance/noImgElement: admin preview */}
              <img
                src={mediaUrl(m.key) ?? ""}
                alt={m.alt.en}
                className="aspect-video w-full rounded-lg bg-forest object-contain"
              />
              <p className="truncate font-mono text-xs text-mist" title={m.originalName}>
                {m.originalName || m.key} · {m.width}×{m.height} · {Math.round(m.size / 1024)} KB
              </p>
              <details>
                <summary className="cursor-pointer text-sm text-lime">Alt text</summary>
                <div className="mt-3">
                  <ActionForm action={updateAlt.bind(null, m.id)} className="gap-3">
                    <LocalizedField name="alt" label="Describe the image" defaultValue={m.alt} />
                    <div>
                      <SubmitButton size="sm">Save alt text</SubmitButton>
                    </div>
                  </ActionForm>
                </div>
              </details>
              <ActionForm action={deleteMedia.bind(null, m.id)} className="gap-2">
                <div>
                  <SubmitButton
                    size="sm"
                    variant="ghost"
                    confirm="Delete this image file permanently?"
                  >
                    Delete
                  </SubmitButton>
                </div>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
