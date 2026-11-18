"use server";
import { db, getSiteSettings, saveSiteSettings } from "@beer/db";
import { buildLeadPayload, sendDiscord } from "@beer/notify";
import { settingsInput } from "@beer/validators";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { type ActionResult, bool, localizedFromForm, str, zodErrors } from "@/lib/form";
import { revalidateWeb } from "@/lib/revalidate";
import { requireUser } from "@/lib/session";

export async function saveSettings(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireUser("admin");
  const current = await getSiteSettings(db);
  const webhook = str(form, "discordWebhookUrl");
  const parsed = settingsInput.safeParse({
    phone: str(form, "phone"),
    whatsapp: str(form, "whatsapp"),
    viber: str(form, "viber"),
    email: str(form, "email"),
    instagram: str(form, "instagram"),
    facebook: str(form, "facebook"),
    city: localizedFromForm(form, "city"),
    address: localizedFromForm(form, "address"),
    showMap: bool(form, "showMap"),
    mapEmbedUrl: str(form, "mapEmbedUrl"),
    workSectionEnabled: bool(form, "workSectionEnabled"),
    // The webhook is a secret: the form leaves it blank unless it's being changed.
    discordWebhookUrl: bool(form, "clearWebhook") ? "" : webhook || current.discordWebhookUrl,
  });
  if (!parsed.success) return zodErrors(parsed.error);
  await saveSiteSettings(db, parsed.data);
  const changed = Object.keys(parsed.data).filter(
    (k) =>
      JSON.stringify(parsed.data[k as keyof typeof parsed.data]) !==
      JSON.stringify(current[k as keyof typeof current]),
  );
  await audit(
    user.id,
    "update",
    "settings",
    "site",
    `Changed settings: ${changed.join(", ") || "nothing"}`,
  );
  await revalidateWeb(["settings"]);
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

export async function testDiscord(_prev: ActionResult, _form: FormData): Promise<ActionResult> {
  await requireUser("admin");
  const s = await getSiteSettings(db);
  const url = s.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { error: "No Discord webhook is set yet." };
  const res = await sendDiscord(
    url,
    buildLeadPayload({
      id: "test",
      name: "Test lead from the admin",
      phone: "+964 770 000 0000",
      message: "This is a test notification. If you can read this, lead alerts are working. ✅",
      locale: "en",
      service: "Branding & Design",
      adminUrl: `${process.env.ADMIN_URL ?? "http://localhost:3100"}/leads`,
    }),
  );
  return res.ok
    ? { ok: true, message: "Test message sent to Discord." }
    : { error: `Discord rejected the message: ${res.error ?? res.status}` };
}
