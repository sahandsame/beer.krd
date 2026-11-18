import { BMark } from "@beer/ui/brand";
import { buttonClasses } from "@beer/ui/components/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <BMark shadow className="h-28 w-auto text-lime opacity-90" />
      <p className="font-mono text-sm tracking-[0.4em] text-lime" dir="ltr">
        404
      </p>
      <h1 className="max-w-xl text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <p className="text-mist">{t("body")}</p>
      <Link href="/" className={buttonClasses()}>
        {t("home")}
      </Link>
    </section>
  );
}
