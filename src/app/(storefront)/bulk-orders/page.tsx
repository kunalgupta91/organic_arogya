import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BulkOrderForm } from "./bulk-order-form";

export const metadata: Metadata = {
  title: "Bulk Orders",
};

export default async function BulkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productSlug } = await searchParams;
  const product = productSlug
    ? await prisma.product.findUnique({
        where: { slug: productSlug },
        select: { id: true, name: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Bulk Orders</h1>
      <p className="text-muted-foreground mt-2 max-w-xl">
        Buying in bulk for your business, clinic, or event? Tell us what you need and our team
        will get back to you with pricing and availability.
      </p>
      <div className="mt-10">
        <BulkOrderForm productId={product?.id} productName={product?.name} />
      </div>
    </div>
  );
}
