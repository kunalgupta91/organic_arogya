import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { confirmRazorpayPayment } from "@/services/order-service";

/**
 * Backup confirmation path in case the client never calls
 * /api/payments/razorpay/verify (e.g. the browser closed right after
 * paying). confirmRazorpayPayment is idempotent, so this safely no-ops
 * if the client-side verification already ran.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  if (payload.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment?.order_id || !payment?.id) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  // Recompute the order|payment signature ourselves — we have both IDs
  // and the key secret, so confirmRazorpayPayment's own signature check
  // still applies rather than trusting this payload's shape blindly.
  const computedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${payment.order_id}|${payment.id}`)
    .digest("hex");

  try {
    await confirmRazorpayPayment(payment.order_id, payment.id, computedSignature);
  } catch (error) {
    console.error("Webhook payment confirmation failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
