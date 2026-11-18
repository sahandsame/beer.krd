import { type Locale, pick } from "@beer/i18n";
import { mediaUrl } from "@beer/storage/url";
import { BMark } from "@beer/ui/brand";
import { Link } from "@/i18n/navigation";

type ProjectLike = {
  slug: string;
  client: string;
  year: number | null;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  cover: {
    key: string;
    width: number | null;
    height: number | null;
    alt: Record<Locale, string> | null;
  } | null;
  services: { slug: string; name: Record<Locale, string> }[];
};

export function ProjectCard({ project, locale }: { project: ProjectLike; locale: Locale }) {
  const src = mediaUrl(project.cover?.key);
  return (
    <Link href={`/work/${project.slug}`} className="group flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface">
        {src ? (
          // biome-ignore lint/performance/noImgElement: uploads are already resized WebP
          <img
            src={src}
            alt={pick(project.cover?.alt, locale) || pick(project.title, locale)}
            width={project.cover?.width ?? undefined}
            height={project.cover?.height ?? undefined}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <BMark className="h-1/2 w-auto text-lime/20" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">
          {project.services.map((s) => pick(s.name, locale)).join(" · ")}
        </p>
        <h3 className="text-xl font-semibold group-hover:text-lime">
          {pick(project.title, locale)}
        </h3>
        {pick(project.summary, locale) && (
          <p className="text-mist">{pick(project.summary, locale)}</p>
        )}
      </div>
    </Link>
  );
}
