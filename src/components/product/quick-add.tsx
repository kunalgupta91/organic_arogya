"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/app/(storefront)/cart/actions";

export function QuickAdd({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  if (stock === 0) {
    return (
      <div className="border-border text-muted-foreground flex h-10 w-full items-center justify-center rounded-full border text-xs font-medium">
        Out of stock
      </div>
    );
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      await addToCartAction(productId, quantity);
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    });
  }

  return (
    <div className="flex h-10 items-stretch gap-2">
      <div className="border-border flex items-center rounded-full border">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setQuantity((q) => Math.max(1, q - 1));
          }}
          className="text-foreground px-2.5 py-2"
          aria-label="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span className="w-4 text-center text-xs">{quantity}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setQuantity((q) => Math.min(stock, q + 1));
          }}
          className="text-foreground px-2.5 py-2"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isPending}
        className="bg-accent-500 hover:bg-accent-600 flex flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-medium text-white transition-colors disabled:opacity-50"
      >
        {added ? <Check size={14} /> : <ShoppingCart size={14} />}
        {added ? "Added" : "Add"}
      </button>
    </div>
  );
}
