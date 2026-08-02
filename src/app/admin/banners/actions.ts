"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { bannerSchema } from "@/validations/banner";
import { createBanner, deleteBanner, updateBanner } from "@/services/banner-service";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
}

export type BannerFormState = { error: string | null };

export async function createBannerAction(
  _prevState: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  await requireStaff();
  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createBanner(parsed.data);
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBannerAction(
  id: string,
  _prevState: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  await requireStaff();
  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateBanner(id, parsed.data);
  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBannerAction(id: string) {
  await requireStaff();
  await deleteBanner(id);
  revalidatePath("/admin/banners");
}
