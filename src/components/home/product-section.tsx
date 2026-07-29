import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

type Product = Parameters<typeof ProductCard>[0]["product"];

export function ProductSection({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-primary-900 text-2xl sm:text-3xl">{title}</h2>
        <Link href={viewAllHref} className="text-primary-600 text-sm font-medium hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
