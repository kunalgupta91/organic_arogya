"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";

const emailSchema = z.string().email();

export type NewsletterState = { success: boolean; error: string | null };

export async function subscribeNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  try {
    rateLimit(`newsletter:${await getClientIp()}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { success: false, error: "Too many attempts. Please try again later." };
    }
    throw error;
  }

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
