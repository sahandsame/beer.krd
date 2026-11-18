import { defaultSettings } from "@beer/db/seed-data";
import { describe, expect, it } from "vitest";
import { contactLinks } from "../src/lib/contact-links";

describe("contactLinks", () => {
  it("builds links from the default settings", () => {
    const l = contactLinks(defaultSettings);
    expect(l.tel).toBe("tel:+9647734187963");
    expect(l.whatsapp).toBe("https://wa.me/9647734187963");
    expect(l.viber).toBe("viber://chat?number=%2B9647734187963");
    expect(l.instagram).toBeNull();
    expect(l.facebook).toContain("facebook.com");
  });
});
