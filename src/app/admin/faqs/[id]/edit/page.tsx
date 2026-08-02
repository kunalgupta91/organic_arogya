import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateFaqAction } from "../../actions";
import { FaqForm } from "../../faq-form";

export const metadata: Metadata = {
  title: "Edit FAQ",
};

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [faq, products] = await Promise.all([
    prisma.faq.findUnique({ where: { id } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!faq) notFound();

  const boundAction = updateFaqAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit FAQ</h1>
      <FaqForm action={boundAction} defaults={faq} products={products} />
    </div>
  );
}
