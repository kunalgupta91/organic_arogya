import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(6, "A valid phone number is required"),
  line1: z.string().trim().min(3, "Address is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(3, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
});

export const checkoutSchema = z
  .object({
    guestEmail: z.string().email().optional(),
    shipping: addressSchema,
    couponCode: z.string().trim().optional(),
  })
  .transform((data) => ({
    ...data,
    couponCode: data.couponCode || undefined,
  }));

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
