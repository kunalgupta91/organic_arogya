import Link from "next/link";
import Image from "next/image";
import { Droplets, Sparkles, SprayCan, Leaf, Candy, Smile } from "lucide-react";
import { getActiveCategories } from "@/services/storefront-service";
import { ScrollCarousel } from "@/components/shared/scroll-carousel";

const ICONS = [Droplets, Sparkles, SprayCan, Leaf, Candy, Smile];

export async function CategoryGrid() {
  const categories = await getActiveCategories();
  const withProducts = categories.filter((c) => c._count.products > 0);
  if (withProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <ScrollCarousel title="Shop by Category">
        {withProducts.map((category, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex w-24 shrink-0 flex-col items-center gap-3 text-center sm:w-28"
            >
              <div className="bg-primary-50 ring-border relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ring-1 transition-transform group-hover:scale-105 sm:h-24 sm:w-24">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill className="object-cover" />
                ) : (
                  <Icon className="text-primary-600" size={28} />
                )}
              </div>
              <p className="text-foreground line-clamp-2 text-sm font-medium">{category.name}</p>
            </Link>
          );
        })}
      </ScrollCarousel>
    </section>
  );
}
