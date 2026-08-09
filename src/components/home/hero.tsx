import { getActiveBanners } from "@/services/banner-service";
import { getFeaturedProducts } from "@/services/storefront-service";
import { HeroBanner } from "@/components/home/hero-banner";
import { HeroDefault } from "@/components/home/hero-default";

export async function Hero() {
  const [[banner], [featuredProduct]] = await Promise.all([
    getActiveBanners("HOME_HERO"),
    getFeaturedProducts(1),
  ]);

  if (banner) {
    return <HeroBanner imageUrl={banner.imageUrl} title={banner.title} linkUrl={banner.linkUrl ?? "/products"} />;
  }

  return <HeroDefault featuredProduct={featuredProduct ?? null} />;
}
