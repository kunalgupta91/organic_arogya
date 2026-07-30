import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order History",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending payment",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return requested",
  REFUNDED: "Refunded",
};

export default async function OrderHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-primary-900 text-3xl">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground mt-6">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="text-primary-600 hover:underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-confirmation/${order.orderNumber}`}
              className="border-border block rounded-xl border bg-white p-5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{order.orderNumber}</span>
                <span className="text-muted-foreground text-xs">
                  {order.createdAt.toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 flex items-center justify-between text-sm">
                <span>{STATUS_LABEL[order.status] ?? order.status}</span>
                <span>{formatCurrency(order.totalAmount, order.currency)}</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
