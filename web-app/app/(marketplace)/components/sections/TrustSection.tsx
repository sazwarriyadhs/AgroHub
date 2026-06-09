import { ShieldCheck, TrendingUp, Truck, Headphones } from 'lucide-react';

export function TrustSection() {
  const items = [
    { title: 'Produk Terpercaya', desc: '100% produk asli', icon: ShieldCheck },
    { title: 'Harga Kompetitif', desc: 'Langsung dari petani', icon: TrendingUp },
    { title: 'Pengiriman Cepat', desc: 'Logistik terintegrasi', icon: Truck },
    { title: 'Dukungan Petani', desc: 'Tim ahli 24/7', icon: Headphones }
  ];
  
  return (
    <section className="max-w-[1500px] mx-auto px-5 mt-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.title} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 flex items-center gap-4 hover:shadow-xl transition">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center"><item.icon className="w-7 h-7 text-green-700" /></div>
            <div><h3 className="font-bold text-slate-800">{item.title}</h3><p className="text-sm text-slate-500">{item.desc}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}