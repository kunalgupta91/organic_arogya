"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { CoverImageUploader } from "./cover-image-uploader";
import type { BlogFormState } from "./actions";

type BlogDefaults = {
  title?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  categoryId?: string | null;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  scheduledAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  tags?: { name: string }[];
};

export function BlogForm({
  action,
  defaults,
  categories,
}: {
  action: (state: BlogFormState, formData: FormData) => Promise<BlogFormState>;
  defaults?: BlogDefaults;
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const [status, setStatus] = useState(defaults?.status ?? "DRAFT");

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaults?.title} required />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={defaults?.excerpt ?? ""} />
      </div>

      <div>
        <Label>Cover image</Label>
        <CoverImageUploader defaultValue={defaults?.coverImage ?? ""} />
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={defaults?.categoryId ?? ""}
          className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
        >
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Content</Label>
        <RichTextEditor name="content" defaultValue={defaults?.content} />
      </div>

      <fieldset className="border-border grid grid-cols-2 gap-4 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          Publishing
        </legend>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        {status === "SCHEDULED" && (
          <div>
            <Label htmlFor="scheduledAt">Publish at</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              defaultValue={
                defaults?.scheduledAt
                  ? new Date(defaults.scheduledAt).toISOString().slice(0, 16)
                  : undefined
              }
            />
          </div>
        )}
      </fieldset>

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
        <div>
          <Label htmlFor="seoKeywords">SEO keywords (comma separated)</Label>
          <Input id="seoKeywords" name="seoKeywords" defaultValue={defaults?.seoKeywords?.join(", ")} />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" name="tags" defaultValue={defaults?.tags?.map((t) => t.name).join(", ")} />
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save post"}
      </Button>
    </form>
  );
}
