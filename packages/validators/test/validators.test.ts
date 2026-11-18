import { describe, expect, it } from "vitest";
import { leadInput, serviceInput, settingsInput, slug, slugify } from "../src";

const L = (ckb: string, en = "", ar = "") => ({ ckb, en, ar });

describe("leadInput", () => {
  const base = {
    name: "Aram",
    phone: "+964 773 418 7963",
    message: "We need a new website for our restaurant.",
    locale: "ckb",
  };
  it("accepts a valid lead and drops empty optional fields", () => {
    const r = leadInput.parse({ ...base, email: "", serviceSlug: "" });
    expect(r.email).toBeUndefined();
    expect(r.serviceSlug).toBeUndefined();
  });
  it("rejects an invalid phone", () => {
    const r = leadInput.safeParse({ ...base, phone: "call me" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe("phoneInvalid");
  });
  it("rejects a bad email", () => {
    expect(leadInput.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });
  it("ignores an unknown budget", () => {
    expect(leadInput.parse({ ...base, budget: "1m" }).budget).toBeUndefined();
  });
});

describe("slugs", () => {
  it("validates", () => {
    expect(slug.safeParse("social-media").success).toBe(true);
    expect(slug.safeParse("Social Media").success).toBe(false);
  });
  it("slugifies", () => {
    expect(slugify("  Photo & Video Production! ")).toBe("photo-video-production");
  });
});

describe("serviceInput", () => {
  it("requires Kurdish name", () => {
    const r = serviceInput.safeParse({
      slug: "ads",
      published: true,
      name: L("", "Ads"),
      summary: L(""),
      body: L(""),
      deliverables: L(""),
    });
    expect(r.success).toBe(false);
  });
});

describe("settingsInput", () => {
  const base = {
    phone: "",
    whatsapp: "",
    viber: "",
    email: "",
    instagram: "",
    facebook: "",
    city: L("هەولێر"),
    address: L(""),
    showMap: false,
    mapEmbedUrl: "",
    workSectionEnabled: false,
  };
  it("accepts a Discord webhook", () => {
    expect(
      settingsInput.safeParse({
        ...base,
        discordWebhookUrl: "https://discord.com/api/webhooks/1/abc",
      }).success,
    ).toBe(true);
  });
  it("rejects other webhook hosts", () => {
    expect(
      settingsInput.safeParse({ ...base, discordWebhookUrl: "https://evil.example/api/webhooks/1" })
        .success,
    ).toBe(false);
  });
});
