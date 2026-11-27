import { type Locale, pick } from "@beer/i18n";
import { budgetRanges } from "@beer/validators";
import { MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/eyebrow";
import { FacebookIcon, InstagramIcon, ViberIcon, WhatsAppIcon } from "@/components/social-icons";
import { contactLinks } from "@/lib/contact-links";
import { getBlocks, getServices, getSettings } from "@/lib/data";
import { alternates } from "@/lib/seo";
import { ContactForm } from "./contact-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const { "contact.intro": intro } = await getBlocks(["contact.intro"]);
  return {
    title: pick(intro.title, locale as Locale),
    description: pick(intro.body, locale as Locale),
    alternates: alternates(locale as Locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: PageProps<"/[locale]/contact">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const {
    service,
    budget,
    package: pkgParam,
  } = (await searchParams) as { service?: string; budget?: string; package?: string };
  const t = await getTranslations();
  const [blocks, services, settings] = await Promise.all([
    getBlocks(["contact.intro", "pricing.packages"]),
    getServices(),
    getSettings(),
  ]);
  const intro = blocks["contact.intro"];
  // Arriving from a package on /pricing: remember which one (shown on the lead in the admin).
  const pkgIndex = Number(pkgParam) - 1;
  const chosen = Number.isInteger(pkgIndex)
    ? blocks["pricing.packages"].items[pkgIndex]
    : undefined;
  const packageNote = chosen ? `${pkgIndex + 1} (${pick(chosen.name, "en")})` : undefined;
  const links = contactLinks(settings);

  const channels = [
    links.tel && {
      href: links.tel,
      label: t("common.phone"),
      value: settings.phone,
      Icon: Phone,
      ltr: true,
    },
    links.whatsapp && {
      href: links.whatsapp,
      label: t("common.whatsapp"),
      value: settings.whatsapp,
      Icon: WhatsAppIcon,
      ltr: true,
    },
    links.viber && {
      href: links.viber,
      label: t("common.viber"),
      value: settings.viber,
      Icon: ViberIcon,
      ltr: true,
    },
    links.instagram && {
      href: links.instagram,
      label: t("common.instagram"),
      value: "Instagram",
      Icon: InstagramIcon,
    },
    links.facebook && {
      href: links.facebook,
      label: t("common.facebook"),
      value: "Beer Agency",
      Icon: FacebookIcon,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    value: string;
    Icon: typeof Phone;
    ltr?: boolean;
  }[];

  const address = pick(settings.address, locale);

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative grid gap-14 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
            <h1 className="text-4xl font-semibold md:text-6xl">{pick(intro.title, locale)}</h1>
            <p className="max-w-xl text-lg text-mist">{pick(intro.body, locale)}</p>
          </div>
          <ContactForm
            services={services.map((s) => ({ slug: s.slug, name: pick(s.name, locale) }))}
            defaultService={services.some((s) => s.slug === service) ? service : undefined}
            defaultBudget={
              (budgetRanges as readonly string[]).includes(budget ?? "") ? budget : undefined
            }
            packageNote={packageNote}
          />
        </div>

        <aside className="flex flex-col gap-6 md:pt-40">
          <div className="rounded-2xl border border-line bg-surface/70 p-7">
            <h2 className="mb-6 text-lg font-semibold">{t("contact.direct")}</h2>
            <ul className="flex flex-col gap-2">
              {channels.map(({ href, label, value, Icon, ltr }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime/10 text-lime group-hover:bg-lime group-hover:text-ink">
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-xs text-mist">{label}</span>
                      <span dir={ltr ? "ltr" : undefined} className="text-start">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime/10 text-lime">
                  <MapPin className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-mist">{t("common.location")}</span>
                  <span>{address || pick(settings.city, locale)}</span>
                </span>
              </li>
            </ul>
          </div>
          {settings.showMap && settings.mapEmbedUrl && (
            <iframe
              src={settings.mapEmbedUrl}
              title={t("common.location")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl border border-line"
            />
          )}
        </aside>
      </div>
    </section>
  );
}
