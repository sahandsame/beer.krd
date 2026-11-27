import { LogoInline } from "@beer/ui/brand";
import { buttonClasses } from "@beer/ui/components/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export async function SiteHeader({ workEnabled }: { workEnabled: boolean }) {
  const t = await getTranslations();
  const items = [
    { href: "/services", label: t("nav.services") },
    { href: "/pricing", label: t("nav.pricing") },
    ...(workEnabled ? [{ href: "/work", label: t("nav.work") }] : []),
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-forest/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label={t("meta.siteName")} className="shrink-0">
          <LogoInline />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks items={items} className="flex items-center gap-7" />
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden md:flex" />
          <Link
            href="/contact"
            className={buttonClasses({ size: "sm", className: "hidden sm:inline-flex" })}
          >
            {t("common.startProject")}
          </Link>
          <MobileMenu
            items={[{ href: "/", label: t("nav.home") }, ...items]}
            labels={{ menu: t("nav.menu"), close: t("nav.close") }}
          />
        </div>
      </div>
    </header>
  );
}
