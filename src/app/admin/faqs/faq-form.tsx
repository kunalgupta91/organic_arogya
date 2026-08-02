"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FaqFormState } from "./actions";

type FaqDefaults = {
  question?: string;
  answer?: string;
  category?: string;
  productId?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

export function FaqForm({
  action,
  defaults,
  products,
}: {
  action: (state: FaqFormState, formData: FormData) => Promise<FaqFormState>;
  defaults?: FaqDefaults;
  products: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={defaults?.question} required />
      </div>
      <div>
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" rows={4} defaultValue={defaults?.answer} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={defaults?.category ?? "General"} />
        </div>
        <div>
          <Label htmlFor="productId">Product (optional)</Label>
          <select
            id="productId"
            name="productId"
            defaultValue={defaults?.productId ?? ""}
            className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
          >
            <option value="">General (not product-specific)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaults?.sortOrder ?? 0} />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={defaults?.isPublished ?? true}
            />
            Published
          </label>
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save FAQ"}
      </Button>
    </form>
  );
}
