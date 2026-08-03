"use server";

import { auth } from "@/lib/auth";
import { bulkOrderSchema } from "@/validations/bulk-order";
import { submitBulkOrder } from "@/services/bulk-order-service";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";

export type BulkOrderFormState = { success: boolean; error: string | null };

export async function submitBulkOrderAction(
  _prevState: BulkOrderFormState,
  formData: FormData,
): Promise<BulkOrderFormState> {
  try {
    rateLimit(`bulk-order:${await getClientIp()}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { success: false, error: "Too many requests sent. Please try again later." };
    }
    throw error;
  }

  const parsed = bulkOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const session = await auth();
  await submitBulkOrder(parsed.data, session?.user?.id);
  return { success: true, error: null };
}
