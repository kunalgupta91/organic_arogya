"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().email();

export type NewsletterState = { success: boolean; error: string | null };

export async function subscribeNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { success: false, error: "Enter a valid email address." };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data },
    update: {},
    create: { email: parsed.data },
  });

  return { success: true, error: null };
}
