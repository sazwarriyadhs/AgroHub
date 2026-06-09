// app/(marketplace)/store/wishlist.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  removeByProductId: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { isInWishlist } = get();
        
        if (!isInWishlist(newItem.product_id)) {
          set({ items: [...get().items, { ...newItem, id: Date.now() }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      removeByProductId: (productId) => {
        set({ items: get().items.filter(item => item.product_id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.product_id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);