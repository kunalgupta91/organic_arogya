"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./image-uploader";
import { DocumentUploader } from "./document-uploader";
import { RelatedProductsSelect } from "./related-products-select";
import type { ProductFormState } from "./actions";

type ProductDefaults = {
  name?: string;
  sku?: string;
  categoryId?: string;
  shortDescription?: string;
  longDescription?: string;
  benefits?: string[];
  ingredients?: string[];
  dosage?: string | null;
  usage?: string | null;
  precautions?: string | null;
  sideEffects?: string | null;
  ageGroup?: string | null;
  weightValue?: number;
  weightUnit?: string;
  mrpInr?: number;
  sellingPriceInr?: number;
  mrpUsd?: number | null;
  sellingPriceUsd?: number | null;
  gstPercent?: number;
  stock?: number;
  videoUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  tags?: { name: string }[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  images?: { url: string; alt: string | null; isThumbnail: boolean }[];
  documents?: { url: string; title: string; type: "BROCHURE" | "CERTIFICATE" }[];
  relatedProductIds?: string[];
};

export function ProductForm({
  action,
  defaults,
  categories,
  products,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaults?: ProductDefaults;
  categories: { id: string; name: string }[];
  products: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const rupee = (paise?: number | null) => (paise != null ? (paise / 100).toString() : "");

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" name="name" defaultValue={defaults?.name} required />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={defaults?.sku} required />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaults?.categoryId}
            required
            className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <Label htmlFor="shortDescription">Short description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            defaultValue={defaults?.shortDescription}
            required
          />
        </div>
        <div>
          <Label htmlFor="longDescription">Long description</Label>
          <Textarea
            id="longDescription"
            name="longDescription"
            rows={6}
            defaultValue={defaults?.longDescription}
            required
          />
        </div>
      </section>

      <fieldset className="border-border space-y-4 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          Ayurvedic details
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="benefits">Benefits (one per line)</Label>
            <Textarea
              id="benefits"
              name="benefits"
              rows={4}
              defaultValue={defaults?.benefits?.join("\n")}
            />
          </div>
          <div>
            <Label htmlFor="ingredients">Ingredients (one per line)</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              rows={4}
              defaultValue={defaults?.ingredients?.join("\n")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Textarea id="dosage" name="dosage" rows={2} defaultValue={defaults?.dosage ?? ""} />
        </div>
        <div>
          <Label htmlFor="usage">Usage / directions</Label>
          <Textarea id="usage" name="usage" rows={2} defaultValue={defaults?.usage ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="precautions">Precautions</Label>
            <Textarea
              id="precautions"
              name="precautions"
              rows={3}
              defaultValue={defaults?.precautions ?? ""}
              placeholder="[NEEDS REVIEW] — confirm with a qualified Ayurvedic practitioner"
            />
          </div>
          <div>
            <Label htmlFor="sideEffects">Side effects</Label>
            <Textarea
              id="sideEffects"
              name="sideEffects"
              rows={3}
              defaultValue={defaults?.sideEffects ?? ""}
              placeholder="[NEEDS REVIEW] — confirm with a qualified Ayurvedic practitioner"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="ageGroup">Age group</Label>
          <Input id="ageGroup" name="ageGroup" defaultValue={defaults?.ageGroup ?? ""} />
        </div>
      </fieldset>

      <fieldset className="border-border grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          Weight, pricing &amp; stock
        </legend>
        <div>
          <Label htmlFor="weightValue">Weight</Label>
          <Input
            id="weightValue"
            name="weightValue"
            type="number"
            step="any"
            defaultValue={defaults?.weightValue}
            required
          />
        </div>
        <div>
          <Label htmlFor="weightUnit">Unit</Label>
          <Input
            id="weightUnit"
            name="weightUnit"
            placeholder="ml, g, kg…"
            defaultValue={defaults?.weightUnit}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={defaults?.stock ?? 0} />
        </div>
        <div>
          <Label htmlFor="mrpInr">MRP (₹)</Label>
          <Input
            id="mrpInr"
            name="mrpInr"
            type="number"
            step="0.01"
            defaultValue={rupee(defaults?.mrpInr)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sellingPriceInr">Selling price (₹)</Label>
          <Input
            id="sellingPriceInr"
            name="sellingPriceInr"
            type="number"
            step="0.01"
            defaultValue={rupee(defaults?.sellingPriceInr)}
            required
          />
        </div>
        <div>
          <Label htmlFor="gstPercent">GST %</Label>
          <Input
            id="gstPercent"
            name="gstPercent"
            type="number"
            step="0.01"
            defaultValue={defaults?.gstPercent ?? 5}
          />
        </div>
        <div>
          <Label htmlFor="mrpUsd">MRP ($, optional)</Label>
          <Input
            id="mrpUsd"
            name="mrpUsd"
            type="number"
            step="0.01"
            defaultValue={rupee(defaults?.mrpUsd)}
          />
        </div>
        <div>
          <Label htmlFor="sellingPriceUsd">Selling price ($, optional)</Label>
          <Input
            id="sellingPriceUsd"
            name="sellingPriceUsd"
            type="number"
            step="0.01"
            defaultValue={rupee(defaults?.sellingPriceUsd)}
          />
        </div>
      </fieldset>

      <fieldset className="border-border space-y-3 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          Images
        </legend>
        <ImageUploader defaultImages={defaults?.images} />
      </fieldset>

      <fieldset className="border-border space-y-3 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          PDFs (brochures &amp; certificates)
        </legend>
        <DocumentUploader defaultDocuments={defaults?.documents} />
      </fieldset>

      <div>
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input id="videoUrl" name="videoUrl" defaultValue={defaults?.videoUrl ?? ""} />
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
        <div>
          <Label htmlFor="seoKeywords">SEO keywords (comma separated)</Label>
          <Input
            id="seoKeywords"
            name="seoKeywords"
            defaultValue={defaults?.seoKeywords?.join(", ")}
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" name="tags" defaultValue={defaults?.tags?.map((t) => t.name).join(", ")} />
        </div>
      </fieldset>

      <fieldset className="border-border space-y-2 rounded-lg border p-4">
        <legend className="text-muted-foreground px-1 text-xs font-medium uppercase">
          Related products
        </legend>
        <RelatedProductsSelect products={products} defaultSelected={defaults?.relatedProductIds} />
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" value="true" defaultChecked={defaults?.isFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isTrending" value="true" defaultChecked={defaults?.isTrending} />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNewArrival"
            value="true"
            defaultChecked={defaults?.isNewArrival}
          />
          New arrival
        </label>
        <div>
          <select
            name="status"
            defaultValue={defaults?.status ?? "DRAFT"}
            className="border-border h-9 rounded-md border bg-white px-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save product"}
      </Button>
    </form>
  );
}
