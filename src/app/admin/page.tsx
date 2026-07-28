import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/stat-card";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const [userCount, productCount, orderCount, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED"] } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Customers" value={userCount} />
        <StatCard label="Products" value={productCount} />
        <StatCard label="Orders" value={orderCount} />
        <StatCard
          label="Revenue (INR)"
          value={formatCurrency(revenue._sum.totalAmount ?? 0, "INR")}
        />
      </div>
    </div>
  );
}
