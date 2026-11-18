import { describe, expect, it } from "vitest";
import { alternates } from "../src/lib/seo";

describe("alternates", () => {
  it("builds canonical and hreflang links", () => {
    const a = alternates("en", "/services");
    expect(a.canonical).toBe("http://localhost:3000/en/services");
    expect(a.languages).toMatchObject({
      ckb: "http://localhost:3000/ckb/services",
      ar: "http://localhost:3000/ar/services",
      "x-default": "http://localhost:3000/ckb/services",
    });
  });
  it("handles the home page", () => {
    expect(alternates("ckb", "/").canonical).toBe("http://localhost:3000/ckb");
  });
});
