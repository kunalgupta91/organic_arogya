"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/app/(storefront)/cart/actions";

export function AddToCartButtons({
  productId,
  stock,
  maxQuantity = 10,
}: {
  productId: string;
  stock: number;
  maxQuantity?: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const limit = Math.min(stock, maxQuantity);

  function handleAddToCart() {
    startTransition(async () => {
      await addToCartAction(productId, quantity);
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    });
  }

  function handleBuyNow() {
    startTransition(async () => {
      await addToCartAction(productId, quantity);
      router.push("/checkout");
    });
  }

  if (stock === 0) {
    return (
      <Button size="lg" disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="border-border flex items-center rounded-full border">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-foreground p-2.5"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
          className="text-foreground p-2.5"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
      <Button size="lg" onClick={handleAddToCart} disabled={isPending}>
        {added ? "Added ✓" : "Add to Cart"}
      </Button>
      <Button size="lg" variant="secondary" onClick={handleBuyNow} disabled={isPending}>
        Buy Now
      </Button>
    </div>
  );
}
