"use server";

import { contactSchema } from "@/validations/contact";
import { submitContactForm } from "@/services/contact-service";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";

export type ContactFormState = { success: boolean; error: string | null };

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    rateLimit(`contact:${await getClientIp()}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { success: false, error: "Too many messages sent. Please try again later." };
    }
    throw error;
  }

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await submitContactForm(parsed.data);
  return { success: true, error: null };
}
