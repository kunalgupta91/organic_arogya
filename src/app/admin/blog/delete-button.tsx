"use client";

import { useTransition } from "react";
import { deleteBlogAction } from "./actions";

export function DeleteBlogButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        startTransition(() => deleteBlogAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
