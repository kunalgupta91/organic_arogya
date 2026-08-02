"use client";

import { useTransition } from "react";
import { deleteTestimonialAction } from "./actions";

export function DeleteTestimonialButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this testimonial?")) return;
        startTransition(() => deleteTestimonialAction(id));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
