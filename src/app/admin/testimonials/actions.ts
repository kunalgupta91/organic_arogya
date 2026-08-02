"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { testimonialSchema } from "@/validations/testimonial";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/services/testimonial-service";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
}

export type TestimonialFormState = { error: string | null };

export async function createTestimonialAction(
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireStaff();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createTestimonial(parsed.data);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(
  id: string,
  _prevState: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireStaff();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateTestimonial(id, parsed.data);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  await requireStaff();
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
}
