import type { Metadata } from "next";
import Link from "next/link";
import { listCategories } from "@/services/category-service";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Categories",
};

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Categories</h1>
        <Link href="/admin/categories/new">
          <Button size="sm">Add category</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {category.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3">
                  {category.isActive ? (
                    <span className="text-primary-700 bg-primary-50 rounded-full px-2 py-0.5 text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteCategoryButton id={category.id} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center">
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
