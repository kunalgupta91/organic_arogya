"use client";

import { useTransition } from "react";
import { deleteProductAction } from "./actions";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this product? This cannot be undone.")) return;
        startTransition(async () => {
          try {
            await deleteProductAction(id);
          } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete product.");
          }
        });
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
