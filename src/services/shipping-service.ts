import { prisma } from "@/lib/prisma";
import type { Currency } from "@/generated/prisma/enums";

export async function calculateShipping(
  subtotalInr: number,
  region: "DOMESTIC" | "INTERNATIONAL",
  currency: Currency,
): Promise<number> {
  const rule = await prisma.shippingRule.findFirst({
    where: { region, currency, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  if (!rule) return 0;
  if (rule.minOrderAmount != null && subtotalInr >= rule.minOrderAmount) return 0;
  return rule.flatRate;
}
