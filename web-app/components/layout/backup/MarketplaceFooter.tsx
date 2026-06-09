// components/layout/MarketplaceFooter.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, BadgePercent, Headphones } from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

export default function MarketplaceFooter() {
  return (
    <footer className="bg-gradient-to-r from-green-950 via-green-900 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 pb-8 border-b border-white/10">
          {[
            { icon: ShieldCheck, title: 'Produk Original', desc: '100% Terverifikasi' },
            { icon: Truck, title: 'Pengiriman Cepat', desc: 'Logistik Nasional' },
            { icon: BadgePercent, title: 'Harga Termurah', desc: 'Langsung Supplier' },
            { icon: Headphones, title: 'Dukungan 24/7', desc: 'Tim Ahli Siap Membantu' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-800/50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-green-200 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src={LOGO}
                  alt="AgroHub"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <h3 className="text-xl font-black">AgroHub</h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Marketplace pertanian modern dengan teknologi AI, supply chain digital, dan seller terpercaya Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Tentang Kami</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-green-100 text-sm hover:text-white transition">Perusahaan</Link></li>
              <li><Link href="/careers" className="text-green-100 text-sm hover:text-white transition">Karir</Link></li>
              <li><Link href="/blog" className="text-green-100 text-sm hover:text-white transition">Blog</Link></li>
              <li><Link href="/press" className="text-green-100 text-sm hover:text-white transition">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Bantuan</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-green-100 text-sm hover:text-white transition">Pusat Bantuan</Link></li>
              <li><Link href="/privacy" className="text-green-100 text-sm hover:text-white transition">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-green-100 text-sm hover:text-white transition">Syarat & Ketentuan</Link></li>
              <li><Link href="/faq" className="text-green-100 text-sm hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-green-100 text-sm">
              <li>📧 support@agrohub.id</li>
              <li>📞 +62 812 3456 7890</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-green-100/60 text-sm">
          <p>© 2026 AgroHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}