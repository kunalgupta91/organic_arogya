"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

type Product = Parameters<typeof ProductCard>[0]["product"];

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Best Matches",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
};

export function BestsellersSection({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) seen.set(p.category.slug, p.category.name);
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [products]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "all" ? products : products.filter((p) => p.category.slug === activeCategory);
    const sorted = [...filtered];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.sellingPriceInr - b.sellingPriceInr);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.sellingPriceInr - a.sellingPriceInr);
    if (sortBy === "rating") sorted.sort((a, b) => b.avgRating - a.avgRating);
    return sorted;
  }, [products, activeCategory, sortBy]);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-primary-900 text-2xl sm:text-3xl">Our Bestsellers</h2>
        <Link href="/products" className="text-primary-600 text-sm font-medium hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={
              activeCategory === "all"
                ? "bg-primary-600 shrink-0 rounded-full px-4 py-2 text-sm font-medium text-white"
                : "border-border text-foreground hover:bg-muted shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            }
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActiveCategory(c.slug)}
              className={
                activeCategory === c.slug
                  ? "bg-primary-600 shrink-0 rounded-full px-4 py-2 text-sm font-medium text-white"
                  : "border-border text-foreground hover:bg-muted shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
              }
            >
              {c.name}
            </button>
          ))}
        </div>

        <label className="text-muted-foreground flex shrink-0 items-center gap-2 text-sm">
          Sort
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border-border text-foreground rounded-full border bg-white px-3 py-2 text-sm outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
