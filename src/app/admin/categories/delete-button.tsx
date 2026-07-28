"use client";

import { useTransition } from "react";
import { deleteCategoryAction } from "./actions";

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this category? This cannot be undone.")) return;
        startTransition(async () => {
          try {
            await deleteCategoryAction(id);
          } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete category.");
          }
        });
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
