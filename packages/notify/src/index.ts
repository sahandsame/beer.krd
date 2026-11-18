/**
 * Lead notifications to a Discord channel via an incoming webhook.
 */
export type LeadNotice = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  locale: string;
  sourcePage?: string | null;
  adminUrl?: string;
};

const LIME = 0xc6db62;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
/** Stop user input from pinging @everyone/@here or roles in the staff channel. */
const neutralize = (s: string) =>
  s.replace(/@(everyone|here)/gi, "@​$1").replace(/<@[!&]?\d+>/g, "[mention]");

export function buildLeadPayload(lead: LeadNotice) {
  const fields = [
    { name: "Phone", value: clip(lead.phone, 100), inline: true },
    lead.email ? { name: "Email", value: clip(lead.email, 200), inline: true } : null,
    lead.service ? { name: "Service", value: clip(lead.service, 200), inline: true } : null,
    lead.budget ? { name: "Budget", value: clip(lead.budget, 100), inline: true } : null,
    { name: "Language", value: lead.locale, inline: true },
    lead.sourcePage ? { name: "Page", value: clip(lead.sourcePage, 200), inline: true } : null,
  ].filter((f): f is { name: string; value: string; inline: boolean } => f !== null);

  return {
    username: "Beer Agency",
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: clip(`New lead: ${neutralize(lead.name)}`, 256),
        description: clip(neutralize(lead.message), 4000),
        url: lead.adminUrl,
        color: LIME,
        fields: fields.map((f) => ({ ...f, value: neutralize(f.value) })),
        timestamp: new Date().toISOString(),
        footer: { text: "beer.krd contact form" },
      },
    ],
  };
}

export function isDiscordWebhook(url: string): boolean {
  return /^https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(url);
}

/**
 * Post to Discord. Never throws: a failed notification must not lose the lead,
 * which is already saved in the database.
 */
export async function sendDiscord(
  webhookUrl: string | undefined | null,
  payload: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  if (!webhookUrl) return { ok: false, error: "No webhook configured" };
  if (!isDiscordWebhook(webhookUrl)) return { ok: false, error: "Not a Discord webhook URL" };
  try {
    const res = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok
      ? { ok: true, status: res.status }
      : { ok: false, status: res.status, error: await res.text() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
