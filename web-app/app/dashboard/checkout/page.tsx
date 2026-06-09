"use client";

import {
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to create payment");
        return;
      }

      if (!window.snap) {
        alert("Midtrans Snap belum ter-load");
        return;
      }

      window.snap.pay(result.snap_token, {
        onSuccess: function () {
          alert("Payment success!");
          window.location.href = "/dashboard/orders";
        },

        onPending: function () {
          alert("Menunggu pembayaran...");
        },

        onError: function () {
          alert("Payment failed");
        },

        onClose: function () {
          alert("Popup pembayaran ditutup");
        },
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-2">
            Dashboard / Checkout
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Checkout Pesanan
          </h1>

          <p className="text-slate-500 mt-2">
            Selesaikan pembayaran dengan aman menggunakan escrow protection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <div className="flex items-start gap-5">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  Product Image
                </div>

                <div className="flex-1">
                  <p className="text-sm text-green-700 font-medium mb-2">
                    Verified Seller
                  </p>

                  <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Pupuk Organik Premium Super
                  </h2>

                  <p className="text-slate-500 mb-3">
                    CV Tani Makmur Official Store
                  </p>

                  <div className="flex items-center gap-6">
                    <p className="font-bold text-green-700 text-xl">
                      Rp 360.000
                    </p>

                    <p className="text-slate-500">
                      Qty: 1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-5">
                <MapPin className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-bold">
                  Alamat Pengiriman
                </h3>
              </div>

              <div className="border rounded-2xl p-5">
                <p className="font-semibold">
                  Ahmad Fauzi
                </p>

                <p className="text-slate-600 mt-2">
                  Jl. Raya Pertanian No. 88, Bandung,
                  Jawa Barat, Indonesia
                </p>

                <p className="text-slate-500 mt-2">
                  +62 812 3456 7890
                </p>
              </div>
            </div>

            {/* Courier */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-5">
                <Truck className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-bold">
                  Pilih Kurir
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "JNE Regular",
                    price: "Rp 18.000",
                    eta: "2–3 Hari",
                  },
                  {
                    name: "SiCepat BEST",
                    price: "Rp 22.000",
                    eta: "1–2 Hari",
                  },
                  {
                    name: "J&T Express",
                    price: "Rp 20.000",
                    eta: "2 Hari",
                  },
                ].map((courier, i) => (
                  <div
                    key={i}
                    className="border rounded-2xl p-4 flex items-center justify-between hover:border-green-700 cursor-pointer transition"
                  >
                    <div>
                      <p className="font-semibold">
                        {courier.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Estimasi: {courier.eta}
                      </p>
                    </div>

                    <p className="font-bold text-green-700">
                      {courier.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h3 className="text-lg font-bold mb-4">
                Catatan untuk Seller
              </h3>

              <textarea
                placeholder="Tambahkan catatan untuk penjual..."
                className="w-full h-32 border rounded-2xl p-4 outline-none resize-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-bold">
                  Ringkasan Pesanan
                </h3>
              </div>

              <div className="space-y-4 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span>Rp 360.000</span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span>Rp 18.000</span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Layanan</span>
                  <span>Rp 2.500</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg text-slate-800">
                  <span>Total Pembayaran</span>
                  <span className="text-green-700">
                    Rp 380.500
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-5">
                <CreditCard className="w-5 h-5 text-green-700" />
                <h3 className="text-lg font-bold">
                  Metode Pembayaran
                </h3>
              </div>

              <div className="border rounded-2xl p-4">
                <p className="font-semibold">
                  Midtrans Secure Payment
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  VA, QRIS, E-Wallet, Credit Card
                </p>
              </div>
            </div>

            {/* Escrow Protection */}
            <div className="bg-green-50 border border-green-200 rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-700" />

                <div>
                  <h4 className="font-bold text-green-800 mb-2">
                    Escrow Protection
                  </h4>

                  <p className="text-sm text-green-700 leading-relaxed">
                    Dana akan ditahan sementara hingga barang diterima dengan aman oleh buyer.
                  </p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold text-lg transition"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

