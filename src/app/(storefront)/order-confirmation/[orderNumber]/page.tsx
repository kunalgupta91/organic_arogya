import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, payment: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <CheckCircle2 size={56} className="text-primary-600 mx-auto" />
      <h1 className="font-display text-primary-900 mt-4 text-3xl">
        {order.payment?.status === "PAID" ? "Order Confirmed!" : "Order Received"}
      </h1>
      <p className="text-muted-foreground mt-2">
        Order <strong>{order.orderNumber}</strong>
        {order.payment?.status === "PAID"
          ? " — thank you! A confirmation email is on its way."
          : " — we're still confirming your payment. Refresh in a moment or check your email."}
      </p>

      <div className="border-border mt-8 space-y-2 rounded-xl border bg-white p-5 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productNameSnapshot} × {item.quantity}
            </span>
            <span>{formatCurrency(item.totalPrice, order.currency)}</span>
          </div>
        ))}
        <div className="border-border flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount, order.currency)}</span>
        </div>
      </div>

      <Link href="/products" className="mt-8 inline-block">
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
