"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { deleteReview } from "@/services/review-service";

export async function deleteReviewAction(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
  await deleteReview(id);
  revalidatePath("/admin/reviews");
}
