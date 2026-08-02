"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CouponFormState } from "./actions";

type CouponDefaults = {
  code?: string;
  type?: "PERCENTAGE" | "FLAT";
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
};

function toDateInput(date?: Date) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export function CouponForm({
  action,
  defaults,
}: {
  action: (state: CouponFormState, formData: FormData) => Promise<CouponFormState>;
  defaults?: CouponDefaults;
}) {
  const [state, formAction, isPending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Coupon code</Label>
          <Input id="code" name="code" defaultValue={defaults?.code} required />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            defaultValue={defaults?.type ?? "PERCENTAGE"}
            className="border-border h-11 w-full rounded-lg border bg-white px-4 text-sm"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat amount (₹)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">Value</Label>
          <Input id="value" name="value" type="number" step="any" defaultValue={defaults?.value} required />
        </div>
        <div>
          <Label htmlFor="minOrderAmount">Min order (₹)</Label>
          <Input
            id="minOrderAmount"
            name="minOrderAmount"
            type="number"
            step="0.01"
            defaultValue={defaults?.minOrderAmount ? defaults.minOrderAmount / 100 : 0}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxDiscountAmount">Max discount (₹, optional)</Label>
          <Input
            id="maxDiscountAmount"
            name="maxDiscountAmount"
            type="number"
            step="0.01"
            defaultValue={defaults?.maxDiscountAmount ? defaults.maxDiscountAmount / 100 : undefined}
          />
        </div>
        <div>
          <Label htmlFor="usageLimit">Usage limit (optional)</Label>
          <Input id="usageLimit" name="usageLimit" type="number" defaultValue={defaults?.usageLimit ?? undefined} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validFrom">Valid from</Label>
          <Input
            id="validFrom"
            name="validFrom"
            type="date"
            defaultValue={toDateInput(defaults?.validFrom)}
            required
          />
        </div>
        <div>
          <Label htmlFor="validUntil">Valid until</Label>
          <Input
            id="validUntil"
            name="validUntil"
            type="date"
            defaultValue={toDateInput(defaults?.validUntil)}
            required
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" value="true" defaultChecked={defaults?.isActive ?? true} />
        Active
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save coupon"}
      </Button>
    </form>
  );
}
