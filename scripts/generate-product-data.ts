/**
 * One-time conversion: reads the source Product_Description.xlsx (lives
 * outside this repo) and writes prisma/data/products.ts — a committed,
 * reviewable, typed data file the seed script imports normally. Re-run
 * manually if the source spreadsheet changes; do not wire this into
 * `db:seed` directly since the xlsx path is machine-specific.
 *
 * Usage: npx tsx scripts/generate-product-data.ts "<path-to-xlsx>"
 */
import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { slugify } from "../src/lib/utils";

const CATEGORY_MAP: Record<string, string> = {
  "Herbal Juice": "Ayurvedic Herbal Juices",
  "Herbal Powder": "Herbal Wellness Powder",
  "Herbal Candy": "Herbal Candy",
};

function parseWeight(unit: string): { weightValue: number; weightUnit: string } {
  const match = unit.trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!match) return { weightValue: 1, weightUnit: unit.trim() || "unit" };
  return { weightValue: Number(match[1]), weightUnit: match[2] };
}

function splitDescription(full: string): { shortDescription: string; longDescription: string } {
  const lines = full
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  // Source format is typically: Title line, tagline line, paragraph(s).
  const shortDescription = lines[1] ?? lines[0] ?? full.slice(0, 160);
  return { shortDescription, longDescription: full.trim() };
}

async function main() {
  const xlsxPath = process.argv[2];
  if (!xlsxPath) {
    console.error("Usage: tsx scripts/generate-product-data.ts <path-to-xlsx>");
    process.exit(1);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const sheet = wb.worksheets[0];

  const products: object[] = [];

  for (let r = 3; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    const srNo = row.getCell(1).value;
    const name = String(row.getCell(2).value ?? "").trim();
    if (!name) continue;

    const unit = String(row.getCell(3).value ?? "").trim();
    const mrp = Number(row.getCell(4).value ?? 0);
    const descriptionRaw = String(row.getCell(11).value ?? "").trim();
    const ingredientsRaw = String(row.getCell(12).value ?? "").trim();
    const usageRaw = String(row.getCell(13).value ?? "").trim();
    const categoryRaw = String(row.getCell(14).value ?? "").trim();

    const { weightValue, weightUnit } = parseWeight(unit);
    const { shortDescription, longDescription } = splitDescription(descriptionRaw);
    const category = CATEGORY_MAP[categoryRaw] ?? categoryRaw;

    products.push({
      sku: `OA-${String(srNo).padStart(3, "0")}`,
      name,
      slug: slugify(name),
      category,
      shortDescription,
      longDescription,
      ingredients: ingredientsRaw ? [ingredientsRaw] : [],
      usage: usageRaw || null,
      // Source spreadsheet has no authoritative data for these medical/
      // regulatory fields — flagged for admin/practitioner review rather
      // than invented. See project decision: leave TBD, don't fabricate.
      dosage: "[NEEDS REVIEW] Confirm dosage with a qualified Ayurvedic practitioner.",
      precautions: "[NEEDS REVIEW] Confirm precautions with a qualified Ayurvedic practitioner.",
      sideEffects: "[NEEDS REVIEW] Confirm side effects with a qualified Ayurvedic practitioner.",
      ageGroup: "[NEEDS REVIEW]",
      weightValue,
      weightUnit,
      mrpInr: Math.round(mrp * 100),
      sellingPriceInr: Math.round(mrp * 100), // no discount data in source
      gstPercent: 5, // placeholder — confirm actual HSN/GST rate before launch
      stock: 100, // placeholder inventory — no real stock data in source
    });
  }

  const outPath = path.join(__dirname, "..", "prisma", "data", "products.ts");
  const header = `// Generated from Product_Description.xlsx by scripts/generate-product-data.ts
// Do not hand-edit generated values lightly — re-running the generator
// overwrites this file. Fields marked [NEEDS REVIEW] require admin/
// practitioner input before the product goes live with real claims.

export type SeedProduct = {
  sku: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string[];
  usage: string | null;
  dosage: string;
  precautions: string;
  sideEffects: string;
  ageGroup: string;
  weightValue: number;
  weightUnit: string;
  mrpInr: number;
  sellingPriceInr: number;
  gstPercent: number;
  stock: number;
};

export const SEED_PRODUCTS: SeedProduct[] = `;

  fs.writeFileSync(outPath, header + JSON.stringify(products, null, 2) + ";\n");
  console.log(`Wrote ${products.length} products to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
