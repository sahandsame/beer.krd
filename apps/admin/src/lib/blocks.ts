import type { BlockDef, FieldDef } from "@beer/db";
import { emptyLocalized, type Localized, localizedFromForm } from "@beer/i18n";

function readField(form: FormData, prefix: string, f: FieldDef): string | Localized {
  if (f.type === "text") return String(form.get(`${prefix}${f.name}`) ?? "").trim();
  return localizedFromForm(form, `${prefix}${f.name}`);
}

const isBlank = (v: string | Localized) => (typeof v === "string" ? !v : !v.ckb && !v.en && !v.ar);

/** Turn the generic block editor's FormData back into the block's JSON shape. */
export function blockFromForm(def: BlockDef, form: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of def.fields) data[f.name] = readField(form, "", f);
  if (def.list) {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < def.list.max; i++) {
      const item: Record<string, string | Localized> = {};
      for (const f of def.list.fields) item[f.name] = readField(form, `${def.list.name}.${i}.`, f);
      if (!Object.values(item).every(isBlank)) items.push(item);
    }
    data[def.list.name] = items;
  }
  return data;
}

export function emptyValue(f: FieldDef) {
  return f.type === "text" ? "" : emptyLocalized();
}
