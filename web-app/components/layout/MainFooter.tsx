import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Agro<span className="text-green-400">Hub</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Marketplace pertanian modern dengan seller verified dan escrow protection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400"><Facebook /></a>
              <a href="#" className="hover:text-green-400"><Twitter /></a>
              <a href="#" className="hover:text-green-400"><Instagram /></a>
              <a href="#" className="hover:text-green-400"><Youtube /></a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-green-400">Tentang Kami</Link></li>
              <li><Link href="/career" className="text-gray-400 hover:text-green-400">Karir</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-green-400">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-green-400">Pusat Bantuan</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-green-400">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-green-400">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@agrohub.id</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +62 812 3456 7890</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 AgroHub Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
