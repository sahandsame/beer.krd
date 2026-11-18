import { describe, expect, it } from "vitest";
import ar from "../messages/ar.json";
import ckb from "../messages/ckb.json";
import en from "../messages/en.json";

function keys(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj)) return [`${prefix}[${obj.length}]`];
  if (obj && typeof obj === "object")
    return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}

describe("message dictionaries", () => {
  it("Kurdish has exactly the same keys as English", () => {
    expect(keys(ckb).sort()).toEqual(keys(en).sort());
  });
  it("Arabic has exactly the same keys as English", () => {
    expect(keys(ar).sort()).toEqual(keys(en).sort());
  });
});
