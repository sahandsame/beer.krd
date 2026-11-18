import type { Locale } from "@beer/i18n";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), alternates: alternates(locale as Locale, "/privacy") };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const paragraphs = t.raw("paragraphs") as string[];
  return (
    <>
      <PageHeader eyebrow={t("updated")} title={t("title")} />
      <section className="container-site max-w-3xl py-16">
        <div className="prose-beer text-lg leading-relaxed text-paper/90">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
