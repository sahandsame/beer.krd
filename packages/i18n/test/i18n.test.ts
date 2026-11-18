import { describe, expect, it } from "vitest";
import { dir, isLocale, localizedFromForm, missingLocales, pick } from "../src";

describe("pick", () => {
  it("returns the requested locale", () => {
    expect(pick({ ckb: "سڵاو", en: "Hello", ar: "مرحبا" }, "en")).toBe("Hello");
  });
  it("falls back to Kurdish when the translation is missing", () => {
    expect(pick({ ckb: "سڵاو", en: "  ", ar: "" }, "ar")).toBe("سڵاو");
  });
  it("falls back to any translation when Kurdish is missing too", () => {
    expect(pick({ ckb: "", en: "", ar: "مرحبا" }, "en")).toBe("مرحبا");
  });
  it("handles null", () => {
    expect(pick(null, "en")).toBe("");
  });
});

describe("helpers", () => {
  it("reports missing locales", () => {
    expect(missingLocales({ ckb: "x", en: "", ar: " " })).toEqual(["en", "ar"]);
  });
  it("knows text direction", () => {
    expect(dir("ckb")).toBe("rtl");
    expect(dir("ar")).toBe("rtl");
    expect(dir("en")).toBe("ltr");
  });
  it("validates locales", () => {
    expect(isLocale("ckb")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
  it("reads localized fields from FormData", () => {
    const fd = new FormData();
    fd.set("title.ckb", " ناونیشان ");
    fd.set("title.en", "Title");
    expect(localizedFromForm(fd, "title")).toEqual({ ckb: "ناونیشان", en: "Title", ar: "" });
  });
});
