"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, MotionConfig, type Variants } from "framer-motion";
import { Leaf, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants/site";
import { formatCurrency } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: Leaf, label: "100% Ayurvedic" },
  { icon: Sprout, label: "Hand Picked from the Source" },
  { icon: ShieldCheck, label: "Supporting Farmers" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type FeaturedProduct = {
  slug: string;
  name: string;
  sellingPriceInr: number;
  mrpInr: number;
  images: { url: string; alt: string | null }[];
};

export function HeroDefault({ featuredProduct }: { featuredProduct: FeaturedProduct | null }) {
  const productImage = featuredProduct?.images[0];
  const discountPercent =
    featuredProduct && featuredProduct.mrpInr > featuredProduct.sellingPriceInr
      ? Math.round(
          ((featuredProduct.mrpInr - featuredProduct.sellingPriceInr) / featuredProduct.mrpInr) * 100,
        )
      : 0;

  return (
    <MotionConfig reducedMotion="user">
      <section className="px-4 pt-6 sm:px-6">
        <div className="bg-primary-700 relative mx-auto max-w-7xl overflow-hidden rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="bg-primary-500/30 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="bg-accent-500/20 absolute -bottom-32 left-1/3 h-96 w-96 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: [-12, -6, -12] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-16"
            >
              <Leaf className="text-primary-600/30 h-40 w-40 md:h-56 md:w-56" />
            </motion.div>
          </div>

          <div className="relative grid gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:items-center md:py-20 lg:px-16">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.p
                variants={item}
                className="text-primary-100 text-sm font-medium tracking-[0.2em] uppercase"
              >
                {SITE_CONFIG.sanskritTagline}
              </motion.p>
              <motion.h1
                variants={item}
                className="font-display mt-4 text-4xl leading-tight text-white sm:text-5xl"
              >
                True Ayurveda,
                <br />
                True Wellness.
              </motion.h1>
              <motion.p variants={item} className="mt-6 max-w-md text-lg text-white/80">
                {SITE_CONFIG.description}
              </motion.p>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary">
                    Shop Products
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10"
                  >
                    Our Story
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    <Icon size={14} />
                    {label}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative hidden aspect-square md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="border-primary-300/40 absolute inset-10 rounded-full border-2"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="bg-accent-100/10 absolute inset-20 rounded-full"
              />

              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.6 },
                  y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                }}
                className="text-primary-800 absolute top-4 left-0 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg"
              >
                <Leaf size={14} className="text-primary-600" />
                Rooted in Ayurveda
              </motion.span>

              {featuredProduct && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="absolute right-0 bottom-4 w-56"
                >
                  <Link
                    href={`/products/${featuredProduct.slug}`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl"
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
                      <p className="text-foreground line-clamp-1 text-sm font-medium">
                        {featuredProduct.name}
                      </p>
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
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
