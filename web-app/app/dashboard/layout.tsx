'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  User,
  Package,
  MessageCircle,
  Stethoscope,
  CreditCard,
  LogOut,
  Heart,
  Settings,
  Home,
  Store,
} from 'lucide-react';
import toast from 'react-hot-toast';

const menus = [
  // ===== MAIN DASHBOARD MENU =====
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Pesanan Saya',
    href: '/dashboard/orders',
    icon: Package
  },
  {
    name: 'Keranjang Belanja',
    href: '/dashboard/cart',  // ← PERBAIKAN: dari '/cart' menjadi '/dashboard/cart'
    icon: ShoppingCart
  },
  {
    name: 'Wishlist',
    href: '/dashboard/wishlist',
    icon: Heart
  },
  {
    name: 'Dompet Digital',
    href: '/dashboard/wallet',
    icon: Wallet
  },
  {
    name: 'Pesan',
    href: '/dashboard/chat',
    icon: MessageCircle
  },
  {
    name: 'Konsultasi AI',
    href: '/dashboard/doctor-ai',
    icon: Stethoscope
  },
  {
    name: 'Membership',
    href: '/dashboard/membership',
    icon: CreditCard
  },
  {
    name: 'Profil Saya',
    href: '/dashboard/profile',
    icon: User
  },
  {
    name: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings
  },
  
  // ===== EXTERNAL MARKETPLACE LINKS =====
  { divider: true, name: 'Marketplace' },
  {
    name: 'Beranda AgroHub',
    href: '/',
    icon: Home
  },
  {
    name: 'Semua Produk',
    href: '/products',
    icon: Store
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek autentikasi dan ambil data user
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Ambil data user dari localStorage
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    console.log('User data from localStorage:', { name, email, role });
    
    setUserName(name || 'Pengguna');
    setUserEmail(email || 'user@agrohub.com');
    setUserRole(role || 'customer');
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Hapus semua data user
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('cartCount');
    
    // Hapus cookies juga
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    toast.success('Berhasil logout');
    router.push('/login');
  };

  const isActive = (href: string) => {
    // Untuk link ke marketplace, jangan dianggap active
    if (href === '/' || href === '/products') {
      return false;
    }
    // Untuk dashboard home
    if (href === '/dashboard') {
      return pathname === href;
    }
    // Untuk halaman lain dalam dashboard
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full shadow-sm z-30">
        {/* LOGO */}
        <div className="p-5 border-b">
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src="/assets/logo/logo-agrohub.png"
              alt="AgroHub"
              width={150}
              height={70}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userEmail}
              </p>
              <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                {userRole === 'buyer' ? 'Pembeli' : userRole === 'seller' ? 'Penjual' : 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menus.map((menu, index) => {
            // Handle divider
            if ('divider' in menu) {
              return (
                <div key={index} className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-gray-400 font-medium">
                      {menu.name}
                    </span>
                  </div>
                </div>
              );
            }

            const Icon = menu.icon;
            const active = isActive(menu.href);

            return (
              <Link
                key={menu.name}
                href={menu.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                <Icon size={18} className={active ? 'text-green-600' : ''} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} />
            Keluar
          </button>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">AgroHub v1.0</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}