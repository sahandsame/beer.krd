import { type Locale, locales } from "@beer/i18n";
import { WEB_URL } from "./env";

/** canonical + hreflang alternates for a path like "/services" (without locale). */
export function alternates(locale: Locale, path = "") {
  const p = path === "/" ? "" : path;
  return {
    canonical: `${WEB_URL}/${locale}${p}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${WEB_URL}/${l}${p}`])),
      "x-default": `${WEB_URL}/ckb${p}`,
    },
  };
}
