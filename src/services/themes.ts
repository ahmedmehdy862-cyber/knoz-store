import { prisma } from "@/lib/prisma";

export async function getThemes() {
  return prisma.theme.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActiveThemes() {
  return prisma.theme.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createTheme(data: any) {
  return prisma.theme.create({
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

export async function updateTheme(id: string, data: any) {
  return prisma.theme.update({
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

export async function deleteTheme(id: string) {
  return prisma.theme.delete({ where: { id } });
}
