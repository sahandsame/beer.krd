import type { MetadataRoute } from "next";
import { WEB_URL } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${WEB_URL}/sitemap.xml`,
    host: WEB_URL,
  };
}
