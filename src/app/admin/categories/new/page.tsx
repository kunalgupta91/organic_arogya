import type { Metadata } from "next";
import { listCategories } from "@/services/category-service";
import { createCategoryAction } from "../actions";
import { CategoryForm } from "../category-form";

export const metadata: Metadata = {
  title: "Add Category",
};

export default async function NewCategoryPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Add category</h1>
      <CategoryForm action={createCategoryAction} categories={categories} />
    </div>
  );
}
