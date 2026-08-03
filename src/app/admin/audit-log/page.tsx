import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Audit Log",
};

export default async function AdminAuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Audit Log</h1>
      <p className="text-muted-foreground text-sm">
        Recent sensitive actions (role changes, product/coupon create-update-delete, order status
        changes). Showing the most recent 200 events.
      </p>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Entity</th>
              <th className="px-4 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {log.createdAt.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">{log.user?.name ?? log.user?.email ?? "System"}</td>
                <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                <td className="px-4 py-3 text-xs">
                  {log.entityType}
                  {log.entityId ? ` (${log.entityId.slice(0, 8)}…)` : ""}
                </td>
                <td className="px-4 py-3 text-xs">{log.ipAddress ?? "—"}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                  No audit events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
