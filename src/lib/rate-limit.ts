import { prisma } from "@/lib/prisma";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = new Date();

  const bucket = await prisma.rateLimit.findUnique({ where: { key } });

  if (!bucket || bucket.resetAt <= now) {
    await prisma.$transaction([
      prisma.rateLimit.deleteMany({ where: { resetAt: { lte: now } } }),
      prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt: new Date(Date.now() + windowMs) },
        create: { key, count: 1, resetAt: new Date(Date.now() + windowMs) },
      }),
    ]);
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000)),
    };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return { allowed: true, retryAfter: 0 };
}