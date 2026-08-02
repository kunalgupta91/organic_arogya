import type { Metadata } from "next";
import Link from "next/link";
import { listCoupons } from "@/services/coupon-service";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteCouponButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Coupons",
};

export default async function AdminCouponsPage() {
  const coupons = await listCoupons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Coupons</h1>
        <Link href="/admin/coupons/new">
          <Button size="sm">Add coupon</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Used</th>
              <th className="px-4 py-3 font-medium">Valid</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/coupons/${coupon.id}/edit`} className="font-medium hover:underline">
                    {coupon.code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatCurrency(coupon.value, "INR")}
                </td>
                <td className="px-4 py-3">
                  {coupon.usedCount}
                  {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3 text-xs">
                  {coupon.validFrom.toLocaleDateString("en-IN")} –{" "}
                  {coupon.validUntil.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  {coupon.isActive ? (
                    <span className="text-primary-700 bg-primary-50 rounded-full px-2 py-0.5 text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteCouponButton id={coupon.id} />
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
