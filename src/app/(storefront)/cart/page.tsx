import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Your Cart</h1>
      <p className="text-muted-foreground mt-3">
        Cart and checkout are launching in the next build phase.
      </p>
      <Link href="/products" className="mt-6 inline-block">
        <Button>Continue shopping</Button>
      </Link>
    </div>
  );
}
