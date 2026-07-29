import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/utils";
import { SEED_PRODUCTS } from "./data/products";

// Aspirational full brand taxonomy (from Organic Arogya's print materials),
// plus any category actually used by SEED_PRODUCTS but not in that list
// (e.g. "Herbal Candy", which the real product data needs).
const BASE_CATEGORIES = [
  "Ayurvedic Herbal Juices",
  "Ayurvedic Beauty & Wellness",
  "Floral & Herbal Hydrosols",
  "Herbal Wellness Powder",
  "Green Insect Repellent",
  "Botanical Oral Health",
];
const CATEGORIES = Array.from(
  new Set([...BASE_CATEGORIES, ...SEED_PRODUCTS.map((p) => p.category)]),
);

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

const GENERAL_FAQS = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, credit/debit cards, net banking, and popular wallets via Razorpay for orders within India.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with tracking details. You can also view order status anytime from your account's order history.",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "See our Refund Policy page for full details on eligibility windows and the return process. Damaged or incorrect items are eligible for replacement or refund.",
  },
  {
    question: "Do you offer bulk or wholesale pricing?",
    answer:
      "Yes — visit our Bulk Orders page to submit a quantity enquiry and our team will get back to you with pricing.",
  },
  {
    question: "How should I store your herbal products?",
    answer:
      "Store in a cool, dry place away from direct sunlight, and keep containers tightly sealed after opening. Specific storage guidance is listed on each product page.",
  },
];

async function main() {
  const categoryIdByName = new Map<string, string>();
  for (const [index, name] of CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), sortOrder: index },
    });
    categoryIdByName.set(name, category.id);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@organicarogya.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Organic Arogya Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  let created = 0;
  for (const product of SEED_PRODUCTS) {
    const categoryId = categoryIdByName.get(product.category);
    if (!categoryId) {
      console.warn(`Skipping "${product.name}": unknown category "${product.category}"`);
      continue;
    }

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        categoryId,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        benefits: [],
        ingredients: product.ingredients,
        dosage: product.dosage,
        usage: product.usage,
        precautions: product.precautions,
        sideEffects: product.sideEffects,
        ageGroup: product.ageGroup,
        weightValue: product.weightValue,
        weightUnit: product.weightUnit,
        mrpInr: product.mrpInr,
        sellingPriceInr: product.sellingPriceInr,
        gstPercent: product.gstPercent,
        stock: product.stock,
        status: "DRAFT",
        images: {
          create: [{ url: PLACEHOLDER_IMAGE, alt: product.name, isThumbnail: true, sortOrder: 0 }],
        },
      },
    });
    created++;
  }

  for (const [index, faq] of GENERAL_FAQS.entries()) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: { ...faq, sortOrder: index } });
    }
  }

  console.log(
    `Seeded ${CATEGORIES.length} categories, admin user (${adminEmail}), ${created}/${SEED_PRODUCTS.length} products (status=DRAFT, placeholder images — review before publishing), and ${GENERAL_FAQS.length} general FAQs.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
