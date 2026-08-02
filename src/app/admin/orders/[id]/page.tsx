import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusSelect } from "../status-select";

export const metadata: Metadata = {
  title: "Order Detail",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payment: true,
      user: { select: { name: true, email: true, phone: true } },
      coupon: { select: { code: true } },
    },
  });
  if (!order) notFound();

  const shipping = order.shippingAddress as Record<string, string>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">{order.orderNumber}</h1>
        <OrderStatusSelect id={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border-border rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">Customer</h2>
          <p className="text-sm">{order.user?.name ?? "Guest"}</p>
          <p className="text-muted-foreground text-sm">{order.user?.email ?? order.guestEmail}</p>
          <p className="text-muted-foreground text-sm">{order.user?.phone ?? order.guestPhone}</p>
        </div>
        <div className="border-border rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold">Shipping address</h2>
          <p className="text-sm">{shipping.fullName}</p>
          <p className="text-muted-foreground text-sm">
            {shipping.line1}
            {shipping.line2 ? `, ${shipping.line2}` : ""}, {shipping.city}, {shipping.state}{" "}
            {shipping.postalCode}, {shipping.country}
          </p>
          <p className="text-muted-foreground text-sm">{shipping.phone}</p>
        </div>
      </div>

      <div className="border-border rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold">Items</h2>
        <div className="divide-border divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.productNameSnapshot} ({item.skuSnapshot}) × {item.quantity}
              </span>
              <span>{formatCurrency(item.totalPrice, order.currency)}</span>
            </div>
          ))}
        </div>
        <div className="border-border mt-3 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotalAmount, order.currency)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount {order.coupon ? `(${order.coupon.code})` : ""}</span>
              <span>-{formatCurrency(order.discountAmount, order.currency)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatCurrency(order.shippingAmount, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST</span>
            <span>{formatCurrency(order.taxAmount, order.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount, order.currency)}</span>
          </div>
        </div>
      </div>

      <div className="border-border rounded-xl border bg-white p-5 text-sm">
        <h2 className="mb-2 text-sm font-semibold">Payment</h2>
        <p>
          {order.payment?.provider} — {order.payment?.status}
        </p>
        {order.payment?.providerPaymentId && (
          <p className="text-muted-foreground text-xs">
            Payment ID: {order.payment.providerPaymentId}
          </p>
        )}
      </div>
    </div>
  );
}
