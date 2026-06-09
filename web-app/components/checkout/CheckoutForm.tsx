"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/lib/cart-store";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CheckoutForm() {
  const router = useRouter();

  const { items, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [items]);

  const handleCheckout = async () => {
    if (!customerName || !phone || !address) {
      alert("Lengkapi data checkout");
      return;
    }

    if (items.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    try {
      setLoading(true);

      // nanti ganti ke API backend
      const payload = {
        customer_name: customerName,
        phone,
        address,
        notes,
        items,
        total,
      };

      console.log("ORDER PAYLOAD:", payload);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      clearCart();

      alert("Pesanan berhasil dibuat");

      router.push("/");
    } catch (error) {
      console.error(error);

      alert("Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Keranjang Kosong
        </h2>

        <p className="text-gray-500 mb-5">
          Tambahkan produk terlebih dahulu
        </p>

        <Button
          variant="primary"
          className="w-auto px-6"
          onClick={() => router.push("/")}
        >
          Kembali Belanja
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* FORM */}
      <Card className="p-5 md:col-span-2">
        <h2 className="text-lg font-semibold mb-5">
          Data Pengiriman
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="Nama Lengkap"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
          />

          <Input
            placeholder="Nomor HP"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <textarea
            rows={5}
            placeholder="Alamat Lengkap"
            className="w-full border rounded-lg p-3 outline-none"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
          />

          <textarea
            rows={3}
            placeholder="Catatan Pesanan (opsional)"
            className="w-full border rounded-lg p-3 outline-none"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />
        </div>
      </Card>

      {/* SUMMARY */}
      <Card className="p-5 h-fit sticky top-24">
        <h2 className="text-lg font-semibold mb-4">
          Ringkasan Order
        </h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <div>
                <p>{item.name}</p>

                <span className="text-gray-500">
                  {item.qty} x Rp{" "}
                  {item.price.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

              <p className="font-medium">
                Rp{" "}
                {(item.price * item.qty).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-5 pt-5">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>

            <span>
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <Button
          fullWidth
          className="mt-5"
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading
            ? "Memproses..."
            : "Buat Pesanan"}
        </Button>
      </Card>
    </div>
  );
}