"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { faqSchema } from "@/validations/faq";
import { createFaq, deleteFaq, updateFaq } from "@/services/faq-service";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
}

export type FaqFormState = { error: string | null };

export async function createFaqAction(
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireStaff();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createFaq(parsed.data);
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaqAction(
  id: string,
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireStaff();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateFaq(id, parsed.data);
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaqAction(id: string) {
  await requireStaff();
  await deleteFaq(id);
  revalidatePath("/admin/faqs");
}
