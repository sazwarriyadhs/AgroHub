// app/(marketplace)/components/sections/Footer.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, BadgeCheck } from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

export function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-r from-green-950 to-green-900 text-white">
      <div className="max-w-[1500px] mx-auto px-5 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative w-[160px] h-[70px]">
                <Image src={LOGO} alt="AgroHub" fill className="object-contain brightness-0 invert" />
              </div>
            </div>
            <p className="text-white/70 mt-4 leading-relaxed">
              Marketplace pertanian modern dengan seller verified dan escrow protection.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Tentang Kami</h3>
            <ul className="space-y-3 text-white/70">
              <li>Perusahaan</li>
              <li>Karir</li>
              <li>Blog</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Bantuan</h3>
            <ul className="space-y-3 text-white/70">
              <li>Pusat Bantuan</li>
              <li>Kebijakan Privasi</li>
              <li>Syarat & Ketentuan</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3 text-white/70">
              <li>support@agrohub.id</li>
              <li>+62 812 3456 7890</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Keamanan</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-white/70">SSL Secure Connection</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-5 h-5 text-green-400" />
                <span className="text-white/70">Data terenkripsi 256-bit</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          © 2026 AgroHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}