import { type Locale, pick } from "@beer/i18n";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { PackageCard } from "@/components/package-card";
import { PageHeader } from "@/components/page-header";
import { getBlocks } from "@/lib/data";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params;
  const { "pricing.intro": intro } = await getBlocks(["pricing.intro"]);
  return {
    title: pick(intro.title, locale as Locale),
    description: pick(intro.lead, locale as Locale),
    alternates: alternates(locale as Locale, "/pricing"),
  };
}

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const blocks = await getBlocks([
    "pricing.intro",
    "pricing.packages",
    "pricing.notes",
    "home.cta",
  ]);
  const intro = blocks["pricing.intro"];
  const packages = blocks["pricing.packages"].items;
  const notes = blocks["pricing.notes"];
  const cta = blocks["home.cta"];
  const labels = { delivery: t("delivery"), choose: t("choose"), featured: t("featured") };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={pick(intro.title, locale)}
        lead={pick(intro.lead, locale)}
      />
      <section className="container-site py-16">
        <ul className="grid gap-6 pt-3 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => (
            <li key={i}>
              <PackageCard pkg={p} index={i} locale={locale} labels={labels} />
            </li>
          ))}
        </ul>
      </section>
      {notes.items.length > 0 && (
        <section className="border-y border-line bg-surface/40">
          <div className="container-site py-16">
            <h2 className="mb-10 text-3xl font-semibold">{pick(notes.title, locale)}</h2>
            <dl className="grid gap-8 md:grid-cols-2">
              {notes.items.map((n, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <dt className="text-lg font-semibold">{pick(n.title, locale)}</dt>
                  <dd className="text-mist">{pick(n.body, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
      <CtaPanel
        title={pick(cta.title, locale)}
        body={pick(cta.body, locale)}
        button={pick(cta.button, locale)}
      />
    </>
  );
}
