import Link from 'next/link';

export function PromoBanner() {
  return (
    <section className="max-w-[1500px] mx-auto px-5 mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 p-10">
        <div className="absolute -right-10 -bottom-10 text-[180px] opacity-10">🔥</div>
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <p className="text-white/80 font-semibold">Promo Spesial Petani</p>
            <h2 className="text-5xl font-black text-white mt-2">Diskon Hingga 70%</h2>
            <p className="text-white/80 mt-3 text-lg">untuk produk pertanian pilihan</p>
          </div>
          <div className="flex gap-4">
            <Link href="/products?discount=true">
              <button className="h-[54px] px-8 rounded-xl bg-white text-red-500 font-bold hover:shadow-xl transition">Belanja Promo</button>
            </Link>
            <Link href="/promo">
              <button className="h-[54px] px-8 rounded-xl border border-white/30 text-white font-bold backdrop-blur-md hover:bg-white/10 transition">Lihat Detail</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}