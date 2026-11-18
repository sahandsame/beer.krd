import { defaultLocale, locales } from "@beer/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: { name: "BEER_LOCALE", maxAge: 60 * 60 * 24 * 365 },
});
