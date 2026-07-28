import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-primary-900 mb-6 text-2xl">Welcome back</h1>
      <LoginForm />
    </div>
  );
}
