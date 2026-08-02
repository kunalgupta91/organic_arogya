import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().trim().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FLAT"]),
  value: z.coerce.number().positive("Value must be positive"),
  minOrderAmount: z.coerce.number().nonnegative().default(0).transform((v) => Math.round(v * 100)),
  maxDiscountAmount: z
    .string()
    .optional()
    .transform((val) => (val ? Math.round(Number(val) * 100) : undefined)),
  usageLimit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  validFrom: z.string().trim().min(1, "Start date is required"),
  validUntil: z.string().trim().min(1, "End date is required"),
  isActive: z.coerce.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
