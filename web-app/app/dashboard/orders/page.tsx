const orders = [
  {
    id: "ORD-2026-001",
    product: "Pupuk Organik Premium",
    seller: "CV Tani Makmur Official Store",
    total: "Rp 380.500",
    status: "Menunggu Pembayaran",
  },
  {
    id: "ORD-2026-002",
    product: "Benih Padi Unggul",
    seller: "Agro Nusantara",
    total: "Rp 240.000",
    status: "Diproses Seller",
  },
  {
    id: "ORD-2026-003",
    product: "Sprayer Elektrik",
    seller: "Petani Modern",
    total: "Rp 650.000",
    status: "Selesai",
  },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-2">
            Dashboard / Pesanan
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Riwayat Pesanan
          </h1>

          <p className="text-slate-500 mt-2">
            Pantau seluruh transaksi dan status pesanan Anda
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    Order ID: {order.id}
                  </p>

                  <h2 className="text-xl font-bold text-slate-800">
                    {order.product}
                  </h2>

                  <p className="text-slate-500">
                    Seller: {order.seller}
                  </p>

                  <p className="text-green-700 font-bold text-lg">
                    {order.total}
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {order.status}
                  </span>

                  <button className="border border-green-700 text-green-700 px-5 py-2 rounded-xl font-medium hover:bg-green-50 transition">
                    Lihat Detail
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}

