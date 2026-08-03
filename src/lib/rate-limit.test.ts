import { describe, expect, it } from "vitest";
import { rateLimit, RateLimitError } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests up to the limit", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(() => rateLimit(key, 5, 60_000)).not.toThrow();
    }
  });

  it("throws RateLimitError once the limit is exceeded", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 60_000);
    }
    expect(() => rateLimit(key, 3, 60_000)).toThrow(RateLimitError);
  });

  it("tracks different keys independently", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    rateLimit(keyA, 1, 60_000);
    expect(() => rateLimit(keyA, 1, 60_000)).toThrow(RateLimitError);
    // keyB has its own independent bucket, so this must not throw.
    expect(() => rateLimit(keyB, 1, 60_000)).not.toThrow();
  });

  it("resets the count after the window elapses", async () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 50);
    expect(() => rateLimit(key, 1, 50)).toThrow(RateLimitError);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(() => rateLimit(key, 1, 50)).not.toThrow();
  });
});
