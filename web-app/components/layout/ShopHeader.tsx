'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  ShoppingCart,
  User,
  LogOut,
  Package,
} from 'lucide-react';

const LOGO = '/assets/logo/logo-agrohub.png';

export default function MarketplaceHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('user');

    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');

    document.cookie =
      'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    document.cookie =
      'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LEFT */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="relative w-12 h-12">
            <Image
              src={LOGO}
              alt="AgroHub"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="font-black text-2xl text-green-700">
              AgroHub
            </h1>

            <p className="text-xs text-slate-500">
              Marketplace
            </p>
          </div>
        </Link>

        {/* CENTER */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/">Beranda</Link>
          <Link href="/products">Produk</Link>
          <Link href="/promo">Promo</Link>
          <Link href="/stores">Toko</Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              
              <Link
                href="/profile"
                className="flex items-center gap-3 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-2xl transition"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold">
                    {user.name || 'User'}
                  </div>

                  <div className="text-xs text-slate-500">
                    {user.role || 'buyer'}
                  </div>
                </div>
              </Link>

              <button
                onClick={logout}
                className="w-11 h-11 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}