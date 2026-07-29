"use client";

import { useActionState } from "react";
import { submitBulkOrderAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BulkOrderForm({
  productId,
  productName,
}: {
  productId?: string;
  productName?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitBulkOrderAction, {
    success: false,
    error: null,
  });

  if (state.success) {
    return (
      <p className="text-primary-700 bg-primary-50 rounded-lg p-4 text-sm">
        Thanks for your enquiry — our team will reach out with a quote shortly.
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {productId && <input type="hidden" name="productId" value={productId} />}
      {productName && (
        <p className="text-muted-foreground text-sm">
          Enquiring about: <span className="text-foreground font-medium">{productName}</span>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" name="company" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="gstNumber">GST Number (optional)</Label>
          <Input id="gstNumber" name="gstNumber" />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min={1} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue="India" required />
        </div>
      </div>
      <div>
        <Label htmlFor="remarks">Remarks (optional)</Label>
        <Textarea id="remarks" name="remarks" rows={3} />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit enquiry"}
      </Button>
    </form>
  );
}
