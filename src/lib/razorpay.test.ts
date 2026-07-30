import crypto from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { verifyPaymentSignature, verifyWebhookSignature } from "./razorpay";

describe("verifyPaymentSignature", () => {
  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = "test_key_secret";
  });

  it("accepts a correctly computed signature", () => {
    const orderId = "order_abc123";
    const paymentId = "pay_xyz789";
    const signature = crypto
      .createHmac("sha256", "test_key_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(verifyPaymentSignature(orderId, paymentId, signature)).toBe(true);
  });

  it("rejects a tampered signature", () => {
    const orderId = "order_abc123";
    const paymentId = "pay_xyz789";
    const signature = crypto
      .createHmac("sha256", "test_key_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Attacker cannot just replay a valid signature for a different order.
    expect(verifyPaymentSignature("order_different", paymentId, signature)).toBe(false);
  });

  it("rejects a signature computed with the wrong secret", () => {
    const orderId = "order_abc123";
    const paymentId = "pay_xyz789";
    const signature = crypto
      .createHmac("sha256", "wrong_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(verifyPaymentSignature(orderId, paymentId, signature)).toBe(false);
  });

  it("does not throw on malformed/short signature input", () => {
    expect(() => verifyPaymentSignature("order_abc123", "pay_xyz789", "not-a-real-signature")).not.toThrow();
    expect(verifyPaymentSignature("order_abc123", "pay_xyz789", "not-a-real-signature")).toBe(false);
  });

  it("does not throw on empty signature", () => {
    expect(verifyPaymentSignature("order_abc123", "pay_xyz789", "")).toBe(false);
  });
});

describe("verifyWebhookSignature", () => {
  beforeEach(() => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret";
  });

  it("accepts a correctly computed signature over the raw body", () => {
    const rawBody = JSON.stringify({ event: "payment.captured" });
    const signature = crypto
      .createHmac("sha256", "test_webhook_secret")
      .update(rawBody)
      .digest("hex");

    expect(verifyWebhookSignature(rawBody, signature)).toBe(true);
  });

  it("rejects a signature if the body was tampered with after signing", () => {
    const originalBody = JSON.stringify({ event: "payment.captured", amount: 100 });
    const signature = crypto
      .createHmac("sha256", "test_webhook_secret")
      .update(originalBody)
      .digest("hex");
    const tamperedBody = JSON.stringify({ event: "payment.captured", amount: 999999 });

    expect(verifyWebhookSignature(tamperedBody, signature)).toBe(false);
  });
});
