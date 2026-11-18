import { type Locale, pick } from "@beer/i18n";
import { cn } from "@beer/ui/cn";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Link } from "@/i18n/navigation";
import { getProjects, getServices, getSettings } from "@/lib/data";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternates(locale as Locale, "/work"),
  };
}

export default async function WorkPage({ params, searchParams }: PageProps<"/[locale]/work">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const settings = await getSettings();
  if (!settings.workSectionEnabled) notFound();
  const { service: filter } = (await searchParams) as { service?: string };
  const t = await getTranslations("work");
  const [projects, services] = await Promise.all([getProjects(false), getServices()]);
  const used = services.filter((s) =>
    projects.some((p) => p.services.some((ps) => ps.slug === s.slug)),
  );
  const shown = filter
    ? projects.filter((p) => p.services.some((s) => s.slug === filter))
    : projects;

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm transition-colors",
      active
        ? "border-lime bg-lime text-ink"
        : "border-line text-mist hover:border-lime hover:text-paper",
    );

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <section className="container-site py-14">
        {used.length > 1 && (
          <nav aria-label={t("services")} className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/work"
              className={chip(!filter)}
              aria-current={!filter ? "true" : undefined}
            >
              {t("all")}
            </Link>
            {used.map((s) => (
              <Link
                key={s.id}
                href={{ pathname: "/work", query: { service: s.slug } }}
                className={chip(filter === s.slug)}
                aria-current={filter === s.slug ? "true" : undefined}
              >
                {pick(s.name, locale)}
              </Link>
            ))}
          </nav>
        )}
        {shown.length === 0 ? (
          <p className="py-20 text-center text-lg text-mist">{t("empty")}</p>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {shown.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
