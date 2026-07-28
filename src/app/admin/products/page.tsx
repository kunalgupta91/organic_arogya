import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/services/product-service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Products",
};

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">Add product</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="bg-muted relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">{formatCurrency(product.sellingPriceInr, "INR")}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-muted-foreground px-4 py-8 text-center">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
