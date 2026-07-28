import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RoleSelect } from "./role-select";

export const metadata: Metadata = {
  title: "Manage Users",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Users</h1>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{user.name ?? "—"}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.createdAt.toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3">
                  <RoleSelect
                    userId={user.id}
                    currentRole={user.role}
                    disabled={user.id === session?.user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
