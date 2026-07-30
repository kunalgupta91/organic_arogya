import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmRazorpayPayment, PaymentVerificationError } from "@/services/order-service";

const bodySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await confirmRazorpayPayment(parsed.data.orderId, parsed.data.paymentId, parsed.data.signature);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof PaymentVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
