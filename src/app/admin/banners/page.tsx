import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listBanners } from "@/services/banner-service";
import { Button } from "@/components/ui/button";
import { DeleteBannerButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Banners",
};

export default async function AdminBannersPage() {
  const banners = await listBanners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-primary-900 text-2xl">Banners</h1>
        <Link href="/admin/banners/new">
          <Button size="sm">Add banner</Button>
        </Link>
      </div>
      <div className="border-border overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Banner</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="bg-muted relative h-10 w-16 shrink-0 overflow-hidden rounded-md">
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                  </div>
                  <Link href={`/admin/banners/${banner.id}/edit`} className="font-medium hover:underline">
                    {banner.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{banner.position}</td>
                <td className="px-4 py-3">
                  {banner.isActive ? (
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
                  <DeleteBannerButton id={banner.id} />
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center">
                  No banners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
