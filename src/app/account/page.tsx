import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-primary-900 mb-2 text-3xl">
        Welcome, {session.user.name ?? session.user.email}
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">{session.user.email}</p>
      <Link
        href="/account/orders"
        className="text-primary-600 mb-6 inline-block text-sm font-medium hover:underline"
      >
        View order history →
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
