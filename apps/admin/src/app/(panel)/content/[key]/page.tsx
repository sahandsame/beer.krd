import { contentBlock, db, type FieldDef, getBlockDef } from "@beer/db";
import { getBlocks } from "@beer/db/queries";
import type { Localized } from "@beer/i18n";
import { Field, Input } from "@beer/ui/components/form";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { saveBlock } from "./actions";

function FieldInput({ f, prefix, value }: { f: FieldDef; prefix: string; value: unknown }) {
  const name = `${prefix}${f.name}`;
  if (f.type === "text") {
    return (
      <Field id={name} label={f.label}>
        <Input id={name} name={name} defaultValue={(value as string) ?? ""} dir="ltr" />
      </Field>
    );
  }
  return (
    <LocalizedField
      name={name}
      label={f.label}
      defaultValue={value as Localized}
      multiline={f.type === "localizedText"}
      rows={f.type === "localizedText" ? 4 : undefined}
    />
  );
}

export default async function EditBlockPage({ params }: PageProps<"/content/[key]">) {
  await requireUser();
  const { key } = await params;
  const def = getBlockDef(key);
  if (!def) notFound();
  // Saved values merged over the default copy, exactly as the website shows them.
  const blocks = await getBlocks(db, [def.key]);
  const data = blocks[def.key] as Record<string, unknown>;
  const saved = await db.query.contentBlock.findFirst({ where: eq(contentBlock.key, key) });
  const list = def.list;
  const items = list ? ((data[list.name] as Record<string, unknown>[]) ?? []) : [];

  return (
    <>
      <Link href="/content" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Page content
      </Link>
      <PageTitle
        title={`${def.page} › ${def.label}`}
        description={saved ? undefined : "Showing the default text. Saving stores your version."}
      />
      <ActionForm action={saveBlock.bind(null, def.key)} className="max-w-3xl">
        {def.fields.map((f) => (
          <FieldInput key={f.name} f={f} prefix="" value={data[f.name]} />
        ))}
        {list && (
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-sm font-medium text-mist">
              {list.label}{" "}
              <span className="text-xs">(up to {list.max}; leave a row empty to remove it)</span>
            </legend>
            {Array.from({ length: list.max }, (_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-surface/50 p-5"
              >
                <p className="font-mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</p>
                {list.fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    f={f}
                    prefix={`${list.name}.${i}.`}
                    value={items[i]?.[f.name]}
                  />
                ))}
              </div>
            ))}
          </fieldset>
        )}
        <div className="border-t border-line pt-6">
          <SubmitButton>Save</SubmitButton>
        </div>
      </ActionForm>
    </>
  );
}
