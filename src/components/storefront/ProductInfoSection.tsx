"use client";

import { useState } from "react";
import { CustomizationPanel } from "@/components/storefront/CustomizationPanel";
import type { Product, ProductCustomization } from "@/types";

export function ProductInfoSection({ product }: { product: Product }) {
  const [customization, setCustomization] = useState<ProductCustomization>({});

  if (!product.customizationEnabled) return null;

  return (
    <div className="mt-6">
      <CustomizationPanel
        product={product}
        customization={customization}
        onChange={setCustomization}
      />
    </div>
  );
}
