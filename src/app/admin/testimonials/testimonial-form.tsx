"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import type { TestimonialFormState } from "./actions";

type TestimonialDefaults = {
  name?: string;
  designation?: string | null;
  company?: string | null;
  content?: string;
  rating?: number | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
};

export function TestimonialForm({
  action,
  defaults,
}: {
  action: (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  defaults?: TestimonialDefaults;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={defaults?.name} required />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" name="designation" defaultValue={defaults?.designation ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={defaults?.company ?? ""} />
        </div>
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={defaults?.rating ?? undefined} />
        </div>
      </div>
      <div>
        <Label htmlFor="content">Testimonial</Label>
        <Textarea id="content" name="content" rows={4} defaultValue={defaults?.content} required />
      </div>
      <div>
        <Label>Photo</Label>
        <SingleImageUploader
          name="imageUrl"
          defaultValue={defaults?.imageUrl ?? ""}
          folder="testimonials"
          aspectClassName="h-24 w-24 rounded-full"
        />
      </div>
      <div>
        <Label htmlFor="videoUrl">Video URL (optional)</Label>
        <Input id="videoUrl" name="videoUrl" defaultValue={defaults?.videoUrl ?? ""} />
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
        {isPending ? "Saving…" : "Save testimonial"}
      </Button>
    </form>
  );
}
