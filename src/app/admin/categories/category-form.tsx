"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryFormState } from "./actions";

type CategoryDefaults = {
  name?: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export function CategoryForm({
  action,
  defaults,
  categories,
  excludeId,
}: {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  defaults?: CategoryDefaults;
  categories: { id: string; name: string }[];
  excludeId?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaults?.description ?? ""} />
      </div>
      <div>
        <Label htmlFor="parentId">Parent category</Label>
        <select
          id="parentId"
          name="parentId"
          defaultValue={defaults?.parentId ?? ""}
          className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
        >
          <option value="">None (top-level)</option>
          {categories
            .filter((c) => c.id !== excludeId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={defaults?.sortOrder ?? 0}
          />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={defaults?.isActive ?? true}
            />
            Active (visible on storefront)
          </label>
        </div>
      </div>
      <fieldset className="border-border space-y-4 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">SEO</legend>
        <div>
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={defaults?.seoTitle ?? ""} />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO description</Label>
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={defaults?.seoDescription ?? ""}
          />
        </div>
      </fieldset>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save category"}
      </Button>
    </form>
  );
}
