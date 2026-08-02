"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { couponSchema } from "@/validations/coupon";
import { createCoupon, deleteCoupon, updateCoupon } from "@/services/coupon-service";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
}

export type CouponFormState = { error: string | null };

export async function createCouponAction(
  _prevState: CouponFormState,
  formData: FormData,
): Promise<CouponFormState> {
  await requireStaff();
  const parsed = couponSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  try {
    await createCoupon(parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create coupon." };
  }
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCouponAction(
  id: string,
  _prevState: CouponFormState,
  formData: FormData,
): Promise<CouponFormState> {
  await requireStaff();
  const parsed = couponSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateCoupon(id, parsed.data);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCouponAction(id: string) {
  await requireStaff();
  await deleteCoupon(id);
  revalidatePath("/admin/coupons");
}
