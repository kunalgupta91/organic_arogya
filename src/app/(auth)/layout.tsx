import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-muted flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-center">
        <span className="font-display text-primary-900 text-2xl">{SITE_CONFIG.name}</span>
      </Link>
      <div className="border-border w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}
