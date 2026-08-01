"use client";

import { useTransition } from "react";
import { deleteBlogCategoryAction } from "../blog/actions";

export function DeleteBlogCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this category?")) return;
        startTransition(async () => {
          try {
            await deleteBlogCategoryAction(id);
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
