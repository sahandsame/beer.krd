import type { Localized } from "@beer/i18n";

/** Field types the admin's generic block editor knows how to render. */
export type FieldType = "localized" | "localizedText" | "text";
export type FieldDef = { name: string; label: string; type: FieldType };
export type ListDef = { name: string; label: string; max: number; fields: readonly FieldDef[] };
type BlockPage = "Home" | "About" | "Contact" | "SEO";
type RawBlockDef = {
  key: string;
  label: string;
  page: BlockPage;
  fields: readonly FieldDef[];
  list?: ListDef;
};
export type BlockDef = RawBlockDef & { key: BlockKey };

export const blockDefs = [
  {
    key: "home.hero",
    label: "Hero",
    page: "Home",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "localized" },
      { name: "title", label: "Headline", type: "localizedText" },
      { name: "subtitle", label: "Subtitle", type: "localizedText" },
      { name: "primaryCta", label: "Primary button", type: "localized" },
      { name: "secondaryCta", label: "Secondary button", type: "localized" },
    ],
  },
  {
    key: "home.intro",
    label: "Intro (meaning of بیر)",
    page: "Home",
    fields: [
      { name: "title", label: "Title", type: "localized" },
      { name: "body", label: "Body", type: "localizedText" },
    ],
  },
  {
    key: "home.process",
    label: "Process",
    page: "Home",
    fields: [{ name: "title", label: "Section title", type: "localized" }],
    list: {
      name: "steps",
      label: "Steps",
      max: 6,
      fields: [
        { name: "title", label: "Step title", type: "localized" },
        { name: "body", label: "Step text", type: "localizedText" },
      ],
    },
  },
  {
    key: "home.stats",
    label: "Stats strip",
    page: "Home",
    fields: [],
    list: {
      name: "items",
      label: "Stats",
      max: 4,
      fields: [
        { name: "value", label: "Value", type: "text" },
        { name: "label", label: "Label", type: "localized" },
      ],
    },
  },
  {
    key: "home.cta",
    label: "Call to action",
    page: "Home",
    fields: [
      { name: "title", label: "Title", type: "localized" },
      { name: "body", label: "Body", type: "localizedText" },
      { name: "button", label: "Button", type: "localized" },
    ],
  },
  {
    key: "about.story",
    label: "Story",
    page: "About",
    fields: [
      { name: "title", label: "Title", type: "localized" },
      { name: "body", label: "Body (blank line = new paragraph)", type: "localizedText" },
    ],
  },
  {
    key: "about.values",
    label: "Values",
    page: "About",
    fields: [{ name: "title", label: "Section title", type: "localized" }],
    list: {
      name: "items",
      label: "Values",
      max: 6,
      fields: [
        { name: "title", label: "Value", type: "localized" },
        { name: "body", label: "Description", type: "localizedText" },
      ],
    },
  },
  {
    key: "contact.intro",
    label: "Contact intro",
    page: "Contact",
    fields: [
      { name: "title", label: "Title", type: "localized" },
      { name: "body", label: "Body", type: "localizedText" },
    ],
  },
  {
    key: "seo.default",
    label: "Default SEO",
    page: "SEO",
    fields: [
      { name: "title", label: "Site title", type: "localized" },
      { name: "description", label: "Meta description", type: "localizedText" },
    ],
  },
] as const satisfies readonly RawBlockDef[];

export type BlockKey = (typeof blockDefs)[number]["key"];

type ValueOf<F extends FieldType> = F extends "text" ? string : Localized;
type FieldsOf<T extends readonly { name: string; type: FieldType }[]> = {
  [K in T[number] as K["name"]]: ValueOf<K["type"]>;
};
type BlockData<D> = D extends {
  fields: infer F extends readonly { name: string; type: FieldType }[];
}
  ? FieldsOf<F> &
      (D extends {
        list: {
          name: infer N extends string;
          fields: infer LF extends readonly { name: string; type: FieldType }[];
        };
      }
        ? { [K in N]: FieldsOf<LF>[] }
        : unknown)
  : never;

export type BlockDataMap = { [D in (typeof blockDefs)[number] as D["key"]]: BlockData<D> };

export function getBlockDef(key: string): BlockDef | undefined {
  return (blockDefs as readonly BlockDef[]).find((b) => b.key === key);
}
