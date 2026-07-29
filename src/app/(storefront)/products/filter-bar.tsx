import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FilterBar({
  categories,
  current,
}: {
  categories: { slug: string; name: string }[];
  current: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  };
}) {
  return (
    <form
      action="/products"
      className="border-border grid grid-cols-2 gap-3 rounded-xl border bg-white p-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      <input
        type="search"
        name="search"
        placeholder="Search…"
        defaultValue={current.search}
        className="border-border col-span-2 h-10 rounded-lg border px-3 text-sm sm:col-span-1"
      />
      <select
        name="category"
        defaultValue={current.category ?? ""}
        className="border-border h-10 rounded-lg border bg-white px-3 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <Input
        type="number"
        name="minPrice"
        placeholder="Min ₹"
        defaultValue={current.minPrice}
        className="h-10"
      />
      <Input
        type="number"
        name="maxPrice"
        placeholder="Max ₹"
        defaultValue={current.maxPrice}
        className="h-10"
      />
      <select
        name="sort"
        defaultValue={current.sort ?? "newest"}
        className="border-border h-10 rounded-lg border bg-white px-3 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="name">Name: A-Z</option>
      </select>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs">
          <input type="checkbox" name="inStock" value="true" defaultChecked={current.inStock === "true"} />
          In stock
        </label>
        <Button type="submit" size="sm" className="ml-auto">
          Apply
        </Button>
      </div>
    </form>
  );
}
