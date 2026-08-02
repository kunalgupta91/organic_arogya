"use client";

import { useTransition } from "react";
import { deleteReviewAction } from "./actions";

export function DeleteReviewButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this review?")) return;
        startTransition(() => deleteReviewAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
