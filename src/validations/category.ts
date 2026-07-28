import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z.string().trim().optional(),
  image: z.string().trim().optional(),
  parentId: z.string().trim().optional(),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
