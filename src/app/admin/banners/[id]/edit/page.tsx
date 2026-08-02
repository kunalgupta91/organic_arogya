import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBannerAction } from "../../actions";
import { BannerForm } from "../../banner-form";

export const metadata: Metadata = {
  title: "Edit Banner",
};

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  const boundAction = updateBannerAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-primary-900 text-2xl">Edit banner</h1>
      <BannerForm action={boundAction} defaults={banner} />
    </div>
  );
}
