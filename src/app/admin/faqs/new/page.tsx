import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createFaqAction } from "../actions";
import { FaqForm } from "../faq-form";

export const metadata: Metadata = {
  title: "Add FAQ",
};

export default async function NewFaqPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add FAQ</h1>
      <FaqForm action={createFaqAction} products={products} />
    </div>
  );
}
