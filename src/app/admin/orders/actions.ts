"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/enums";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    throw new Error("Unauthorized");
  }
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
