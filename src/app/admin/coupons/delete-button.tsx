"use client";

import { useTransition } from "react";
import { deleteCouponAction } from "./actions";

export function DeleteCouponButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this coupon?")) return;
        startTransition(() => deleteCouponAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
