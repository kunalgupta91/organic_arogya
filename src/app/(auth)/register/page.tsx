import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display text-primary-900 mb-6 text-2xl">Create your account</h1>
      <RegisterForm />
    </div>
  );
}
