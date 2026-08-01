"use client";

import { useActionState, useRef, useEffect } from "react";
import { createBlogCategoryAction } from "../blog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BlogCategoryForm() {
  const [state, formAction, isPending] = useActionState(createBlogCategoryAction, { error: null });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error && !isPending) formRef.current?.reset();
  }, [state, isPending]);

  return (
    <form ref={formRef} action={formAction} className="flex items-end gap-3">
      <div className="flex-1">
        <Input name="name" placeholder="Category name" required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding…" : "Add"}
      </Button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
