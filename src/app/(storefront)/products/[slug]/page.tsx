import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Download, FileText } from "lucide-react";
import { getProductBySlug } from "@/services/storefront-service";
import { formatCurrency } from "@/lib/utils";
import { SITE_CONFIG } from "@/constants/site";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { ProductCard } from "@/components/product/product-card";
import { AddToCartButtons } from "@/components/product/add-to-cart-buttons";
import { ImageGallery } from "./image-gallery";
import { ProductTabs } from "./product-tabs";
import { ShareButtons } from "./share-buttons";
import { ReviewForm } from "./review-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    keywords: product.seoKeywords,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, session] = await Promise.all([getProductBySlug(slug), auth()]);
  if (!product) notFound();

  const discountPercent =
    product.mrpInr > product.sellingPriceInr
      ? Math.round(((product.mrpInr - product.sellingPriceInr) / product.mrpInr) * 100)
      : 0;
  const productUrl = `${SITE_CONFIG.url}/products/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.sellingPriceInr / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: productUrl,
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  const tabs = [
    { id: "description", label: "Description", content: <p className="whitespace-pre-line text-sm">{product.longDescription}</p> },
    {
      id: "benefits",
      label: "Benefits & Ingredients",
      content: (
        <div className="grid gap-6 sm:grid-cols-2">
          {product.benefits.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">Benefits</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {product.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {product.ingredients.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">Ingredients</p>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {product.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "usage",
      label: "Dosage & Usage",
      content: (
        <div className="space-y-4 text-sm">
          {product.dosage && (
            <p>
              <strong>Dosage: </strong>
              {product.dosage}
            </p>
          )}
          {product.usage && (
            <p>
              <strong>Usage: </strong>
              {product.usage}
            </p>
          )}
          {product.precautions && (
            <p>
              <strong>Precautions: </strong>
              {product.precautions}
            </p>
          )}
          {product.sideEffects && (
            <p>
              <strong>Side effects: </strong>
              {product.sideEffects}
            </p>
          )}
          {product.ageGroup && (
            <p>
              <strong>Age group: </strong>
              {product.ageGroup}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${product.reviewCount})`,
      content: (
        <div className="space-y-6">
          <ReviewForm productId={product.id} isLoggedIn={!!session?.user} />
          {product.reviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-border border-b pb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm font-medium">{review.user.name ?? "Customer"}</span>
                  </div>
                  {review.title && <p className="mt-1 text-sm font-medium">{review.title}</p>}
                  <p className="text-muted-foreground mt-1 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    ...(product.faqs.length > 0
      ? [
          {
            id: "faqs",
            label: "FAQs",
            content: (
              <div className="space-y-4">
                {product.faqs.map((faq) => (
                  <div key={faq.id}>
                    <p className="text-sm font-medium">{faq.question}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-muted-foreground mb-6 text-xs">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        <Link href={`/products?category=${product.category.slug}`}>{product.category.name}</Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-muted-foreground text-sm">{product.category.name}</p>
          <h1 className="font-display text-primary-900 mt-1 text-3xl">{product.name}</h1>
          {product.reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Star size={14} className="fill-accent-500 text-accent-500" />
              <span>{product.avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-primary-700 text-2xl font-semibold">
              {formatCurrency(product.sellingPriceInr, "INR")}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-muted-foreground line-through">
                  {formatCurrency(product.mrpInr, "INR")}
                </span>
                <span className="bg-accent-50 text-accent-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  {discountPercent}% off
                </span>
              </>
            )}
            <span className="text-muted-foreground text-sm">
              incl. {product.gstPercent}% GST
            </span>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">{product.shortDescription}</p>
          <p className="mt-2 text-sm">
            {product.weightValue}
            {product.weightUnit} &middot;{" "}
            {product.stock > 0 ? (
              <span className="text-primary-600">In stock</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddToCartButtons productId={product.id} stock={product.stock} />
            <Link href={`/bulk-orders?product=${product.slug}`}>
              <Button size="lg" variant="outline">
                Bulk Order
              </Button>
            </Link>
          </div>

          {product.documents.length > 0 && (
            <div className="mt-6 space-y-2">
              {product.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 flex items-center gap-2 text-sm hover:underline"
                >
                  {doc.type === "CERTIFICATE" ? <FileText size={16} /> : <Download size={16} />}
                  {doc.title}
                </a>
              ))}
            </div>
          )}

          <div className="mt-6">
            <ShareButtons url={productUrl} title={product.name} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs tabs={tabs} />
      </div>

      {product.relatedTo.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-primary-900 mb-6 text-2xl">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.relatedTo.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
