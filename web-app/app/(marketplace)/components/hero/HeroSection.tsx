import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, BadgeCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="max-w-[1500px] mx-auto px-5 pt-4">
      <div className="relative overflow-hidden rounded-2xl h-[420px]">
        <Image src="/banner1.png" alt="Hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
        <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-[520px]">
          <h1 className="text-6xl leading-[1.05] font-black text-green-950">Belanja Cerdas<br />Panen Berkualitas</h1>
          <p className="mt-5 text-slate-700 text-xl leading-relaxed">Semua kebutuhan pertanian lengkap dengan harga terbaik langsung dari supplier terpercaya.</p>
          <Link href="/products" className="inline-flex mt-8 h-[56px] px-8 rounded-xl bg-green-700 text-white font-bold items-center gap-3 hover:bg-green-800 transition">
            Belanja Sekarang <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute right-10 top-10 bg-green-700/90 backdrop-blur-md rounded-2xl p-6 text-white w-[260px]">
          <div className="flex items-center gap-4 mb-6"><ShieldCheck className="w-10 h-10" /><div><h3 className="font-black text-2xl">Seller</h3><p className="font-semibold">Terverifikasi</p></div></div>
          <div className="flex items-center gap-4"><BadgeCheck className="w-10 h-10" /><div><h3 className="font-bold">Transaksi Aman</h3><p className="text-sm text-white/80">100% Terlindungi</p></div></div>
        </div>
      </div>
    </section>
  );
}