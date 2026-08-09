import Link from "next/link";
import Image from "next/image";
import { Leaf, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants/site";
import { getActiveBanners } from "@/services/banner-service";
import { getFeaturedProducts } from "@/services/storefront-service";
import { formatCurrency } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: Leaf, label: "100% Ayurvedic" },
  { icon: Sprout, label: "Hand Picked from the Source" },
  { icon: ShieldCheck, label: "Supporting Farmers" },
];

export async function Hero() {
  const [[banner], [featuredProduct]] = await Promise.all([
    getActiveBanners("HOME_HERO"),
    getFeaturedProducts(1),
  ]);

  if (banner) {
    return (
      <section className="px-4 pt-6 sm:px-6">
        <Link
          href={banner.linkUrl ?? "/products"}
          className="mx-auto block max-w-7xl overflow-hidden rounded-[2rem]"
        >
          <div className="relative aspect-[16/7] w-full">
            <Image src={banner.imageUrl} alt={banner.title} fill priority className="object-cover" />
          </div>
        </Link>
      </section>
    );
  }

  const productImage = featuredProduct?.images[0];
  const discountPercent =
    featuredProduct && featuredProduct.mrpInr > featuredProduct.sellingPriceInr
      ? Math.round(
          ((featuredProduct.mrpInr - featuredProduct.sellingPriceInr) / featuredProduct.mrpInr) * 100,
        )
      : 0;

  return (
    <section className="px-4 pt-6 sm:px-6">
      <div className="bg-primary-700 relative mx-auto max-w-7xl overflow-hidden rounded-[2rem]">
        {/* Decorative background texture — no photography available, so we lean
            on brand color + a soft botanical motif rather than a stock image. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary-500/30 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl" />
          <div className="bg-accent-500/20 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl" />
          <Leaf className="text-primary-600/30 absolute top-10 right-16 h-40 w-40 -rotate-12 md:h-56 md:w-56" />
        </div>

        <div className="relative grid gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:items-center md:py-20 lg:px-16">
          <div>
            <p className="text-primary-100 text-sm font-medium tracking-[0.2em] uppercase">
              {SITE_CONFIG.sanskritTagline}
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-white sm:text-5xl">
              True Ayurveda,
              <br />
              True Wellness.
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/80">{SITE_CONFIG.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Shop Products
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Our Story
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <Icon size={14} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden aspect-square md:block">
            <div className="border-primary-300/40 absolute inset-10 rounded-full border-2" />
            <div className="bg-accent-100/10 absolute inset-20 rounded-full" />

            <span className="absolute top-4 left-0 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-primary-800 shadow-lg">
              <Leaf size={14} className="text-primary-600" />
              Rooted in Ayurveda
            </span>

            {featuredProduct && (
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="absolute right-0 bottom-4 flex w-56 items-center gap-3 rounded-2xl bg-white p-3 shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  {productImage && (
                    <Image
                      src={productImage.url}
                      alt={productImage.alt ?? featuredProduct.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-foreground line-clamp-1 text-sm font-medium">{featuredProduct.name}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-primary-700 text-sm font-semibold">
                      {formatCurrency(featuredProduct.sellingPriceInr, "INR")}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-muted-foreground text-xs line-through">
                        {formatCurrency(featuredProduct.mrpInr, "INR")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
