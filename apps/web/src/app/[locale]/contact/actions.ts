"use server";
import { db, getSiteSettings } from "@beer/db";
import { createLead } from "@beer/db/queries";
import { isLocale, pick } from "@beer/i18n";
import { buildLeadPayload, sendDiscord } from "@beer/notify";
import { leadInput } from "@beer/validators";
import { headers } from "next/headers";
import { ADMIN_URL } from "@/lib/env";
import { createRateLimiter } from "@/lib/rate-limit";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Record<string, string>;
      formError?: string;
      values?: Record<string, string>;
    };

// 5 submissions per IP per 10 minutes.
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    ["name", "phone", "email", "serviceSlug", "budget", "message"].map((k) => [
      k,
      String(form.get(k) ?? ""),
    ]),
  );

  // Honeypot: real people never see or fill this field.
  if (String(form.get("website") ?? "").trim()) return { status: "success" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!limiter.check(ip)) return { status: "error", formError: "rateLimited", values };

  const locale = String(form.get("locale") ?? "");
  const parsed = leadInput.safeParse({
    ...values,
    email: values.email || undefined,
    serviceSlug: values.serviceSlug || undefined,
    budget: values.budget || undefined,
    locale: isLocale(locale) ? locale : "ckb",
    sourcePage: String(form.get("sourcePage") ?? "") || undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors, values };
  }

  try {
    const { lead, service } = await createLead(db, parsed.data);
    const settings = await getSiteSettings(db);
    await sendDiscord(
      settings.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL,
      buildLeadPayload({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        service: service ? pick(service.name, "en") : null,
        budget: lead.budget,
        message: lead.message,
        locale: lead.locale,
        sourcePage: lead.sourcePage,
        adminUrl: `${ADMIN_URL}/leads/${lead.id}`,
      }),
    );
    return { status: "success" };
  } catch (e) {
    console.error("[contact] failed to save lead", e);
    return { status: "error", formError: "generic", values };
  }
}
