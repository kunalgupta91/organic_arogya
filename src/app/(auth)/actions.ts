"use server";

import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RateLimitError } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/validations/auth";
import {
  EmailAlreadyRegisteredError,
  InvalidResetTokenError,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
} from "@/services/user-service";

export type AuthActionState = { error: string } | { error: null };

const TOO_MANY_ATTEMPTS = "Too many attempts. Please try again in a few minutes.";

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    rateLimit(`register:${await getClientIp()}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) return { error: TOO_MANY_ATTEMPTS };
    throw error;
  }

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await registerCustomer(parsed.data);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      return { error: error.message };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/account",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created — please sign in." };
    }
    throw error;
  }

  return { error: null };
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    rateLimit(`login:${await getClientIp()}`, 10, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) return { error: TOO_MANY_ATTEMPTS };
    throw error;
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/account",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return { error: null };
}

export type ForgotPasswordState = { error: string | null; submitted: boolean };

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  try {
    rateLimit(`forgot-password:${await getClientIp()}`, 5, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) return { error: TOO_MANY_ATTEMPTS, submitted: false };
    throw error;
  }

  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Enter a valid email address.", submitted: false };
  }

  await requestPasswordReset(parsed.data.email);
  // Always report success — don't reveal whether the email is registered.
  return { error: null, submitted: true };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    rateLimit(`reset-password:${await getClientIp()}`, 10, 15 * 60 * 1000);
  } catch (error) {
    if (error instanceof RateLimitError) return { error: TOO_MANY_ATTEMPTS };
    throw error;
  }

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await resetPassword(parsed.data.email, parsed.data.token, parsed.data.password);
  } catch (error) {
    if (error instanceof InvalidResetTokenError) {
      return { error: error.message };
    }
    throw error;
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/account",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Password updated — please sign in." };
    }
    throw error;
  }

  return { error: null };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
  return session;
}
