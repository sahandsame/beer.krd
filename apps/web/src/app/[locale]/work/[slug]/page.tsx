import { type Locale, pick } from "@beer/i18n";
import { mediaUrl } from "@beer/storage/url";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaPanel } from "@/components/cta-panel";
import { Eyebrow } from "@/components/eyebrow";
import { Link } from "@/i18n/navigation";
import { getBlocks, getProject, getSettings } from "@/lib/data";
import { alternates } from "@/lib/seo";

/** Turn a YouTube/Vimeo watch URL into an embeddable one; anything else is shown as a link. */
function embedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/shorts/")[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {}
  return null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const [settings, p] = await Promise.all([getSettings(), getProject(slug)]);
  if (!settings.workSectionEnabled || !p) return {};
  const cover = mediaUrl(p.cover?.key);
  return {
    title: pick(p.title, locale as Locale),
    description: pick(p.summary, locale as Locale),
    alternates: alternates(locale as Locale, `/work/${slug}`),
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const [settings, project, blocks] = await Promise.all([
    getSettings(),
    getProject(slug),
    getBlocks(["home.cta"]),
  ]);
  if (!settings.workSectionEnabled || !project) notFound();
  const t = await getTranslations();
  const cover = mediaUrl(project.cover?.key);
  const sections = (["challenge", "approach", "results"] as const)
    .map((k) => ({ key: k, text: pick(project[k], locale) }))
    .filter((s) => s.text);
  const cta = blocks["home.cta"];

  return (
    <>
      <section className="container-site flex flex-col gap-6 pt-14 pb-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.25em] text-mist hover:text-lime"
        >
          <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
          {t("common.backToWork")}
        </Link>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          {pick(project.title, locale)}
        </h1>
        {pick(project.summary, locale) && (
          <p className="max-w-3xl text-xl text-mist">{pick(project.summary, locale)}</p>
        )}
        <dl className="mt-4 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          {project.client && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-mist">{t("work.client")}</dt>
              <dd className="mt-1">{project.client}</dd>
            </div>
          )}
          {project.year && (
            <div>
              <dt className="text-xs uppercase tracking-widest text-mist">{t("work.year")}</dt>
              <dd className="mt-1 font-mono">{project.year}</dd>
            </div>
          )}
          {project.services.length > 0 && (
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-widest text-mist">{t("work.services")}</dt>
              <dd className="mt-1">
                {project.services.map((s) => pick(s.name, locale)).join(" · ")}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {cover && (
        <div className="container-site">
          {/* biome-ignore lint/performance/noImgElement: uploads are already resized WebP */}
          <img
            src={cover}
            alt={pick(project.cover?.alt, locale) || pick(project.title, locale)}
            width={project.cover?.width ?? undefined}
            height={project.cover?.height ?? undefined}
            className="w-full rounded-3xl border border-line object-cover"
          />
        </div>
      )}

      {sections.length > 0 && (
        <section className="container-site grid gap-12 py-20 md:grid-cols-3">
          {sections.map((s) => (
            <div key={s.key} className="flex flex-col gap-4">
              <Eyebrow>{t(`work.${s.key}`)}</Eyebrow>
              <div className="prose-beer text-paper/90">
                {s.text.split(/\n{2,}/).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="container-site py-10" aria-label={t("work.gallery")}>
          <ul className="grid gap-6 md:grid-cols-2">
            {project.gallery.map((g) => (
              <li key={g.key}>
                {/* biome-ignore lint/performance/noImgElement: uploads are already resized WebP */}
                <img
                  src={mediaUrl(g.key) ?? ""}
                  alt={pick(g.alt, locale)}
                  width={g.width ?? undefined}
                  height={g.height ?? undefined}
                  loading="lazy"
                  className="w-full rounded-2xl border border-line object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.videoUrls.length > 0 && (
        <section className="container-site py-10" aria-label={t("work.videos")}>
          <ul className="grid gap-6 md:grid-cols-2">
            {project.videoUrls.map((url) => {
              const src = embedUrl(url);
              return (
                <li key={url}>
                  {src ? (
                    <iframe
                      src={src}
                      title={pick(project.title, locale)}
                      loading="lazy"
                      allow="encrypted-media; picture-in-picture; fullscreen"
                      className="aspect-video w-full rounded-2xl border border-line"
                    />
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime underline"
                    >
                      {url}
                    </a>
                  )}
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
