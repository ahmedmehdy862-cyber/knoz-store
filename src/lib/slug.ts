export function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
  return base || "item";
}

export async function uniqueSlug(
  exists: (slug: string) => Promise<boolean>,
  name: string,
  excludeSelf = false,
  currentSlug?: string
): Promise<string> {
  const base = slugify(name);
  if (excludeSelf && currentSlug === base) return base;
  if (!(await exists(base))) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (excludeSelf && currentSlug === candidate) return candidate;
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}-${Date.now()}`;
}