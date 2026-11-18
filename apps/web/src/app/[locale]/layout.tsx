import "../globals.css";
import { type Locale, localeMeta, pick } from "@beer/i18n";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getBlocks, getSettings } from "@/lib/data";
import { WEB_URL } from "@/lib/env";
import { alternates } from "@/lib/seo";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });
// Vazirmatn covers Sorani letters (ڕ ڵ ۆ ێ ە ڤ) as well as Arabic.
/** Backslash + u003c: the JSON escape for "<". */
const LT_ESCAPE = String.fromCharCode(92) + "u003c";

const arabic = Vazirmatn({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

// Content comes from the database (cached, revalidated on admin saves), so render on request.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#06332E", colorScheme: "dark" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { "seo.default": seo } = await getBlocks(["seo.default"]);
  const title = pick(seo.title, locale);
  const description = pick(seo.description, locale);
  return {
    metadataBase: new URL(WEB_URL),
    title: {
      default: title,
      template: `%s | ${(await getTranslations({ locale, namespace: "meta" }))("siteName")}`,
    },
    description,
    alternates: alternates(locale, "/"),
    openGraph: {
      type: "website",
      siteName: "Beer Agency",
      title,
      description,
      locale: localeMeta[locale].ogLocale,
      url: `${WEB_URL}/${locale}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const settings = await getSettings();
  const t = await getTranslations("nav");
  const meta = localeMeta[locale as Locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Beer Agency",
    alternateName: ["ئاژانسی بیر", "وكالة بير"],
    url: WEB_URL,
    logo: `${WEB_URL}/icon.svg`,
    slogan: "For those who think deeply.",
    telephone: settings.phone || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Erbil",
      addressRegion: "Kurdistan Region",
      addressCountry: "IQ",
    },
    sameAs: [settings.facebook, settings.instagram].filter(Boolean),
  };

  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`${display.variable} ${code.variable} ${arabic.variable}`}
    >
      <body className="min-h-dvh bg-forest text-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <SiteHeader workEnabled={settings.workSectionEnabled} />
          <main id="main">{children}</main>
          <SiteFooter
            locale={locale as Locale}
            settings={settings}
            workEnabled={settings.workSectionEnabled}
          />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          // Escape "<" so a value like "</script>" in admin-edited settings cannot close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", LT_ESCAPE) }}
        />
        {umamiSrc && umamiId && (
          <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
