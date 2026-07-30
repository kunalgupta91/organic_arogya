import type { Metadata } from "next";
import Link from "next/link";
import { getCartWithTotals } from "@/services/cart-service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "./cart-line-item";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const { items, subtotalInr, taxInr } = await getCartWithTotals();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-primary-900 text-3xl">Your Cart</h1>
        <p className="text-muted-foreground mt-3">Your cart is empty.</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Your Cart</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="border-border rounded-xl border bg-white p-4 md:col-span-2">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              productId={item.productId}
              slug={item.product.slug}
              name={item.product.name}
              imageUrl={item.product.images[0]?.url ?? "/product-placeholder.svg"}
              imageAlt={item.product.name}
              unitPriceInr={item.product.sellingPriceInr}
              quantity={item.quantity}
              stock={item.product.stock}
            />
          ))}
        </div>
        <div className="border-border h-fit space-y-3 rounded-xl border bg-white p-5">
          <h2 className="font-display text-primary-900 text-lg">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotalInr, "INR")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST</span>
            <span>{formatCurrency(taxInr, "INR")}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Shipping calculated at checkout.
          </p>
          <div className="border-border flex justify-between border-t pt-3 font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotalInr + taxInr, "INR")}</span>
          </div>
          <Link href="/checkout" className="block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
