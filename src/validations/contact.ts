import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
