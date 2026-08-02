"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/validations/review";
import { AlreadyReviewedError, submitReview } from "@/services/review-service";

export type ReviewFormState = { error: string | null; success: boolean };

export async function submitReviewAction(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Please sign in to leave a review.", success: false };
  }

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input.", success: false };
  }

  try {
    await submitReview(parsed.data, session.user.id);
  } catch (error) {
    if (error instanceof AlreadyReviewedError) {
      return { error: error.message, success: false };
    }
    throw error;
  }

  revalidatePath(`/products`);
  return { error: null, success: true };
}
