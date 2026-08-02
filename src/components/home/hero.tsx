import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants/site";
import { getActiveBanners } from "@/services/banner-service";

export async function Hero() {
  const [banner] = await getActiveBanners("HOME_HERO");

  if (banner) {
    return (
      <section className="bg-primary-50 relative overflow-hidden">
        <Link href={banner.linkUrl ?? "/products"} className="block">
          <div className="relative aspect-[16/7] w-full">
            <Image src={banner.imageUrl} alt={banner.title} fill priority className="object-cover" />
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-primary-50 relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase">
            {SITE_CONFIG.sanskritTagline}
          </p>
          <h1 className="font-display text-primary-900 mt-4 text-4xl leading-tight sm:text-5xl">
            True Ayurveda,
            <br />
            True Wellness.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-md text-lg">{SITE_CONFIG.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg">Shop Products</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative aspect-square rounded-full bg-gradient-to-br from-white to-transparent md:aspect-auto md:h-96">
          <div className="border-primary-300/40 absolute inset-8 rounded-full border-2" />
          <div className="bg-accent-100/60 absolute inset-16 rounded-full" />
        </div>
      </div>
    </section>
  );
}
