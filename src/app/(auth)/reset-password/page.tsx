import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <div>
        <h1 className="font-display text-primary-900 mb-4 text-2xl">Invalid link</h1>
        <p className="text-muted-foreground text-sm">
          This password reset link is missing required information.{" "}
          <Link href="/forgot-password" className="text-primary-600 font-medium">
            Request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-primary-900 mb-6 text-2xl">Set a new password</h1>
      <ResetPasswordForm email={email} token={token} />
    </div>
  );
}
