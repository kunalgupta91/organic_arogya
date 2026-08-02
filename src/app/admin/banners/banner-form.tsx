"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import type { BannerFormState } from "./actions";

type BannerDefaults = {
  title?: string;
  subtitle?: string | null;
  imageUrl?: string;
  mobileImageUrl?: string | null;
  linkUrl?: string | null;
  position?: string;
  sortOrder?: number;
  isActive?: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

function toDateTimeInput(date?: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 16) : "";
}

export function BannerForm({
  action,
  defaults,
}: {
  action: (state: BannerFormState, formData: FormData) => Promise<BannerFormState>;
  defaults?: BannerDefaults;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaults?.title} required />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" defaultValue={defaults?.subtitle ?? ""} />
      </div>
      <div>
        <Label>Image (desktop)</Label>
        <SingleImageUploader
          name="imageUrl"
          defaultValue={defaults?.imageUrl ?? ""}
          folder="banners"
          aspectClassName="h-40 w-full"
        />
      </div>
      <div>
        <Label>Image (mobile, optional)</Label>
        <SingleImageUploader
          name="mobileImageUrl"
          defaultValue={defaults?.mobileImageUrl ?? ""}
          folder="banners"
          aspectClassName="h-32 w-48"
        />
      </div>
      <div>
        <Label htmlFor="linkUrl">Link URL</Label>
        <Input id="linkUrl" name="linkUrl" defaultValue={defaults?.linkUrl ?? ""} placeholder="/products" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <select
            id="position"
            name="position"
            defaultValue={defaults?.position ?? "HOME_HERO"}
            className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
          >
            <option value="HOME_HERO">Home hero</option>
            <option value="HOME_SECONDARY">Home secondary</option>
            <option value="CATEGORY_TOP">Category page top</option>
          </select>
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaults?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startsAt">Starts (optional)</Label>
          <Input id="startsAt" name="startsAt" type="datetime-local" defaultValue={toDateTimeInput(defaults?.startsAt)} />
        </div>
        <div>
          <Label htmlFor="endsAt">Ends (optional)</Label>
          <Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={toDateTimeInput(defaults?.endsAt)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" value="true" defaultChecked={defaults?.isActive ?? true} />
        Active
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save banner"}
      </Button>
    </form>
  );
}
