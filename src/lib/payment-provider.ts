/**
 * Provider-agnostic payment seam. Razorpay is the only live implementation
 * for MVP (India market). Adding Stripe for international orders later
 * means implementing this interface and switching on Order.currency —
 * no changes needed elsewhere in the checkout flow.
 */
export interface PaymentProvider {
  readonly name: "RAZORPAY" | "STRIPE";
  createOrder(params: {
    amountInSmallestUnit: number;
    currency: string;
    receipt: string;
  }): Promise<{ providerOrderId: string }>;
}

class RazorpayProvider implements PaymentProvider {
  readonly name = "RAZORPAY" as const;

  async createOrder(params: { amountInSmallestUnit: number; currency: string; receipt: string }) {
    const { getRazorpayClient } = await import("./razorpay");
    const order = await getRazorpayClient().orders.create({
      amount: params.amountInSmallestUnit,
      currency: params.currency,
      receipt: params.receipt,
    });
    return { providerOrderId: order.id };
  }
}

const providers: Record<string, PaymentProvider> = {
  INR: new RazorpayProvider(),
};

/** Returns null if no live provider is configured for the currency yet. */
export function getPaymentProvider(currency: string): PaymentProvider | null {
  return providers[currency] ?? null;
}
