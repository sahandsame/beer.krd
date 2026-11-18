import { type Locale, pick } from "@beer/i18n";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { PageHeader } from "@/components/page-header";
import { ServiceIcon } from "@/components/service-icon";
import { Link } from "@/i18n/navigation";
import { getBlocks, getServices } from "@/lib/data";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("eyebrow"),
    description: t("lead"),
    alternates: alternates(locale as Locale, "/services"),
  };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [services, blocks] = await Promise.all([getServices(), getBlocks(["home.cta"])]);
  const cta = blocks["home.cta"];

  return (
    <>
      <PageHeader
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        lead={t("services.lead")}
      />
      <section className="container-site py-16">
        <ul className="divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/services/${s.slug}`}
                className="group grid gap-6 py-10 transition-colors md:grid-cols-[4rem_1.2fr_1fr] md:items-start md:gap-10"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-ink">
                  <ServiceIcon name={s.icon} className="size-7" />
                </span>
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs text-mist/70" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl font-semibold group-hover:text-lime md:text-3xl">
                    {pick(s.name, locale)}
                  </h2>
                  <p className="text-mist">{pick(s.summary, locale)}</p>
                </div>
                <ul className="flex flex-wrap gap-2 md:pt-8">
                  {pick(s.deliverables, locale)
                    .split("\n")
                    .filter(Boolean)
                    .map((d) => (
                      <li
                        key={d}
                        className="rounded-full border border-line px-3 py-1 text-sm text-mist"
                      >
                        {d}
                      </li>
                    ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaPanel
        title={pick(cta.title, locale)}
        body={pick(cta.body, locale)}
        button={pick(cta.button, locale)}
      />
    </>
  );
}
