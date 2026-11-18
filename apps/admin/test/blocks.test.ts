import { getBlockDef } from "@beer/db";
import { describe, expect, it } from "vitest";
import { blockFromForm } from "../src/lib/blocks";

describe("blockFromForm", () => {
  it("reads plain and list fields and drops empty list rows", () => {
    const def = getBlockDef("home.process")!;
    const fd = new FormData();
    fd.set("title.ckb", "چۆن");
    fd.set("title.en", "How");
    fd.set("steps.0.title.en", "Discover");
    fd.set("steps.0.body.en", "We listen");
    fd.set("steps.2.title.ckb", "دروستکردن");
    const data = blockFromForm(def, fd);
    expect(data.title).toEqual({ ckb: "چۆن", en: "How", ar: "" });
    expect(data.steps).toEqual([
      { title: { ckb: "", en: "Discover", ar: "" }, body: { ckb: "", en: "We listen", ar: "" } },
      { title: { ckb: "دروستکردن", en: "", ar: "" }, body: { ckb: "", en: "", ar: "" } },
    ]);
  });
  it("handles text fields", () => {
    const def = getBlockDef("home.stats")!;
    const fd = new FormData();
    fd.set("items.0.value", "10+");
    fd.set("items.0.label.en", "Clients");
    expect(blockFromForm(def, fd)).toEqual({
      items: [{ value: "10+", label: { ckb: "", en: "Clients", ar: "" } }],
    });
  });
});
