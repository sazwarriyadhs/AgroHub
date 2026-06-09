// app/(marketplace)/store/cart.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateQuantityByChange: (id: number, change: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find(item => item.product_id === newItem.product_id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + newItem.quantity;
          if (newQuantity <= existingItem.stock) {
            set({
              items: items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            });
          }
        } else {
          set({ items: [...items, { ...newItem, id: Date.now() }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const item = items.find(i => i.id === id);
        
        if (item && quantity > 0 && quantity <= item.stock) {
          set({
            items: items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          });
        } else if (quantity <= 0) {
          get().removeItem(id);
        }
      },

      updateQuantityByChange: (id, change) => {
        const { items } = get();
        const item = items.find(i => i.id === id);
        
        if (item) {
          const newQuantity = item.quantity + change;
          get().updateQuantity(id, newQuantity);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);