import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-border flex h-16 items-center justify-between border-b bg-white px-6">
          <span className="text-muted-foreground text-sm">
            Signed in as <span className="text-foreground font-medium">{session.user.email}</span>
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main className="bg-muted flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
