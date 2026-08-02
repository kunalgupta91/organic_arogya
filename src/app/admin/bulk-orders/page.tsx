import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BulkOrderStatusSelect } from "./status-select";

export const metadata: Metadata = {
  title: "Bulk Order Requests",
};

export default async function AdminBulkOrdersPage() {
  const orders = await prisma.bulkOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Bulk Order Requests</h1>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">{order.name}</td>
                <td className="px-4 py-3">{order.company ?? "—"}</td>
                <td className="px-4 py-3">{order.product?.name ?? "General enquiry"}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">
                  <div>{order.email}</div>
                  <div className="text-muted-foreground text-xs">{order.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <BulkOrderStatusSelect id={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                  No bulk order requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
