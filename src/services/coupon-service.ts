import { prisma } from "@/lib/prisma";

export class InvalidCouponError extends Error {}

export async function validateCoupon(code: string, subtotalInr: number, productIds: string[]) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: { applicableProducts: { select: { id: true } } },
  });

  if (!coupon || !coupon.isActive) throw new InvalidCouponError("Coupon not found.");

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new InvalidCouponError("This coupon has expired.");
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw new InvalidCouponError("This coupon has reached its usage limit.");
  }
  if (subtotalInr < coupon.minOrderAmount) {
    throw new InvalidCouponError("Order does not meet the minimum amount for this coupon.");
  }
  if (coupon.applicableProducts.length > 0) {
    const applicableIds = new Set(coupon.applicableProducts.map((p) => p.id));
    const hasApplicableProduct = productIds.some((id) => applicableIds.has(id));
    if (!hasApplicableProduct) {
      throw new InvalidCouponError("This coupon does not apply to items in your cart.");
    }
  }

  const rawDiscount =
    coupon.type === "PERCENTAGE" ? Math.round((subtotalInr * coupon.value) / 100) : coupon.value;
  const discountInr = coupon.maxDiscountAmount
    ? Math.min(rawDiscount, coupon.maxDiscountAmount)
    : Math.min(rawDiscount, subtotalInr);

  return { coupon, discountInr };
}
