import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getActiveCategories, listStorefrontProducts } from "@/services/storefront-service";
import { FilterBar } from "./filter-bar";
import { Pagination } from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Shop All Products",
};

type SearchParams = {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = (sp.sort ?? "newest") as
    | "newest"
    | "price-asc"
    | "price-desc"
    | "rating"
    | "name";

  const [categories, result] = await Promise.all([
    getActiveCategories(),
    listStorefrontProducts(
      {
        categorySlug: sp.category,
        search: sp.search,
        minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
        maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
        inStockOnly: sp.inStock === "true",
        sort,
      },
      page,
    ),
  ]);

  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...sp, page: String(p) } as Record<string, string>);
    return `/products?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-primary-900 text-3xl">Shop All Products</h1>
      <FilterBar
        categories={categories}
        current={{
          category: sp.category,
          search: sp.search,
          minPrice: sp.minPrice,
          maxPrice: sp.maxPrice,
          inStock: sp.inStock,
          sort: sp.sort,
        }}
      />
      <p className="text-muted-foreground text-sm">{result.total} products</p>
      {result.items.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">
          No products match your filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
    </div>
  );
}
