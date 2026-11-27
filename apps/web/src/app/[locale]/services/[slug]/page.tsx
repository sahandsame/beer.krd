import { type Locale, pick } from "@beer/i18n";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { Eyebrow } from "@/components/eyebrow";
import { ServiceCard } from "@/components/service-card";
import { ServiceIcon } from "@/components/service-icon";
import { Link } from "@/i18n/navigation";
import { getService, getServices } from "@/lib/data";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return {
    title: pick(s.name, locale as Locale),
    description: pick(s.summary, locale as Locale),
    alternates: alternates(locale as Locale, `/services/${slug}`),
  };
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const [service, all] = await Promise.all([getService(slug), getServices()]);
  if (!service) notFound();
  const t = await getTranslations();
  const name = pick(service.name, locale);
  const deliverables = pick(service.deliverables, locale).split("\n").filter(Boolean);
  const others = all.filter((s) => s.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-site relative flex flex-col gap-6 py-16 md:py-24">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.25em] text-mist hover:text-lime"
          >
            <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
            {t("common.backToServices")}
          </Link>
          <span className="grid size-16 place-items-center rounded-2xl bg-lime text-ink animate-fade-up">
            <ServiceIcon name={service.icon} className="size-8" />
          </span>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight animate-fade-up md:text-6xl">
            {name}
          </h1>
          <p className="max-w-2xl text-xl text-mist animate-fade-up">
            {pick(service.summary, locale)}
          </p>
        </div>
      </section>

      <section className="container-site grid gap-14 py-20 md:grid-cols-[1.4fr_1fr]">
        <div className="prose-beer text-lg leading-relaxed text-paper/90">
          {pick(service.body, locale)
            .split(/\n{2,}/)
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
        {deliverables.length > 0 && (
          <aside className="rounded-2xl border border-line bg-surface/60 p-7">
            <Eyebrow className="mb-6">{t("services.deliverables")}</Eyebrow>
            <ul className="flex flex-col gap-4">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-lime" aria-hidden="true" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            {service.slug === "web-software" && (
              <Link
                href="/pricing"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime hover:underline"
              >
                {t("pricing.fromWebSoftware")}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            )}
          </aside>
        )}
      </section>

      <CtaPanel
        title={t("services.ctaTitle", { service: name })}
        body={t("services.ctaBody")}
        button={t("common.startProject")}
        href={`/contact?service=${service.slug}`}
      />

      {others.length > 0 && (
        <section className="container-site pt-24">
          <Eyebrow className="mb-8">{t("services.otherServices")}</Eyebrow>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.id}>
                <ServiceCard
                  service={s}
                  locale={locale}
                  index={all.findIndex((x) => x.id === s.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
