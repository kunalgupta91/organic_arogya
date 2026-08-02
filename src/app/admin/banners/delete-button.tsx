"use client";

import { useTransition } from "react";
import { deleteBannerAction } from "./actions";

export function DeleteBannerButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this banner?")) return;
        startTransition(() => deleteBannerAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
