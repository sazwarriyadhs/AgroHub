// C:\taniapp\agrohub\web-app\app\(marketplace)\promo\page.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  Flame,
  Sparkles,
  Clock3,
  BadgePercent,
  ArrowRight,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Gift,
  Zap,
} from 'lucide-react';

// ======================================================
// CONFIG
// ======================================================

const LOGO = '/assets/logo/logo-agrohub.png';

const flashSaleProducts = [
  {
    id: 1,
    name: 'Pupuk Organik Premium',
    image: '/banner1.png',
    price: 'Rp 180.000',
    oldPrice: 'Rp 250.000',
    discount: '28%',
    sold: 1240,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Drone Pertanian AI',
    image: '/banner2.png',
    price: 'Rp 14.500.000',
    oldPrice: 'Rp 16.500.000',
    discount: '12%',
    sold: 88,
    rating: 5.0,
  },
  {
    id: 3,
    name: 'Sensor IoT Smart Farming',
    image: '/banner3.png',
    price: 'Rp 850.000',
    oldPrice: 'Rp 950.000',
    discount: '10%',
    sold: 230,
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Pompa Irigasi Otomatis',
    image: '/banner1.png',
    price: 'Rp 780.000',
    oldPrice: 'Rp 920.000',
    discount: '15%',
    sold: 445,
    rating: 4.7,
  },
];

const promoCards = [
  {
    title: 'Flash Sale',
    desc: 'Diskon kilat setiap hari',
    icon: Flame,
    gradient: 'from-red-500 to-orange-500',
  },
  {
    title: 'Gratis Ongkir',
    desc: 'Seluruh Indonesia',
    icon: Truck,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Produk Original',
    desc: '100% terpercaya',
    icon: ShieldCheck,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Cashback',
    desc: 'Belanja makin hemat',
    icon: Gift,
    gradient: 'from-purple-500 to-pink-500',
  },
];

// ======================================================
// PAGE
// ======================================================

export default function PromoPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] overflow-hidden">
      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/20 text-white px-5 py-3 rounded-full text-sm font-bold mb-7">
                <Sparkles className="w-4 h-4" />
                Promo Spesial AgroHub
              </div>

              <h1 className="text-6xl lg:text-7xl font-black text-white leading-none">
                Diskon
                <br />
                Hingga 70%
              </h1>

              <p className="text-white/85 text-lg mt-7 leading-relaxed max-w-xl">
                Belanja kebutuhan pertanian modern dengan
                harga terbaik langsung dari supplier &
                distributor terpercaya Indonesia.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/products">
                  <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all">
                    Belanja Sekarang
                  </button>
                </Link>

                <button className="border border-white/30 bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition">
                  Lihat Semua Promo
                </button>
              </div>

              {/* COUNTDOWN */}
              <div className="mt-10 flex items-center gap-4 flex-wrap">
                {[
                  { value: '12', label: 'Jam' },
                  { value: '45', label: 'Menit' },
                  { value: '22', label: 'Detik' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-4 text-center min-w-[100px]"
                  >
                    <div className="text-3xl font-black text-white">
                      {item.value}
                    </div>

                    <div className="text-white/70 text-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="relative h-[520px] rounded-[40px] overflow-hidden border border-white/20 shadow-2xl">
                <Image
                  src="/banner2.png"
                  alt="Promo"
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/70 text-sm">
                          Flash Sale Hari Ini
                        </div>

                        <div className="text-3xl font-black text-white mt-1">
                          SUPER BIG SALE
                        </div>
                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-red-600 px-6 py-4 rounded-3xl font-black text-2xl shadow-2xl rotate-6">
                70% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PROMO FEATURES */}
      {/* ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {promoCards.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100 hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
              >
                <item.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mt-5">
                {item.title}
              </h3>

              <p className="text-slate-500 mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* FLASH SALE */}
      {/* ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Clock3 className="w-4 h-4" />
              Berakhir Dalam 12:45:22
            </div>

            <h2 className="text-5xl font-black text-slate-900">
              Flash Sale 🔥
            </h2>
          </div>

          <Link href="/products">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              Semua Produk
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
            >
              <div className="group bg-white rounded-[32px] overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-2xl text-sm font-black shadow-lg">
                    -{product.discount}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {product.rating}
                  </div>

                  <h3 className="font-bold text-slate-800 mt-3 line-clamp-2 min-h-[52px]">
                    {product.name}
                  </h3>

                  <div className="mt-4">
                    <div className="text-2xl font-black text-red-600">
                      {product.price}
                    </div>

                    <div className="text-sm text-slate-400 line-through">
                      {product.oldPrice}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      {product.sold} terjual
                    </div>

                    <button className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:scale-110 transition">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================================================== */}
      {/* BIG CTA */}
      {/* ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-green-900 via-green-800 to-emerald-700 p-12">
          <div className="absolute top-0 right-0 opacity-10 text-[250px]">
            🌾
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-green-100 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <BadgePercent className="w-4 h-4" />
                Promo Khusus Petani Indonesia
              </div>

              <h2 className="text-5xl font-black text-white leading-tight">
                Belanja Hemat
                <br />
                Panen Meningkat
              </h2>

              <p className="text-green-100 text-lg mt-6 leading-relaxed">
                Dapatkan berbagai produk pertanian modern
                dengan promo eksklusif AgroHub.
              </p>

              <div className="flex gap-4 mt-10 flex-wrap">
                <Link href="/products">
                  <button className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black hover:scale-105 transition">
                    Mulai Belanja
                  </button>
                </Link>

                <button className="border border-white/20 bg-white/10 text-white px-8 py-4 rounded-2xl font-bold">
                  Gabung Seller
                </button>
              </div>
            </div>

            <div className="relative h-[360px]">
              <Image
                src={LOGO}
                alt="AgroHub"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}