// ============================================================
// 购物车状态管理 (Zustand)
// 支持访客和登录用户，持久化到 localStorage
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  variantValue?: string;
  price: number;
  quantity: number;
  maxQuantity: number; // 库存上限
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        // 检查是否已存在相同商品+规格
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantValue === item.variantValue
        );

        if (existingIndex > -1) {
          // 已存在，增加数量
          const newItems = [...items];
          const existing = newItems[existingIndex];
          const newQuantity = existing.quantity + item.quantity;
          newItems[existingIndex] = {
            ...existing,
            quantity: Math.min(newQuantity, existing.maxQuantity),
          };
          set({ items: newItems });
        } else {
          // 新商品
          set({
            items: [
              ...items,
              { ...item, id: `${item.productId}-${item.variantValue || "default"}-${Date.now()}` },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "zshop-cart",
    }
  )
);
