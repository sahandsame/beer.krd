import { describe, expect, it } from "vitest";
import { toCsv } from "../src/lib/csv";

describe("toCsv", () => {
  it("quotes commas, quotes and newlines", () => {
    expect(toCsv([{ a: 'He said "hi", ok', b: "line1\nline2" }], ["a", "b"])).toBe(
      'a,b\r\n"He said ""hi"", ok","line1\nline2"',
    );
  });
  it("neutralizes spreadsheet formulas", () => {
    expect(toCsv([{ a: "=HYPERLINK(1)" }], ["a"])).toBe("a\r\n'=HYPERLINK(1)");
    expect(toCsv([{ a: "+964 773" }], ["a"])).toBe("a\r\n'+964 773");
  });
  it("handles nulls and dates", () => {
    expect(toCsv([{ a: null, d: new Date("2026-01-02T03:04:05Z") }], ["a", "d"])).toBe(
      "a,d\r\n,2026-01-02T03:04:05.000Z",
    );
  });
});
