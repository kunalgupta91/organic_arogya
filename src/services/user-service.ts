import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { SITE_CONFIG } from "@/constants/site";
import type { RegisterInput } from "@/validations/auth";

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class InvalidResetTokenError extends Error {
  constructor() {
    super("This password reset link is invalid or has expired.");
    this.name = "InvalidResetTokenError";
  }
}

export async function registerCustomer(input: Omit<RegisterInput, "confirmPassword">) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: "CUSTOMER",
    },
  });
}

/** Always resolves without revealing whether the email is registered. */
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = randomUUID();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    },
  });

  const resetUrl = `${SITE_CONFIG.url}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendPasswordResetEmail(email, resetUrl);
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record || record.expires < new Date()) {
    throw new InvalidResetTokenError();
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } }),
  ]);
}
