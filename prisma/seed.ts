import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/utils";

// Full product catalog is seeded in a later phase from Product_Description.xlsx.
// This seeds foundational reference data: categories and a default admin user.
const CATEGORIES = [
  "Ayurvedic Herbal Juices",
  "Ayurvedic Beauty & Wellness",
  "Floral & Herbal Hydrosols",
  "Herbal Wellness Powder",
  "Green Insect Repellent",
  "Botanical Oral Health",
];

async function main() {
  for (const [index, name] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), sortOrder: index },
    });
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

  console.log(`Seeded ${CATEGORIES.length} categories and admin user (${adminEmail}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
