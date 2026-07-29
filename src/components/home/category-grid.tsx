import Link from "next/link";
import Image from "next/image";
import { getActiveCategories } from "@/services/storefront-service";

export async function CategoryGrid() {
  const categories = await getActiveCategories();
  const withProducts = categories.filter((c) => c._count.products > 0);
  if (withProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-primary-900 text-center text-2xl sm:text-3xl">
        Shop by Category
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {withProducts.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="border-border group overflow-hidden rounded-xl border bg-white text-center transition-shadow hover:shadow-md"
          >
            <div className="bg-muted relative aspect-square">
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-muted-foreground text-xs">{category._count.products} products</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
