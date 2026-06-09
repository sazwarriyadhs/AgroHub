"use client";

import { useCartStore } from "@/lib/cart-store";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCartStore();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between">
          <h2 className="font-bold">Keranjang</h2>
          <button onClick={closeCart}>✕</button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto h-[70%]">
          {items.length === 0 && (
            <p className="text-gray-500">Keranjang kosong</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="border p-2 rounded">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-green-600 text-sm">
                Rp {item.price.toLocaleString("id-ID")}
              </p>

              <div className="flex gap-2 mt-2 items-center">
                <button onClick={() => decreaseQty(item.id)}>
                  -
                </button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>
                  +
                </button>
              </div>

              <button
                className="text-red-500 text-xs mt-1"
                onClick={() => removeItem(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="font-bold mb-2">
            Total: Rp {total.toLocaleString("id-ID")}
          </div>

          <Button className="w-full">Checkout</Button>
        </div>
      </div>
    </>
  );
}