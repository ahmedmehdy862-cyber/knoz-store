import { prisma } from "@/lib/prisma";

export async function getStickers() {
  return prisma.sticker.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveStickers() {
  return prisma.sticker.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createSticker(data: any) {
  return prisma.sticker.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      previewUrl: data.previewUrl,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateSticker(id: string, data: any) {
  return prisma.sticker.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      previewUrl: data.previewUrl,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  });
}

export async function deleteSticker(id: string) {
  return prisma.sticker.delete({ where: { id } });
}
