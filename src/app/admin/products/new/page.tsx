import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "../actions";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function NewProductPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add product</h1>
      <ProductForm action={createProductAction} categories={categories} products={products} />
    </div>
  );
}
