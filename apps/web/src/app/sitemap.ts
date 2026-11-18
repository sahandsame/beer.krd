import { locales } from "@beer/i18n";
import type { MetadataRoute } from "next";
import { getProjects, getServices, getSettings } from "@/lib/data";
import { WEB_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const projects = settings.workSectionEnabled ? await getProjects(false) : [];
  const paths = [
    "",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    ...(settings.workSectionEnabled ? ["/work", ...projects.map((p) => `/work/${p.slug}`)] : []),
    "/about",
    "/contact",
    "/privacy",
  ];
  return paths.map((p) => ({
    url: `${WEB_URL}/ckb${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${WEB_URL}/${l}${p}`])) },
  }));
}
