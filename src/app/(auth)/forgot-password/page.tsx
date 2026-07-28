import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-primary-900 mb-6 text-2xl">Reset your password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
