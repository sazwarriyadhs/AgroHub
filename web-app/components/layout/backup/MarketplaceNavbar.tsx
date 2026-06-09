// components/layout/MarketplaceNavbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  ChevronDown,
  X 
} from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

export default function MarketplaceNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-32 h-10">
              <Image
                src={LOGO}
                alt="AgroHub"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-green-700 transition">
              Beranda
            </Link>
            <Link href="/products" className="text-slate-700 hover:text-green-700 transition">
              Produk
            </Link>
            <Link href="/stores" className="text-slate-700 hover:text-green-700 transition">
              Toko
            </Link>
            <Link href="/promo" className="text-slate-700 hover:text-green-700 transition">
              Promo
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-white/50 focus:border-green-500 focus:outline-none transition text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Link>
            <Link href="/wishlist" className="hidden sm:block">
              <Heart className="w-5 h-5 text-slate-700" />
            </Link>
            <div className="hidden md:flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition" />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-white/50 focus:border-green-500 focus:outline-none transition text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-slate-700 hover:text-green-700 transition py-2">
                Beranda
              </Link>
              <Link href="/products" className="text-slate-700 hover:text-green-700 transition py-2">
                Produk
              </Link>
              <Link href="/stores" className="text-slate-700 hover:text-green-700 transition py-2">
                Toko
              </Link>
              <Link href="/promo" className="text-slate-700 hover:text-green-700 transition py-2">
                Promo
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}