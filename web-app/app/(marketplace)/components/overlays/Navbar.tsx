// app/(marketplace)/components/overlays/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  Search,
  X,
  LogOut,
  Settings,
  Package,
  ChevronDown,
} from 'lucide-react';

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Produk', href: '/products' },
  { name: 'Toko', href: '/stores' },
  { name: 'Artikel', href: '/articles' },
  { name: 'Promo', href: '/promo' },
  { name: 'Bantuan', href: '/help' },
];

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  isProfileOpen: boolean;
  user: any;
  onLogout: () => void;
  categories: any[];
}

export function Navbar({
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  isProfileOpen,
  user,
  onLogout,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}`
    );

    setMobileMenuOpen(false);
    setSearchQuery('');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
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

        {/* ================= TOP BAR ================= */}

        <div className="flex items-center justify-between py-3">

          {/* LOGO FIXED */}
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

          {/* ACTIONS */}

          <div className="flex items-center gap-2">

            {/* Wishlist */}

            <button
              onClick={onWishlistClick}
              className="relative p-2 rounded-full hover:bg-slate-100"
            >
              <Heart className="w-5 h-5" />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

            {/* CART */}

            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-slate-100"
            >
              <ShoppingCart className="w-5 h-5" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* PROFILE */}

            {user ? (
              <div className="relative">

                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100"
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-700" />
                  </div>

                  <span className="hidden md:block text-sm">
                    {user.name || user.email}
                  </span>

                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileOpen && (

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">

                    <Link
                      href="/dashboard"
                      className="flex gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="flex gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </Link>

                    <button
                      onClick={onLogout}
                      className="flex gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>

                  </div>

                )}

              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm"
              >
                Masuk
              </Link>
            )}

            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>

        {/* ================= MENU + SEARCH ================= */}

        <div className="hidden lg:flex items-center justify-between border-t py-4">

          <nav className="flex gap-7">

            {navigation.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive(item.href)
                    ? 'text-green-600'
                    : 'text-slate-700 hover:text-green-600'
                }`}
              >
                {item.name}
              </Link>

            ))}

          </nav>

          <form
            onSubmit={handleSearch}
            className="w-[520px]"
          >
            <div className="relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Cari produk, toko, atau artikel..."
                className="w-full h-11 rounded-full border border-slate-200 bg-slate-50 pl-11 pr-24 outline-none focus:ring-4 focus:ring-green-100"
              />

              <button
                className="absolute right-1 top-1 h-9 px-5 rounded-full bg-green-600 text-white text-sm"
              >
                Cari
              </button>

            </div>
          </form>

        </div>

        {/* MOBILE */}

        {mobileMenuOpen && (

          <div className="lg:hidden border-t py-4 space-y-3">

            {navigation.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                className="block py-2"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                {item.name}
              </Link>

            ))}

            <form onSubmit={handleSearch}>

              <div className="relative">

                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                <input
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Cari produk..."
                  className="w-full border rounded-xl pl-10 py-3"
                />

              </div>

            </form>

          </div>

        )}

      </div>

    </header>
  );
}