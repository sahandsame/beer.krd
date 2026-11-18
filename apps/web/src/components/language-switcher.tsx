"use client";
import { type Locale, localeMeta, locales } from "@beer/i18n";
import { cn } from "@beer/ui/cn";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher({ className }: { className?: string }) {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav
      aria-label={t("language")}
      className={cn("flex items-center rounded-full border border-line p-0.5", className)}
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={localeMeta[l].htmlLang}
          hrefLang={localeMeta[l].htmlLang}
          aria-current={l === current ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs transition-colors",
            l === current ? "bg-lime text-ink" : "text-mist hover:text-paper",
          )}
        >
          {localeMeta[l].native}
        </Link>
      ))}
    </nav>
  );
}
