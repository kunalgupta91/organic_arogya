import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusSelect } from "./status-select";

export const metadata: Metadata = {
  title: "Manage Orders",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, payment: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Orders</h1>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.user?.name ?? order.guestEmail ?? "Guest"}</td>
                <td className="px-4 py-3">{formatCurrency(order.totalAmount, order.currency)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      order.payment?.status === "PAID"
                        ? "text-primary-700 bg-primary-50"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.payment?.status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect id={order.id} currentStatus={order.status} />
                </td>
                <td className="px-4 py-3 text-xs">{order.createdAt.toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
