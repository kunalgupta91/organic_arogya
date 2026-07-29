"use server";

import { contactSchema } from "@/validations/contact";
import { submitContactForm } from "@/services/contact-service";

export type ContactFormState = { success: boolean; error: string | null };

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await submitContactForm(parsed.data);
  return { success: true, error: null };
}
