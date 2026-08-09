import { ProductCard } from "@/components/product/product-card";
import { ScrollCarousel } from "@/components/shared/scroll-carousel";

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
      <ScrollCarousel title={title} viewAllHref={viewAllHref}>
        {products.map((product) => (
          <div key={product.id} className="w-56 shrink-0 sm:w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </ScrollCarousel>
    </section>
  );
}
