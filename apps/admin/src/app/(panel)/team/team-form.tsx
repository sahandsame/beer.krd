import type { TeamMember } from "@beer/db";
import { Checkbox, Field, Input } from "@beer/ui/components/form";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/form";
import { mediaUrl } from "@/lib/media";

export function TeamForm({
  member,
  photoKey,
  action,
}: {
  member?: TeamMember;
  photoKey?: string | null;
  action: (p: ActionResult, f: FormData) => Promise<ActionResult>;
}) {
  const src = mediaUrl(photoKey);
  return (
    <ActionForm action={action} className="max-w-2xl">
      <LocalizedField name="name" label="Name" defaultValue={member?.name} required />
      <LocalizedField name="role" label="Role / title" defaultValue={member?.role} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="photo" label="Photo" hint="Portrait works best (4:5).">
          <Input id="photo" name="photo" type="file" accept="image/*" className="h-auto py-2" />
        </Field>
        <Field id="sort" label="Order">
          <Input
            id="sort"
            name="sort"
            type="number"
            min={0}
            max={999}
            defaultValue={member?.sort ?? 100}
          />
        </Field>
      </div>
      {src && (
        <div className="flex items-center gap-4">
          {/* biome-ignore lint/performance/noImgElement: admin preview */}
          <img src={src} alt="" className="h-28 w-24 rounded-lg border border-line object-cover" />
          <Checkbox name="removePhoto" label="Remove photo" />
        </div>
      )}
      <Checkbox
        name="published"
        label="Show on the About page"
        defaultChecked={member?.published ?? true}
      />
      <div className="border-t border-line pt-6">
        <SubmitButton>{member ? "Save changes" : "Add member"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
