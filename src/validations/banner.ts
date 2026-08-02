import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  subtitle: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, "Image is required"),
  mobileImageUrl: z.string().trim().optional(),
  linkUrl: z.string().trim().optional(),
  position: z.string().trim().default("HOME_HERO"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
});

export type BannerInput = z.infer<typeof bannerSchema>;
