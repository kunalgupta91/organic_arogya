import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductForEdit } from "@/services/product-service";
import { updateProductAction } from "../../actions";
import { ProductForm } from "../../product-form";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, allProducts, related] = await Promise.all([
    getProductForEdit(id),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.product.findMany({
      where: { id: { not: id } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.findUnique({
      where: { id },
      select: { relatedTo: { select: { id: true } } },
    }),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit product</h1>
      <ProductForm
        action={boundAction}
        categories={categories}
        products={allProducts}
        defaults={{
          ...product,
          relatedProductIds: related?.relatedTo.map((p) => p.id) ?? [],
        }}
      />
    </div>
  );
}
