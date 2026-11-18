export const locales = ["ckb", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ckb";

/** A string stored once per locale, e.g. `{ ckb: "...", en: "...", ar: "..." }`. */
export type Localized = Record<Locale, string>;

export const localeMeta: Record<
  Locale,
  { label: string; native: string; dir: "rtl" | "ltr"; htmlLang: string; ogLocale: string }
> = {
  ckb: {
    label: "Kurdish (Sorani)",
    native: "کوردی",
    dir: "rtl",
    htmlLang: "ckb",
    ogLocale: "ckb_IQ",
  },
  en: { label: "English", native: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "Arabic", native: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_IQ" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return localeMeta[locale].dir;
}

export function emptyLocalized(): Localized {
  return { ckb: "", en: "", ar: "" };
}

/**
 * Pick the text for `locale`, falling back to the default locale (ckb),
 * then to any non-empty translation, then to "".
 */
export function pick(value: Partial<Localized> | null | undefined, locale: Locale): string {
  if (!value) return "";
  const own = value[locale]?.trim();
  if (own) return own;
  const fallback = value[defaultLocale]?.trim();
  if (fallback) return fallback;
  for (const l of locales) {
    const v = value[l]?.trim();
    if (v) return v;
  }
  return "";
}

/** Locales whose translation is empty. */
export function missingLocales(value: Partial<Localized> | null | undefined): Locale[] {
  return locales.filter((l) => !value?.[l]?.trim());
}

/** Read `${name}.ckb`, `${name}.en`, `${name}.ar` from a FormData. */
export function localizedFromForm(form: FormData, name: string): Localized {
  const out = emptyLocalized();
  for (const l of locales) {
    const v = form.get(`${name}.${l}`);
    out[l] = typeof v === "string" ? v.trim() : "";
  }
  return out;
}
