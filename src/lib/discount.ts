export function getDiscountPercent(price: number, oldPrice?: number | null): number {
  if (!oldPrice || !price || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function oldPriceFromDiscount(price: number, percent: number): number {
  if (!price || !percent || percent <= 0 || percent >= 100) return 0;
  return Math.round(price / (1 - percent / 100));
}

export function hasDiscount(price: number, oldPrice?: number | null): boolean {
  return getDiscountPercent(price, oldPrice) > 0;
}