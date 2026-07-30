"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { removeFromCartAction, updateCartItemAction } from "./actions";

type CartLineItemProps = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  imageAlt: string;
  unitPriceInr: number;
  quantity: number;
  stock: number;
};

export function CartLineItem({
  productId,
  slug,
  name,
  imageUrl,
  imageAlt,
  unitPriceInr,
  quantity,
  stock,
}: CartLineItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function updateQuantity(next: number) {
    startTransition(async () => {
      await updateCartItemAction(productId, next);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeFromCartAction(productId);
      router.refresh();
    });
  }

  return (
    <div className="border-border flex gap-4 border-b py-4 last:border-b-0">
      <Link href={`/products/${slug}`} className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${slug}`} className="text-sm font-medium hover:underline">
            {name}
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={isPending}
            aria-label="Remove item"
            className="text-muted-foreground hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="border-border flex items-center rounded-full border">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={isPending}
              className="p-2"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(Math.min(stock, quantity + 1))}
              disabled={isPending || quantity >= stock}
              className="p-2"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-sm font-semibold">
            {formatCurrency(unitPriceInr * quantity, "INR")}
          </span>
        </div>
      </div>
    </div>
  );
}
