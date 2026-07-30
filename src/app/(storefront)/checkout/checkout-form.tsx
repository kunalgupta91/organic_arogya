"use client";

import { useActionState, useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createOrderAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_CONFIG } from "@/constants/site";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

export function CheckoutForm({
  isLoggedIn,
  userName,
  userEmail,
}: {
  isLoggedIn: boolean;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(createOrderAction, { error: null });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentResolved, setPaymentResolved] = useState(false);
  const router = useRouter();
  const isProcessing = !!state.order && !paymentResolved;

  useEffect(() => {
    if (!state.order) return;

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: state.order.totalAmount,
      currency: "INR",
      name: SITE_CONFIG.name,
      description: `Order ${state.order.orderNumber}`,
      order_id: state.order.providerOrderId,
      prefill: { name: userName ?? undefined, email: userEmail ?? undefined },
      handler: async (response: unknown) => {
        const res = response as {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        };
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: res.razorpay_order_id,
            paymentId: res.razorpay_payment_id,
            signature: res.razorpay_signature,
          }),
        });
        if (verifyRes.ok) {
          router.push(`/order-confirmation/${state.order!.orderNumber}`);
        } else {
          setPaymentError("Payment verification failed. Please contact support.");
          setPaymentResolved(true);
        }
      },
      modal: {
        ondismiss: () => setPaymentResolved(true),
      },
      theme: { color: "#2f7a4d" },
    });
    razorpay.on("payment.failed", () => {
      setPaymentError("Payment failed. Please try again.");
      setPaymentResolved(true);
    });
    razorpay.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form action={formAction} className="space-y-6">
        {!isLoggedIn && (
          <div>
            <Label htmlFor="guestEmail">Email (for order updates)</Label>
            <Input id="guestEmail" name="guestEmail" type="email" required />
          </div>
        )}

        <fieldset className="border-border space-y-4 rounded-lg border p-4">
          <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
            Shipping Address
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>
          <div>
            <Label htmlFor="line1">Address</Label>
            <Input id="line1" name="line1" required />
          </div>
          <div>
            <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
            <Input id="line2" name="line2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" name="postalCode" required />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue="India" required />
          </div>
        </fieldset>

        <div>
          <Label htmlFor="couponCode">Coupon code (optional)</Label>
          <Input id="couponCode" name="couponCode" placeholder="e.g. WELCOME10" />
        </div>

        {(state.error || paymentError) && (
          <p className="text-sm text-red-600">{state.error ?? paymentError}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isPending || isProcessing}>
          {isPending || isProcessing ? "Processing…" : "Place Order & Pay"}
        </Button>
      </form>
    </>
  );
}
