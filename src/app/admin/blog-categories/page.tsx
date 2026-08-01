import type { Metadata } from "next";
import { listBlogCategories } from "@/services/blog-category-service";
import { BlogCategoryForm } from "./category-form";
import { DeleteBlogCategoryButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Blog Categories",
};

export default async function BlogCategoriesPage() {
  const categories = await listBlogCategories();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Blog Categories</h1>
      <BlogCategoryForm />
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Posts</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">{category.name}</td>
                <td className="px-4 py-3">{category._count.blogs}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteBlogCategoryButton id={category.id} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted-foreground px-4 py-8 text-center">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
