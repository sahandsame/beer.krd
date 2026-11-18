import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../src/lib/rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit per window, then blocks, then resets", () => {
    const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(rl.check("ip", 0)).toBe(true);
    expect(rl.check("ip", 10)).toBe(true);
    expect(rl.check("ip", 20)).toBe(false);
    expect(rl.check("other", 20)).toBe(true);
    expect(rl.check("ip", 1001)).toBe(true);
  });
});
