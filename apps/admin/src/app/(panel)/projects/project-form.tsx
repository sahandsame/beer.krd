import type { Project, Service } from "@beer/db";
import { Checkbox, Field, Input, Textarea } from "@beer/ui/components/form";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/form";
import { mediaUrl } from "@/lib/media";

type Props = {
  project?: Project;
  services: Service[];
  selectedServiceIds?: string[];
  cover?: { key: string } | null;
  gallery?: { id: string; key: string }[];
  action: (p: ActionResult, f: FormData) => Promise<ActionResult>;
};

export function ProjectForm({
  project,
  services,
  selectedServiceIds = [],
  cover,
  gallery = [],
  action,
}: Props) {
  const coverSrc = mediaUrl(cover?.key);
  return (
    <ActionForm action={action} className="max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-4">
        <Field id="slug" label="URL slug" className="sm:col-span-2">
          <Input
            id="slug"
            name="slug"
            defaultValue={project?.slug}
            required
            pattern="[a-z0-9-]+"
            dir="ltr"
          />
        </Field>
        <Field id="year" label="Year">
          <Input
            id="year"
            name="year"
            type="number"
            min={2000}
            max={2100}
            defaultValue={project?.year ?? new Date().getFullYear()}
          />
        </Field>
        <Field id="sort" label="Order">
          <Input
            id="sort"
            name="sort"
            type="number"
            min={0}
            max={999}
            defaultValue={project?.sort ?? 100}
          />
        </Field>
      </div>
      <Field id="client" label="Client name">
        <Input id="client" name="client" defaultValue={project?.client} />
      </Field>
      <LocalizedField name="title" label="Title" defaultValue={project?.title} required />
      <LocalizedField
        name="summary"
        label="Summary"
        defaultValue={project?.summary}
        multiline
        rows={2}
      />
      <LocalizedField
        name="challenge"
        label="The challenge"
        defaultValue={project?.challenge}
        multiline
      />
      <LocalizedField
        name="approach"
        label="Our approach"
        defaultValue={project?.approach}
        multiline
      />
      <LocalizedField name="results" label="Results" defaultValue={project?.results} multiline />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-mist">Services</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {services.map((s) => (
            <Checkbox
              key={s.id}
              name="serviceIds"
              value={s.id}
              label={s.name.en || s.name.ckb}
              defaultChecked={selectedServiceIds.includes(s.id)}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <Field
          id="cover"
          label="Cover image"
          hint="JPG, PNG or WebP, up to 15 MB. Converted to WebP automatically."
        >
          <Input id="cover" name="cover" type="file" accept="image/*" className="h-auto py-2" />
        </Field>
        {coverSrc && (
          <div className="flex items-center gap-4">
            {/* biome-ignore lint/performance/noImgElement: admin preview */}
            <img
              src={coverSrc}
              alt=""
              className="h-24 w-36 rounded-lg border border-line object-cover"
            />
            <Checkbox name="removeCover" label="Remove cover" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Field id="gallery" label="Add gallery images" hint="Select several files at once.">
          <Input
            id="gallery"
            name="gallery"
            type="file"
            accept="image/*"
            multiple
            className="h-auto py-2"
          />
        </Field>
        {gallery.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.map((g) => (
              <li key={g.id} className="flex flex-col gap-1.5">
                {/* biome-ignore lint/performance/noImgElement: admin preview */}
                <img
                  src={mediaUrl(g.key) ?? ""}
                  alt=""
                  className="aspect-square w-full rounded-lg border border-line object-cover"
                />
                <Checkbox name="removeGallery" value={g.id} label="Remove" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Field id="videoUrls" label="Video links" hint="YouTube or Vimeo links, one per line.">
        <Textarea
          id="videoUrls"
          name="videoUrls"
          rows={3}
          dir="ltr"
          defaultValue={project?.videoUrls.join("\n")}
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Checkbox name="published" label="Published" defaultChecked={project?.published ?? false} />
        <Checkbox
          name="featured"
          label="Featured on the home page"
          defaultChecked={project?.featured ?? false}
        />
      </div>
      <div className="flex gap-3 border-t border-line pt-6">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
