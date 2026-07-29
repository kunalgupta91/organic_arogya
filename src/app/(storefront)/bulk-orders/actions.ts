"use server";

import { auth } from "@/lib/auth";
import { bulkOrderSchema } from "@/validations/bulk-order";
import { submitBulkOrder } from "@/services/bulk-order-service";

export type BulkOrderFormState = { success: boolean; error: string | null };

export async function submitBulkOrderAction(
  _prevState: BulkOrderFormState,
  formData: FormData,
): Promise<BulkOrderFormState> {
  const parsed = bulkOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const session = await auth();
  await submitBulkOrder(parsed.data, session?.user?.id);
  return { success: true, error: null };
}
