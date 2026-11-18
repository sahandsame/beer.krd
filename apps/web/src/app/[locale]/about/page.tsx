import { type Locale, pick } from "@beer/i18n";
import { mediaUrl } from "@beer/storage/url";
import { BMark } from "@beer/ui/brand";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { Eyebrow } from "@/components/eyebrow";
import { PageHeader } from "@/components/page-header";
import { getBlocks, getTeam } from "@/lib/data";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const { "about.story": story } = await getBlocks(["about.story"]);
  return {
    title: pick(story.title, locale as Locale),
    description: pick(story.body, locale as Locale)
      .split("\n")[0]
      ?.slice(0, 160),
    alternates: alternates(locale as Locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const [blocks, team] = await Promise.all([
    getBlocks(["about.story", "about.values", "home.cta", "home.intro"]),
    getTeam(),
  ]);
  const story = blocks["about.story"];
  const values = blocks["about.values"];
  const cta = blocks["home.cta"];

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={pick(story.title, locale)}
        lead={pick(blocks["home.intro"].title, locale)}
      />

      <section className="container-site grid gap-14 py-20 md:grid-cols-[1.5fr_1fr] md:items-start">
        <div className="prose-beer text-lg leading-relaxed text-paper/90">
          {pick(story.body, locale)
            .split(/\n{2,}/)
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
        <div className="relative mx-auto w-48 md:w-full md:max-w-[16rem]" dir="ltr">
          <BMark shadow className="w-full text-lime" />
        </div>
      </section>

      <section className="border-y border-line bg-surface/40">
        <div className="container-site py-20">
          <h2 className="mb-12 text-3xl font-semibold md:text-4xl">{pick(values.title, locale)}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {values.items.map((v, i) => (
              <li
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-forest/60 p-7"
              >
                <span className="font-mono text-sm text-lime" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-semibold">{pick(v.title, locale)}</h3>
                <p className="text-mist">{pick(v.body, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 && (
        <section className="container-site py-20">
          <Eyebrow className="mb-10">{t("team")}</Eyebrow>
          <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {team.map((m) => {
              const src = mediaUrl(m.photoKey);
              return (
                <li key={m.id} className="flex flex-col gap-3">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface">
                    {src ? (
                      // biome-ignore lint/performance/noImgElement: uploads are already resized WebP
                      <img
                        src={src}
                        alt={pick(m.name, locale)}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="grid size-full place-items-center">
                        <BMark className="h-1/3 w-auto text-lime/20" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{pick(m.name, locale)}</p>
                    <p className="text-sm text-mist">{pick(m.role, locale)}</p>
                  </div>
                </li>
              );
            })}
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
