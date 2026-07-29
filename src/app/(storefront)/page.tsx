import { Hero } from "@/components/home/hero";
import { WhyOrganicArogya } from "@/components/home/why-organic-arogya";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductSection } from "@/components/home/product-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { getBestSellers, getFeaturedProducts, getNewArrivals } from "@/services/storefront-service";

export default async function HomePage() {
  const [featured, bestSellers, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getNewArrivals(),
  ]);

  return (
    <>
      <Hero />
      <WhyOrganicArogya />
      <CategoryGrid />
      <ProductSection title="Featured Products" viewAllHref="/products" products={featured} />
      <ProductSection title="Best Sellers" viewAllHref="/products" products={bestSellers} />
      <ProductSection title="New Arrivals" viewAllHref="/products" products={newArrivals} />
      <TestimonialsSection />
      <NewsletterSignup />
    </>
  );
}
