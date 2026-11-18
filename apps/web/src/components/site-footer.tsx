import { type Locale, pick } from "@beer/i18n";
import { Barcode, BMark, Wordmark } from "@beer/ui/brand";
import type { SiteSettings } from "@beer/validators";
import { MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contactLinks } from "@/lib/contact-links";
import { FacebookIcon, InstagramIcon, ViberIcon, WhatsAppIcon } from "./social-icons";

export async function SiteFooter({
  locale,
  settings,
  workEnabled,
}: {
  locale: Locale;
  settings: SiteSettings;
  workEnabled: boolean;
}) {
  const t = await getTranslations();
  const links = contactLinks(settings);
  const socials = [
    links.instagram && { href: links.instagram, label: t("common.instagram"), Icon: InstagramIcon },
    links.facebook && { href: links.facebook, label: t("common.facebook"), Icon: FacebookIcon },
    links.whatsapp && { href: links.whatsapp, label: t("common.whatsapp"), Icon: WhatsAppIcon },
    links.viber && { href: links.viber, label: t("common.viber"), Icon: ViberIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <footer className="mt-24 border-t border-line bg-forest-deep">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="flex items-end gap-4" dir="ltr">
            <BMark className="h-14 w-auto text-lime" />
            <div className="flex flex-col gap-1.5 pb-1">
              <Barcode className="h-3 w-36" />
              <Wordmark className="text-xs" />
            </div>
          </div>
          <p className="max-w-xs text-lg text-paper">{t("footer.tagline")}</p>
          {socials.length > 0 && (
            <ul className="flex gap-2" aria-label={t("common.followUs")}>
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-line text-mist transition-colors hover:border-lime hover:text-lime"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3 text-sm text-mist">
            <li>
              <Link className="hover:text-lime" href="/services">
                {t("nav.services")}
              </Link>
            </li>
            {workEnabled && (
              <li>
                <Link className="hover:text-lime" href="/work">
                  {t("nav.work")}
                </Link>
              </li>
            )}
            <li>
              <Link className="hover:text-lime" href="/about">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link className="hover:text-lime" href="/contact">
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link className="hover:text-lime" href="/privacy">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </nav>
        <ul className="flex flex-col gap-3 text-sm text-mist">
          {links.tel && (
            <li>
              <a href={links.tel} className="inline-flex items-center gap-2 hover:text-lime">
                <Phone className="size-4" aria-hidden="true" />
                <span dir="ltr">{settings.phone}</span>
              </a>
            </li>
          )}
          <li className="inline-flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            {pick(settings.city, locale)}
          </li>
        </ul>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col items-start justify-between gap-3 py-6 text-xs text-mist/80 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {t("meta.siteName")}. {t("footer.rights")}
          </p>
          <p dir="ltr" className="font-mono tracking-[0.3em]">
            BEER.KRD
          </p>
        </div>
      </div>
    </footer>
  );
}
