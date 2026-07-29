import { z } from "zod";

export const bulkOrderSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  company: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),
  phone: z.string().trim().min(6, "A valid phone number is required"),
  email: z.string().email(),
  address: z.string().trim().min(5, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1).default("India"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  remarks: z.string().trim().optional(),
  productId: z.string().trim().optional(),
});

export type BulkOrderInput = z.infer<typeof bulkOrderSchema>;
