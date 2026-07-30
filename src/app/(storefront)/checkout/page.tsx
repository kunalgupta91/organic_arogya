import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCartWithTotals } from "@/services/cart-service";
import { formatCurrency } from "@/lib/utils";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const [session, { items, subtotalInr, taxInr }] = await Promise.all([
    auth(),
    getCartWithTotals(),
  ]);

  if (items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Checkout</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CheckoutForm
            isLoggedIn={!!session?.user}
            userName={session?.user?.name}
            userEmail={session?.user?.email}
          />
        </div>
        <div className="border-border h-fit space-y-3 rounded-xl border bg-white p-5">
          <h2 className="font-display text-primary-900 text-lg">Order Summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.sellingPriceInr * item.quantity, "INR")}</span>
              </li>
            ))}
          </ul>
          <div className="border-border flex justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotalInr, "INR")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST</span>
            <span>{formatCurrency(taxInr, "INR")}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Shipping is calculated and applied when your order is placed. International
            (non-India) addresses aren&apos;t supported for checkout yet — see our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
