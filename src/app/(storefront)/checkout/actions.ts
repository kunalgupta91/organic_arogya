"use server";

import { auth } from "@/lib/auth";
import { checkoutSchema } from "@/validations/checkout";
import { createOrderFromCart } from "@/services/order-service";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";

export type CheckoutState = {
  error: string | null;
  order?: { orderNumber: string; totalAmount: number; providerOrderId: string };
};

export async function createOrderAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  try {
    rateLimit(`checkout:${await getClientIp()}`, 10, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { error: "Too many order attempts. Please try again later." };
    }
    throw error;
  }

  const session = await auth();
  const raw = Object.fromEntries(formData);

  const parsed = checkoutSchema.safeParse({
    guestEmail: raw.guestEmail,
    shipping: {
      fullName: raw.fullName,
      phone: raw.phone,
      line1: raw.line1,
      line2: raw.line2,
      city: raw.city,
      state: raw.state,
      postalCode: raw.postalCode,
      country: raw.country,
    },
    couponCode: raw.couponCode,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  if (!session?.user && !parsed.data.guestEmail) {
    return { error: "Email is required for guest checkout." };
  }

  try {
    const { order, providerOrderId } = await createOrderFromCart({
      userId: session?.user?.id,
      guestEmail: parsed.data.guestEmail,
      shipping: parsed.data.shipping,
      couponCode: parsed.data.couponCode,
    });

    return {
      error: null,
      order: { orderNumber: order.orderNumber, totalAmount: order.totalAmount, providerOrderId },
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not place order." };
  }
}

