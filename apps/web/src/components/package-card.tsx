import { type Locale, type Localized, pick } from "@beer/i18n";
import { cn } from "@beer/ui/cn";
import { buttonClasses } from "@beer/ui/components/button";
import { Check, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type PackageData = {
  name: Localized;
  price: Localized;
  delivery: Localized;
  summary: Localized;
  features: Localized;
  budget: string;
  featured: string;
};

export const isFeatured = (p: Pick<PackageData, "featured">) =>
  /^(yes|true|1|بەڵێ|نعم)$/i.test(p.featured.trim());

/** Contact link that preselects web/software, the package's budget range and remembers the package. */
export function packageHref(p: PackageData, index: number) {
  return {
    pathname: "/contact" as const,
    query: {
      service: "web-software",
      package: String(index + 1),
      ...(p.budget ? { budget: p.budget } : {}),
    },
  };
}

export function PackageCard({
  pkg,
  index,
  locale,
  labels,
}: {
  pkg: PackageData;
  index: number;
  locale: Locale;
  labels: { delivery: string; choose: string; featured: string };
}) {
  const featured = isFeatured(pkg);
  const features = pick(pkg.features, locale).split("\n").filter(Boolean);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-5 rounded-2xl border p-7",
        featured ? "border-lime bg-surface shadow-long" : "border-line bg-surface/50",
      )}
    >
      {featured && (
        <span className="absolute -top-3 start-7 rounded-full bg-lime px-3 py-0.5 text-xs font-semibold text-ink">
          {labels.featured}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">{pick(pkg.name, locale)}</h3>
        <span className="font-mono text-xs text-mist/70" dir="ltr">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="text-3xl font-semibold text-lime" dir="auto">
        {pick(pkg.price, locale)}
      </p>
      <p className="text-mist">{pick(pkg.summary, locale)}</p>
      <ul className="flex flex-col gap-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
        <p className="flex items-center gap-2 text-sm text-mist">
          <Clock className="size-4" aria-hidden="true" />
          {labels.delivery}: <span className="text-paper">{pick(pkg.delivery, locale)}</span>
        </p>
        <Link
          href={packageHref(pkg, index)}
          className={buttonClasses({
            variant: featured ? "primary" : "outline",
            className: "w-full",
          })}
        >
          {labels.choose}
        </Link>
      </div>
    </article>
  );
}
