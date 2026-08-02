import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Question is required"),
  answer: z.string().trim().min(3, "Answer is required"),
  category: z.string().trim().min(1).default("General"),
  productId: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqSchema>;
