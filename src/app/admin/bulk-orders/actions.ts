"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
}

export async function updateBulkOrderStatusAction(
  id: string,
  status: "PENDING" | "CONTACTED" | "CONFIRMED" | "REJECTED",
) {
  await requireStaff();
  await prisma.bulkOrder.update({ where: { id }, data: { status } });
  revalidatePath("/admin/bulk-orders");
}
