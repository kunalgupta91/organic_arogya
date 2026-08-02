import { prisma } from "@/lib/prisma";
import type { BannerInput } from "@/validations/banner";

export async function listBanners() {
  return prisma.banner.findMany({ orderBy: [{ position: "asc" }, { sortOrder: "asc" }] });
}

export async function getActiveBanners(position: string) {
  const now = new Date();
  return prisma.banner.findMany({
    where: {
      position,
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: { sortOrder: "asc" },
  });
}

function toData(input: BannerInput) {
  return {
    title: input.title,
    subtitle: input.subtitle || null,
    imageUrl: input.imageUrl,
    mobileImageUrl: input.mobileImageUrl || null,
    linkUrl: input.linkUrl || null,
    position: input.position,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
  };
}

export async function createBanner(input: BannerInput) {
  return prisma.banner.create({ data: toData(input) });
}

export async function updateBanner(id: string, input: BannerInput) {
  return prisma.banner.update({ where: { id }, data: toData(input) });
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
}
