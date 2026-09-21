import { CartContents } from "@/components/storefront/CartContents";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-brand-primary font-heading mb-6">
        سلة التسوق
      </h1>
      <CartContents />
    </div>
  );
}
