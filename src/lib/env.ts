import { z } from "zod";

/**
 * Fails fast at boot with a clear message if a required var is missing,
 * instead of surfacing as a cryptic runtime error deep in a request.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ORDER_NOTIFICATION_EMAIL: z.string().email(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
});

function loadServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv must not be imported into client components");
  }
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid/missing environment variables:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}\nCheck .env against .env.example.`,
    );
  }
  return parsed.data;
}

function loadClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid/missing public environment variables:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }
  return parsed.data;
}

export const clientEnv = loadClientEnv();

// Lazily validated on first server-side access so client bundles never
// evaluate server-only secrets during the build.
let cachedServerEnv: z.infer<typeof serverEnvSchema> | undefined;
export function serverEnv() {
  if (!cachedServerEnv) {
    cachedServerEnv = loadServerEnv();
  }
  return cachedServerEnv;
}
