'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/banner1.png',
    title: 'Belanja Cerdas',
    subtitle: 'Panen Berkualitas',
    desc: 'Semua kebutuhan pertanian lengkap dengan harga terbaik langsung dari supplier terpercaya.',
  },
  {
    image: '/banner2.png',
    title: 'Teknologi Modern',
    subtitle: 'Untuk Petani Indonesia',
    desc: 'Gunakan IoT, sensor tanah, dan sistem pertanian modern untuk hasil maksimal.',
  },
  {
    image: '/banner3.png',
    title: 'Produk Terbaik',
    subtitle: 'Harga Bersahabat',
    desc: 'Marketplace pertanian terpercaya dengan seller verified dan transaksi aman.',
  },
];

export default function HeroBannerSlider() {
  return (
    <section className="max-w-[1500px] mx-auto px-5 pt-5">
      <div className="grid lg:grid-cols-4 gap-5">
        
        {/* HERO */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl h-[480px] shadow-2xl">
          
          <Image
            src={slides[0].image}
            alt="Hero Banner"
            fill
            priority
            className="object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute left-10 lg:left-16 top-1/2 -translate-y-1/2 max-w-[620px]"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-300/30 text-white text-sm backdrop-blur-md">
              🌾 Marketplace Pertanian Modern
            </div>

            <h1 className="mt-6 text-5xl lg:text-7xl leading-tight font-black text-white">
              {slides[0].title}
              <br />
              <span className="text-green-300">
                {slides[0].subtitle}
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-[540px]">
              {slides[0].desc}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="h-[58px] px-8 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:scale-105">
                Belanja Sekarang

                <ChevronRight className="w-5 h-5" />
              </button>

              <button className="h-[58px] px-8 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </motion.div>
        </div>

        {/* SIDE INFO */}
        <div className="flex flex-col gap-5">
          
          <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-6 text-white shadow-xl flex-1">
            <h3 className="text-2xl font-black">
              Seller Verified
            </h3>

            <p className="text-white/80 mt-3 leading-relaxed">
              Semua seller telah melalui proses verifikasi dan quality control.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                🛡️
              </div>

              <div>
                <h4 className="font-bold">
                  Transaksi Aman
                </h4>

                <p className="text-sm text-white/70">
                  Escrow Protection
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900">
              Statistik Hari Ini
            </h3>

            <div className="mt-5 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  Produk Aktif
                </span>

                <span className="font-black text-green-700">
                  12.580+
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  Seller Aktif
                </span>

                <span className="font-black text-blue-600">
                  2.430+
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  Transaksi
                </span>

                <span className="font-black text-orange-500">
                  89.200+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}