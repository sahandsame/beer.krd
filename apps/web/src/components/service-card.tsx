import { type Locale, pick } from "@beer/i18n";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ServiceIcon } from "./service-icon";

type ServiceLike = {
  slug: string;
  icon: string;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
};

export function ServiceCard({
  service,
  locale,
  index,
}: {
  service: ServiceLike;
  locale: Locale;
  index: number;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col gap-5 rounded-2xl border border-line bg-surface/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/60 hover:bg-surface hover:shadow-long"
    >
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-lime/10 text-lime transition-colors group-hover:bg-lime group-hover:text-ink">
          <ServiceIcon name={service.icon} className="size-6" />
        </span>
        <span className="font-mono text-xs text-mist/70" dir="ltr">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-xl font-semibold leading-snug">{pick(service.name, locale)}</h3>
      <p className="text-mist">{pick(service.summary, locale)}</p>
      <ArrowUpRight
        aria-hidden="true"
        className="mt-auto size-5 text-lime transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
      />
    </Link>
  );
}
