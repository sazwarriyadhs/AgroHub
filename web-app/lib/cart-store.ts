import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  addItem: (
    item: Omit<CartItem, "qty">
  ) => void;

  removeItem: (id: string) => void;

  increaseQty: (id: string) => void;

  decreaseQty: (id: string) => void;

  clearCart: () => void;
};

export const useCartStore =
  create<CartState>()(
    persist(
      (set) => ({
        items: [],
        isOpen: false,

        openCart: () =>
          set({ isOpen: true }),

        closeCart: () =>
          set({ isOpen: false }),

        addItem: (item) =>
          set((state) => {
            const exist =
              state.items.find(
                (i) => i.id === item.id
              );

            if (exist) {
              return {
                items: state.items.map(
                  (i) =>
                    i.id === item.id
                      ? {
                          ...i,
                          qty: i.qty + 1,
                        }
                      : i
                ),
                isOpen: true,
              };
            }

            return {
              items: [
                ...state.items,
                {
                  ...item,
                  qty: 1,
                },
              ],
              isOpen: true,
            };
          }),

        removeItem: (id) =>
          set((state) => ({
            items:
              state.items.filter(
                (i) => i.id !== id
              ),
          })),

        increaseQty: (id) =>
          set((state) => ({
            items:
              state.items.map((i) =>
                i.id === id
                  ? {
                      ...i,
                      qty: i.qty + 1,
                    }
                  : i
              ),
          })),

        decreaseQty: (id) =>
          set((state) => ({
            items:
              state.items
                .map((i) =>
                  i.id === id
                    ? {
                        ...i,
                        qty: i.qty - 1,
                      }
                    : i
                )
                .filter(
                  (i) => i.qty > 0
                ),
          })),

        clearCart: () =>
          set({
            items: [],
          }),
      }),
      {
        name: "agrohub-cart",
      }
    )
  );