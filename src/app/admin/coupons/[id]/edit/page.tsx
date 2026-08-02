import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCouponAction } from "../../actions";
import { CouponForm } from "../../coupon-form";

export const metadata: Metadata = {
  title: "Edit Coupon",
};

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) notFound();

  const boundAction = updateCouponAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit coupon</h1>
      <CouponForm action={boundAction} defaults={coupon} />
    </div>
  );
}
