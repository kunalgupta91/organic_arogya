"use client";

import { useTransition } from "react";
import { deleteFaqAction } from "./actions";

export function DeleteFaqButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this FAQ?")) return;
        startTransition(() => deleteFaqAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
