import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { listCategories } from "@/services/category-service";
import { updateCategoryAction } from "../../actions";
import { CategoryForm } from "../../category-form";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    listCategories(),
  ]);

  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit category</h1>
      <CategoryForm
        action={boundAction}
        defaults={category}
        categories={categories}
        excludeId={id}
      />
    </div>
  );
}
