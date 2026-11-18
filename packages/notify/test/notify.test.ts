import { describe, expect, it, vi } from "vitest";
import { buildLeadPayload, isDiscordWebhook, sendDiscord } from "../src";

const hook = "https://discord.com/api/webhooks/123456/abc-DEF_9";

describe("buildLeadPayload", () => {
  it("builds an embed and blocks mass mentions", () => {
    const p = buildLeadPayload({
      id: "1",
      name: "@everyone Aram",
      phone: "0773",
      message: "hi <@&999> please call",
      locale: "ckb",
      service: "Branding & Design",
    });
    expect(p.allowed_mentions.parse).toEqual([]);
    const e = p.embeds[0]!;
    expect(e.title).not.toContain("@everyone");
    expect(e.description).toContain("[mention]");
    expect(e.fields.map((f) => f.name)).toEqual(["Phone", "Service", "Language"]);
  });
  it("truncates very long messages", () => {
    const p = buildLeadPayload({
      id: "1",
      name: "A",
      phone: "1",
      message: "x".repeat(5000),
      locale: "en",
    });
    expect(p.embeds[0]!.description.length).toBe(4000);
  });
});

describe("sendDiscord", () => {
  it("validates the URL", async () => {
    expect(isDiscordWebhook(hook)).toBe(true);
    expect(isDiscordWebhook("https://example.com/api/webhooks/1/a")).toBe(false);
    expect((await sendDiscord("https://example.com/x", {})).ok).toBe(false);
    expect((await sendDiscord(undefined, {})).error).toMatch(/No webhook/);
  });
  it("posts JSON and never throws", async () => {
    const ok = vi.fn(async () => new Response(null, { status: 204 }));
    expect(await sendDiscord(hook, { a: 1 }, ok as unknown as typeof fetch)).toEqual({
      ok: true,
      status: 204,
    });
    expect(ok).toHaveBeenCalledOnce();
    const boom = vi.fn(async () => {
      throw new Error("network down");
    });
    expect(await sendDiscord(hook, {}, boom as unknown as typeof fetch)).toEqual({
      ok: false,
      error: "network down",
    });
  });
});
