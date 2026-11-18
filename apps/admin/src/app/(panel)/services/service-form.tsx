import type { Service } from "@beer/db";
import { Checkbox, Field, Input, Select } from "@beer/ui/components/form";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/form";

const icons = ["code", "megaphone", "palette", "target", "camera", "sparkles"];

export function ServiceForm({
  service,
  action,
}: {
  service?: Service;
  action: (p: ActionResult, f: FormData) => Promise<ActionResult>;
}) {
  return (
    <ActionForm action={action} className="max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="slug" label="URL slug" hint="beer.krd/en/services/<slug>">
          <Input
            id="slug"
            name="slug"
            defaultValue={service?.slug}
            required
            pattern="[a-z0-9-]+"
            dir="ltr"
          />
        </Field>
        <Field id="icon" label="Icon">
          <Select id="icon" name="icon" defaultValue={service?.icon ?? "sparkles"}>
            {icons.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="sort" label="Order" hint="Lower comes first">
          <Input
            id="sort"
            name="sort"
            type="number"
            min={0}
            max={999}
            defaultValue={service?.sort ?? 100}
          />
        </Field>
      </div>
      <LocalizedField name="name" label="Name" defaultValue={service?.name} required />
      <LocalizedField
        name="summary"
        label="Short summary"
        defaultValue={service?.summary}
        multiline
        rows={2}
        hint="Shown on cards and in search results."
      />
      <LocalizedField
        name="body"
        label="Description"
        defaultValue={service?.body}
        multiline
        rows={7}
        hint="Leave a blank line between paragraphs."
      />
      <LocalizedField
        name="deliverables"
        label="What's included"
        defaultValue={service?.deliverables}
        multiline
        rows={6}
        hint="One item per line."
      />
      <Checkbox
        name="published"
        label="Published on the website"
        defaultChecked={service?.published ?? true}
      />
      <div className="flex gap-3 border-t border-line pt-6">
        <SubmitButton>{service ? "Save changes" : "Create service"}</SubmitButton>
      </div>
    </ActionForm>
  );
}
