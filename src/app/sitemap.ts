import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/constants/site";

const STATIC_ROUTES = [
  "",
  "/products",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/bulk-orders",
  "/privacy-policy",
  "/terms-and-conditions",
  "/refund-policy",
  "/shipping-policy",
];

// Regenerate hourly rather than only once at build time — keeps the sitemap
// current without needing a redeploy, and avoids a transient DB hiccup
// during `next build` from failing the whole build.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_CONFIG.url}${path}`,
    lastModified: new Date(),
  }));

  try {
    const [products, blogs, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_CONFIG.url}/products/${p.slug}`,
      lastModified: p.updatedAt,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${SITE_CONFIG.url}/blog/${b.slug}`,
      lastModified: b.updatedAt,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_CONFIG.url}/products?category=${c.slug}`,
    }));

    return [...staticEntries, ...productEntries, ...blogEntries, ...categoryEntries];
  } catch (error) {
    // Ship the static routes rather than fail the whole build/request if
    // the database is transiently unreachable — the next revalidation
    // will pick up dynamic entries once it's back.
    console.error("sitemap: failed to load dynamic entries, falling back to static routes", error);
    return staticEntries;
  }
}
