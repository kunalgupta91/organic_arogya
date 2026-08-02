import type { Metadata } from "next";
import { createCouponAction } from "../actions";
import { CouponForm } from "../coupon-form";

export const metadata: Metadata = {
  title: "Add Coupon",
};

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add coupon</h1>
      <CouponForm action={createCouponAction} />
    </div>
  );
}
