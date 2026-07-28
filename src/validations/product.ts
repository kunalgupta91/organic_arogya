import { z } from "zod";

const lineList = z
  .string()
  .optional()
  .transform((val) =>
    (val ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

const commaList = z
  .string()
  .optional()
  .transform((val) =>
    (val ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

const optionalMoney = z
  .string()
  .optional()
  .transform((val) => (val ? Math.round(Number(val) * 100) : undefined));

const imageItemSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  isThumbnail: z.boolean().optional().default(false),
});

const documentItemSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  type: z.enum(["BROCHURE", "CERTIFICATE"]),
});

const jsonArray = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
    .pipe(z.array(itemSchema));

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  categoryId: z.string().trim().min(1, "Category is required"),

  shortDescription: z.string().trim().min(1, "Short description is required"),
  longDescription: z.string().trim().min(1, "Long description is required"),

  benefits: lineList,
  ingredients: lineList,
  dosage: z.string().trim().optional(),
  usage: z.string().trim().optional(),
  precautions: z.string().trim().optional(),
  sideEffects: z.string().trim().optional(),
  ageGroup: z.string().trim().optional(),

  weightValue: z.coerce.number().positive("Weight must be positive"),
  weightUnit: z.string().trim().min(1, "Weight unit is required"),

  mrpInr: z.coerce.number().nonnegative().transform((v) => Math.round(v * 100)),
  sellingPriceInr: z.coerce.number().nonnegative().transform((v) => Math.round(v * 100)),
  mrpUsd: optionalMoney,
  sellingPriceUsd: optionalMoney,
  gstPercent: z.coerce.number().min(0).max(100).default(5),
  stock: z.coerce.number().int().nonnegative().default(0),

  videoUrl: z.string().trim().optional(),

  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  seoKeywords: commaList,
  tags: commaList,

  isFeatured: z.coerce.boolean().default(false),
  isTrending: z.coerce.boolean().default(false),
  isNewArrival: z.coerce.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),

  images: jsonArray(imageItemSchema),
  documents: jsonArray(documentItemSchema),
  relatedProductIds: jsonArray(z.string()),
});

export type ProductInput = z.infer<typeof productSchema>;
