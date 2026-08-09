import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { QuickAdd } from "@/components/product/quick-add";

type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  mrpInr: number;
  sellingPriceInr: number;
  avgRating: number;
  reviewCount: number;
  stock: number;
  category: { name: string; slug: string };
  images: { url: string; alt: string | null }[];
};

export function ProductCard({
  product,
  showQuickAdd = true,
}: {
  product: ProductCardData;
  showQuickAdd?: boolean;
}) {
  const discountPercent =
    product.mrpInr > product.sellingPriceInr
      ? Math.round(((product.mrpInr - product.sellingPriceInr) / product.mrpInr) * 100)
      : 0;
  const image = product.images[0];

  return (
    <div className="border-border group overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-muted relative aspect-square overflow-hidden">
          {image && (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {discountPercent > 0 && (
            <span className="bg-accent-500 absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium text-white">
              {discountPercent}% off
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-foreground/80 absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="space-y-1 px-4 pt-4">
          <p className="text-muted-foreground text-xs">{product.category.name}</p>
          <p className="text-foreground line-clamp-1 font-medium">{product.name}</p>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Star size={12} className="fill-accent-500 text-accent-500" />
              <span>{product.avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-primary-700 font-semibold">
              {formatCurrency(product.sellingPriceInr, "INR")}
            </span>
            {discountPercent > 0 && (
              <span className={cn("text-muted-foreground text-xs line-through")}>
                {formatCurrency(product.mrpInr, "INR")}
              </span>
            )}
          </div>
        </div>
      </Link>
      {showQuickAdd && (
        <div className="p-4 pt-3">
          <QuickAdd productId={product.id} stock={product.stock} />
        </div>
      )}
    </div>
  );
}
