// app/(marketplace)/checkout/page.tsx

import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout Pembayaran | AgroHub",
  description: "Selesaikan pembayaran produk AgroHub dengan aman dan cepat.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Checkout Pembayaran
          </h1>

          <p className="mt-2 text-slate-500">
            Periksa kembali pesanan dan selesaikan pembayaran Anda.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-8">
            <CheckoutForm />
          </div>
        </div>

      </section>
    </main>
  );
}