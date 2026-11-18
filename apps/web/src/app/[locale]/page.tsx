import { type Locale, pick } from "@beer/i18n";
import { Barcode, BMark } from "@beer/ui/brand";
import { buttonClasses } from "@beer/ui/components/button";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { Eyebrow } from "@/components/eyebrow";
import { ProjectCard } from "@/components/project-card";
import { ServiceCard } from "@/components/service-card";
import { Link } from "@/i18n/navigation";
import { getBlocks, getProjects, getServices, getSettings } from "@/lib/data";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const [blocks, services, settings] = await Promise.all([
    getBlocks(["home.hero", "home.intro", "home.process", "home.stats", "home.cta"]),
    getServices(),
    getSettings(),
  ]);
  const featured = settings.workSectionEnabled ? await getProjects(true) : [];
  const hero = blocks["home.hero"];
  const intro = blocks["home.intro"];
  const process = blocks["home.process"];
  const stats = blocks["home.stats"].items.filter((s) => s.value);
  const cta = blocks["home.cta"];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-site relative grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-16 md:grid-cols-[1.25fr_1fr] md:py-24">
          <div className="flex flex-col gap-7">
            <Eyebrow className="animate-fade-up">{pick(hero.eyebrow, locale)}</Eyebrow>
            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight animate-fade-up [animation-delay:80ms] md:text-7xl">
              {pick(hero.title, locale)}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-mist animate-fade-up [animation-delay:160ms] md:text-xl">
              {pick(hero.subtitle, locale)}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 animate-fade-up [animation-delay:240ms]">
              <Link href="/contact" className={buttonClasses({ size: "lg" })}>
                {pick(hero.primaryCta, locale)}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
              <Link href="/services" className={buttonClasses({ size: "lg", variant: "outline" })}>
                {pick(hero.secondaryCta, locale)}
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-56 sm:w-72 md:w-full md:max-w-sm" dir="ltr">
            <BMark shadow className="w-full text-lime animate-fade-up [animation-delay:120ms]" />
            <Barcode animated className="mt-8 h-10 w-[92%]" />
          </div>
        </div>
      </section>

      {/* ── Intro: what بیر means ── */}
      <section className="border-y border-line bg-forest-deep">
        <div className="container-site grid gap-10 py-20 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <p
            lang="ckb"
            dir="rtl"
            className="font-[family-name:var(--font-arabic)] text-8xl font-bold leading-none text-lime md:text-9xl"
          >
            بیر
          </p>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold md:text-4xl">{pick(intro.title, locale)}</h2>
            <p className="max-w-2xl text-lg text-mist">{pick(intro.body, locale)}</p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="container-site py-24">
        <div className="mb-12 flex flex-col gap-4">
          <Eyebrow>{t("servicesEyebrow")}</Eyebrow>
          <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">{t("servicesTitle")}</h2>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.id} className={i === 0 ? "lg:col-span-2" : undefined}>
              <ServiceCard service={s} locale={locale} index={i} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Process ── */}
      <section className="border-y border-line bg-surface/40">
        <div className="container-site py-24">
          <div className="mb-14 flex flex-col gap-4">
            <Eyebrow>{t("processEyebrow")}</Eyebrow>
            <h2 className="text-3xl font-semibold md:text-5xl">{pick(process.title, locale)}</h2>
          </div>
          <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((step, i) => (
              <li key={i} className="flex flex-col gap-4">
                <div className="flex items-center gap-4" dir="ltr">
                  <span className="font-mono text-sm text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-line-strong" />
                </div>
                <h3 className="text-2xl font-semibold">{pick(step.title, locale)}</h3>
                <p className="text-mist">{pick(step.body, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Stats ── */}
      {stats.length > 0 && (
        <section className="container-site py-20">
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 border-s border-line-strong ps-6">
                <dt className="order-2 text-sm text-mist">{pick(s.label, locale)}</dt>
                <dd className="order-1 font-mono text-5xl font-semibold text-lime" dir="ltr">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Featured work ── */}
      {featured.length > 0 && (
        <section className="container-site py-16">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Eyebrow>{t("workEyebrow")}</Eyebrow>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("workTitle")}</h2>
            </div>
            <Link href="/work" className={buttonClasses({ variant: "outline" })}>
              {(await getTranslations("common"))("viewAll")}
            </Link>
          </div>
          <ul className="grid gap-10 md:grid-cols-2">
            {featured.slice(0, 4).map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} locale={locale} />
              </li>
            ))}
          </ul>
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
