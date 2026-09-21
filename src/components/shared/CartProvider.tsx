"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductCustomization } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    customization?: ProductCustomization
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItems: () => CartItem[];
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "knoz-cart";

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silently fail
  }
}

function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function customizationKey(c: ProductCustomization): string {
  return [
    c.name ?? "",
    c.theme?.id ?? "",
    c.sticker?.id ?? "",
    c.notes ?? "",
    c.imageUrl ?? "",
  ].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [loaded] = useState(true);

  useEffect(() => {
    if (loaded) {
      saveCartToStorage(items);
    }
  }, [items, loaded]);

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number,
      customization: ProductCustomization = {}
    ) => {
      setItems((prev) => {
        const existingKey = customizationKey(customization);
        const existing = prev.find(
          (item) =>
            item.product.id === product.id &&
            customizationKey(item.customization) === existingKey
        );
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            id: generateCartItemId(),
            product,
            quantity,
            customization,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartItems = useCallback(() => items, [items]);

  const getCartTotal = useCallback(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const getCartCount = useCallback(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItems,
      getCartTotal,
      getCartCount,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItems,
      getCartTotal,
      getCartCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
export type { CartContextValue };
