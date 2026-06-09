import { formatCurrency } from '@/lib/utils/currency';

interface MarketSectionProps {
  ricePrice: number;
  cornPrice: number;
}

export function MarketSection({ ricePrice, cornPrice }: MarketSectionProps) {
  return (
    <section className="max-w-[1500px] mx-auto px-5 mt-4">
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1 bg-[#F4FBF4] border border-green-200 rounded-xl p-6"><h2 className="text-3xl font-black text-green-900">Market Intelligence</h2></div>
        <div className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-sm text-slate-500">Harga Padi Hari Ini</p><div className="flex items-end justify-between mt-2"><h3 className="text-2xl font-black text-slate-900">{formatCurrency(ricePrice || 5650)}/kg</h3><span className="text-green-600 font-bold text-sm">+2.15%</span></div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-sm text-slate-500">Harga Jagung Hari Ini</p><div className="flex items-end justify-between mt-2"><h3 className="text-2xl font-black text-slate-900">{formatCurrency(cornPrice || 4200)}/kg</h3><span className="text-green-600 font-bold text-sm">+1.85%</span></div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-sm text-slate-500">Curah Hujan</p><div className="flex items-end justify-between mt-2"><h3 className="text-2xl font-black text-blue-600">Tinggi</h3><span className="text-blue-600 font-bold text-sm">85%</span></div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between"><div><p className="text-sm text-slate-500">Rekomendasi Tanam</p><h3 className="font-black text-slate-900 mt-1">Padi, Jagung, Cabai</h3><p className="text-xs text-slate-500 mt-1">3 komoditas</p></div><button className="text-green-700 font-bold text-sm">Detail</button></div>
      </div>
    </section>
  );
}