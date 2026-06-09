'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Settings,
  UserCircle,
  Package,
  Heart,
  CreditCard,
  MapPin,
  Wallet,
  BadgeCheck,
  ShoppingBag,
  HelpCircle,
  FileText,
  Shield,
  Award,
  TrendingUp,
  Store,
  BookOpen,
} from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  roleName: string;
  displayName: string;
  initial: string;
  isVerified: boolean;
  wallet_balance?: number;
  points?: number;
  available_balance?: number;
  hold_balance?: number;
  total_orders?: number;
  membership_tier?: string;
}

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

export function ProfileDropdown({ isOpen, onClose, user, onLogout }: ProfileDropdownProps) {
  const router = useRouter();

  if (!isOpen) return null;

  // Handle menu click
  const handleMenuClick = (href: string) => {
    onClose();
    router.push(href);
  };

  // Jika user tidak login
  if (!user) {
    return (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Belum Login</h3>
            <p className="text-slate-500 text-sm mt-1">Login untuk menikmati semua fitur AgroHub</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition text-center"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full py-3 border border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition text-center"
                onClick={onClose}
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default values untuk user
  const displayName = user.displayName || user.name || 'Pengguna';
  const userInitial = user.initial || (user.name ? user.name.charAt(0).toUpperCase() : 'U');
  const userEmail = user.email || 'email@example.com';
  const userRole = user.roleName || (user.role === 'farmer' ? 'Petani' : user.role === 'vendor' ? 'Vendor' : user.role === 'seller' ? 'Penjual' : user.role === 'admin' ? 'Admin' : 'Member');

  // Menu items yang sudah dipastikan halamannya ada
  const menuItems = [
    { icon: UserCircle, label: 'Profil Saya', href: '/profile', available: true },
    { icon: Package, label: 'Pesanan Saya', href: '/orders', available: true },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', available: true },
    { icon: MapPin, label: 'Alamat Saya', href: '/addresses', available: false },
    { icon: Wallet, label: 'Dompet Digital', href: '/wallet', available: true },
    { icon: Award, label: 'Membership', href: '/membership', available: false },
    { icon: FileText, label: 'Riwayat Transaksi', href: '/transactions', available: false },
    { icon: BookOpen, label: 'Pusat Pengetahuan', href: '/knowledge', available: true },
    { icon: HelpCircle, label: 'Pusat Bantuan', href: '/help', available: true },
    { icon: Settings, label: 'Pengaturan', href: '/settings', available: false },
  ];

  // Filter menu yang available (halaman sudah ada)
  const availableMenuItems = menuItems.filter(item => item.available);

  // Menu khusus seller (jika role seller/vendor)
  const sellerMenu = (user.role === 'seller' || user.role === 'vendor') ? [
    { icon: Store, label: 'Kelola Toko', href: '/seller', available: true },
    { icon: ShoppingBag, label: 'Kelola Produk', href: '/seller/products', available: false },
    { icon: TrendingUp, label: 'Analytics', href: '/seller/analytics', available: false },
  ] : [];

  // Menu khusus admin
  const adminMenu = (user.role === 'admin') ? [
    { icon: Shield, label: 'Admin Dashboard', href: '/admin', available: true },
    { icon: ShoppingBag, label: 'Kelola Produk', href: '/admin/products', available: false },
    { icon: Users, label: 'Kelola User', href: '/admin/users', available: false },
  ] : [];

  const allMenuItems = [...availableMenuItems, ...sellerMenu, ...adminMenu];

  // Tampilkan membership tier badge
  const getMembershipBadge = () => {
    const tier = user.membership_tier || 'bronze';
    const badges: Record<string, { label: string; color: string }> = {
      bronze: { label: 'Bronze Member', color: 'bg-amber-100 text-amber-700' },
      silver: { label: 'Silver Member', color: 'bg-gray-100 text-gray-700' },
      gold: { label: 'Gold Member', color: 'bg-yellow-100 text-yellow-700' },
      platinum: { label: 'Platinum Member', color: 'bg-purple-100 text-purple-700' },
    };
    return badges[tier] || badges.bronze;
  };

  const membershipBadge = getMembershipBadge();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
        {/* Header Profile */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              {userInitial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-900">{displayName}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${membershipBadge.color}`}>
                  {membershipBadge.label}
                </span>
              </div>
              <p className="text-sm text-slate-500">{userEmail}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                  {userRole}
                </span>
                {user.isVerified && (
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {/* Wallet Balance */}
            <div className="p-2 bg-white/60 rounded-lg">
              <p className="text-xs text-slate-500">Saldo Wallet</p>
              <p className="font-bold text-green-700">{formatCurrency(user.wallet_balance || 0)}</p>
            </div>

            {/* Points */}
            <div className="p-2 bg-white/60 rounded-lg">
              <p className="text-xs text-slate-500">Poin Reward</p>
              <p className="font-bold text-purple-600">{formatNumber(user.points || 0)}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2 max-h-[400px] overflow-y-auto">
          {allMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-green-600" />
              <span className="text-sm text-slate-700 group-hover:text-green-700">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t border-slate-100 p-2">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition w-full group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
            <span className="text-sm text-red-600 font-semibold group-hover:text-red-700">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}

// Import untuk admin
import { Users } from 'lucide-react';