import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().optional(),
  comment: z.string().trim().min(5, "Review must be at least 5 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
