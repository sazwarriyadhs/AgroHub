'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Search } from "lucide-react";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Produk", href: "/products" },
  { name: "Toko", href: "/stores" },
  { name: "Bantuan", href: "/help" },
];

export default function ShopNavbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname?.startsWith(href);
  };

  if (!mounted) {
    return (
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto p-6 animate-pulse h-28" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-3">
          {/* LOGO */}
          <Link href="/" className="shrink-0">
            <div className="relative w-[175px] h-[70px]">
              <Image
                src="/assets/logo/logo-agrohub.png"
                alt="AgroHub"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* SEARCH */}
          <div className="hidden lg:block w-[520px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Cari produk..."
                className="w-full h-11 rounded-full border border-slate-200 bg-slate-50 pl-11 pr-24 outline-none focus:ring-4 focus:ring-green-100"
              />
              <button className="absolute right-1 top-1 h-9 px-5 rounded-full bg-green-600 text-white text-sm">
                Cari
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Link href="/wishlist" className="p-2 rounded-full hover:bg-slate-100">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 rounded-full hover:bg-slate-100 relative">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm">
              Masuk
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="hidden lg:flex border-t py-4">
          <nav className="flex gap-7">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive(item.href) ? "text-green-600" : "text-slate-700 hover:text-green-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}