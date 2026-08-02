import { prisma } from "@/lib/prisma";
import type { CouponInput } from "@/validations/coupon";

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

export async function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(input: CouponInput) {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw new Error(`Coupon code "${input.code}" already exists.`);

  return prisma.coupon.create({
    data: {
      code: input.code,
      type: input.type,
      value: input.value,
      minOrderAmount: input.minOrderAmount,
      maxDiscountAmount: input.maxDiscountAmount ?? null,
      usageLimit: input.usageLimit ?? null,
      validFrom: new Date(input.validFrom),
      validUntil: new Date(input.validUntil),
      isActive: input.isActive,
    },
  });
}

export async function updateCoupon(id: string, input: CouponInput) {
  return prisma.coupon.update({
    where: { id },
    data: {
      code: input.code,
      type: input.type,
      value: input.value,
      minOrderAmount: input.minOrderAmount,
      maxDiscountAmount: input.maxDiscountAmount ?? null,
      usageLimit: input.usageLimit ?? null,
      validFrom: new Date(input.validFrom),
      validUntil: new Date(input.validUntil),
      isActive: input.isActive,
    },
  });
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
}
