import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  designation: z.string().trim().optional(),
  company: z.string().trim().optional(),
  content: z.string().trim().min(5, "Content is required"),
  rating: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  imageUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  isPublished: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
